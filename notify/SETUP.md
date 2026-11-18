# Prayer reminders

The app stores the three choices on the device and asks for notification permission only after a tap in Settings. It does not send anything until a sender exists. Leave the public key blank and the app still opens, prays, and saves duas.

## Recommendation

Use a Cloudflare Worker with a cron trigger and a KV namespace. GitHub Pages cannot wake an iPhone at Fajr. A Worker cron can. GitHub Actions can also run on a schedule, but the clock is coarse, the job is easy to miss, and a private key in a workflow log is a worse place for VAPID.

The worker in this folder is the sender. It is not deployed.

## What Shamilah sets up

1. Create a Cloudflare account and a Worker. Do not reuse a personal API token inside the app.
2. Add a KV namespace and bind it as `SUBS`.
3. Generate a VAPID key pair on your own machine (`npx web-push generate-vapid-keys`). Store the private key as the Worker secret `VAPID_PRIVATE_KEY`. Store the public key as `VAPID_PUBLIC_KEY`. Set `VAPID_SUBJECT` to a mailto you actually read.
4. Add a cron trigger every 15 minutes. The worker looks for a reminder whose time has arrived in the last 8 minutes, so a 15-minute cron can miss a narrow window. A 5-minute cron is the better match. Cloudflare's free cron is often limited to longer intervals. If the shortest trigger you can set is 15 minutes, widen `WINDOW_MS` in `worker.js` to match it before you deploy.
5. `npm install web-push` in this folder, and ship `worker.js` with that dependency. The file imports `web-push` only when a cron fires.
6. Copy the public key into the app. In `index.html`, set `PUSH_CONFIG.vapidPublicKey` to that public key and `PUSH_CONFIG.subscribeUrl` to the Worker URL plus `/subscribe`.
7. Install Dua Book to the Home Screen on iOS 16.4 or later. Open Settings, choose the pings, and tap Turn on reminders. That tap is the only permission ask.

## Copy

Wudu, 15 minutes before. "Fajr is in 15 minutes."

Start, at the prayer. "Fajr is in."

Close, 15 minutes before the next prayer. "The Fajr window is nearly over."

No missed-prayer language.

## Clock

Times are the same Austin estimate the app already shows. Latitude 30.2672, longitude -97.7431, America/Chicago, fajr and isha at 15 degrees, Asr at the later shadow. It is not the Islamic Center of Greater Austin's printed timetable. If those two diverge, the in-app prayer and the notification still agree with each other.
