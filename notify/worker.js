/* Cloudflare Worker. Cron sends prayer reminders to saved subscriptions.
   It does not run until someone deploys it and sets the secrets named in SETUP.md.
   Prayer times match the Austin estimate in index.html (ISNA-style angles, later Asr).
   That is the app's clock, not a live feed from the mosque. */

const PRAYERS = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' }
];

const AUSTIN = { lat: 30.2672, lon: -97.7431 };
const ANGLES = { fajr: 15, isha: 15, asrFactor: 2 };
const WUDU_MIN = 15;
const CLOSE_MIN = 15;
const WINDOW_MS = 8 * 60 * 1000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/subscribe') return saveSub(request, env);
    if (request.method === 'POST' && url.pathname === '/unsubscribe') return dropSub(request, env);
    if (request.method === 'GET' && url.pathname === '/health') {
      return Response.json({ ok: true, sender: 'dua-book', clock: 'austin-estimate' });
    }
    return new Response('Dua Book reminders', { status: 200 });
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(sendDue(env, Date.now()));
  }
};

async function saveSub(request, env) {
  let body;
  try { body = await request.json(); } catch (e) { return new Response('bad json', { status: 400 }); }
  if (!body || !body.endpoint || !body.keys) return new Response('missing subscription', { status: 400 });
  const id = await sha(body.endpoint);
  const prefs = {
    wudu: body.prefs ? body.prefs.wudu !== false : true,
    start: body.prefs ? body.prefs.start !== false : true,
    close: body.prefs ? body.prefs.close !== false : true
  };
  await env.SUBS.put(id, JSON.stringify({ sub: body, prefs, tz: 'America/Chicago' }));
  return Response.json({ ok: true, id });
}

async function dropSub(request, env) {
  let body = {};
  try { body = await request.json(); } catch (e) {}
  if (!body.endpoint) return new Response('missing endpoint', { status: 400 });
  await env.SUBS.delete(await sha(body.endpoint));
  return Response.json({ ok: true });
}

function prayerTimes(y, m, d) {
  const rad = Math.PI / 180;
  const lat = AUSTIN.lat * rad;
  const doy = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 864e5);
  const g = 2 * Math.PI / 365 * (doy - 1 + 0.25);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const noon = 720 - 4 * AUSTIN.lon - eq;
  const H = (alt) => {
    const c = (Math.sin(alt * rad) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec));
    return Math.acos(Math.max(-1, Math.min(1, c))) / rad * 4;
  };
  const asrAlt = Math.atan(1 / (ANGLES.asrFactor + Math.tan(Math.abs(lat - dec)))) / rad;
  const base = Date.UTC(y, m - 1, d);
  const at = (min) => base + Math.round(min) * 60000;
  return {
    fajr: at(noon - H(-ANGLES.fajr)),
    dhuhr: at(noon),
    asr: at(noon + H(asrAlt)),
    maghrib: at(noon + H(-0.833)),
    isha: at(noon + H(-ANGLES.isha))
  };
}

function austinParts(ms) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric', hourCycle: 'h23' });
  const o = {};
  f.formatToParts(new Date(ms)).forEach((p) => { o[p.type] = p.value; });
  return { y: +o.year, m: +o.month, d: +o.day };
}

function duePings(now) {
  const p = austinParts(now);
  const days = [-1, 0, 1].map((k) => {
    const dt = new Date(Date.UTC(p.y, p.m - 1, p.d + k));
    return prayerTimes(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
  });
  const out = [];
  days.forEach((times, i) => {
    const next = days[i + 1];
    PRAYERS.forEach((pr, n) => {
      const start = times[pr.key];
      const end = n < PRAYERS.length - 1 ? times[PRAYERS[n + 1].key] : (next ? next.fajr : start);
      const slots = [
        { kind: 'wudu', at: start - WUDU_MIN * 60000, title: pr.name, body: pr.name + ' is in 15 minutes.' },
        { kind: 'start', at: start, title: pr.name, body: pr.name + ' is in.' },
        { kind: 'close', at: end - CLOSE_MIN * 60000, title: pr.name, body: 'The ' + pr.name + ' window is nearly over.' }
      ];
      slots.forEach((slot) => {
        if (now >= slot.at && now < slot.at + WINDOW_MS) out.push(slot);
      });
    });
  });
  return out;
}

async function sendDue(env, now) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return;
  const pings = duePings(now);
  if (!pings.length || !env.SUBS) return;
  const list = await env.SUBS.list();
  for (const key of list.keys) {
    const raw = await env.SUBS.get(key.name);
    if (!raw) continue;
    const row = JSON.parse(raw);
    for (const ping of pings) {
      if (row.prefs && row.prefs[ping.kind] === false) continue;
      const sent = await pushOne(env, row.sub, ping).catch((err) => err);
      if (sent && (sent.statusCode === 404 || sent.statusCode === 410)) await env.SUBS.delete(key.name);
    }
  }
}

async function pushOne(env, sub, ping) {
  const webpush = await import('web-push');
  webpush.setVapidDetails(env.VAPID_SUBJECT || 'mailto:notifications@example.com', env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  return webpush.sendNotification(sub, JSON.stringify({
    title: ping.title,
    body: ping.body,
    tag: ping.kind + '-' + ping.title,
    url: './#pray'
  }));
}

async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
