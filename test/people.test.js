const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'http://127.0.0.1:4177/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    window.requestAnimationFrame = (fn) => setTimeout(fn, 16);
    window.cancelAnimationFrame = clearTimeout;
    window.scrollTo = () => {};
  }
});

const w = dom.window;
const fails = [];
function check(name, ok) {
  if (!ok) fails.push(name);
  console.log(ok ? 'ok  ' : 'FAIL', name);
}

const two = w.composeFree("my friend Sarah is getting married, bless me with leads, and my friend Hana has a big heart and I want patience with her", 0).text;
check('two friends stay Sarah and Hana', /Sarah/.test(two) && /Hana/.test(two));
check('two friends do not become my husband', !/\bmy husband\b/i.test(two));
check('two friends do not say my her', !/my her/.test(two));
check('two friends do not say grant me has', !/grant me has\b/.test(two));
check('two friends do not say bless me with and', !/bless me with and\b/.test(two));

const hers = w.composeFree("her husband is getting married", 0).text;
check('her husband stays hers', /her husband/.test(hers));
check('her husband is not rewritten as my husband', !/\bmy husband\b/i.test(hers));

const sarahH = w.composeFree("Sarah's husband is getting married, and Hana has a big heart and patience with her", 0).text;
check("Sarah's husband is not my husband", !/\bmy husband\b/i.test(sarahH) && /Sarah/.test(sarahH));
check("Hana stays in the dua", /Hana/.test(sarahH));
check('patience with her is not my her', !/my her/.test(sarahH));

const friendsHusband = w.composeDua(w.nameNum('Al-Wadud'), "my friends' husband is getting married, leads, has a big heart and patience with her").text;
check("friends' husband is not rewritten as my husband", !/\bmy husband\b/i.test(friendsHusband));
check("friends' husband memo does not say grant me has", !/grant me has\b/.test(friendsHusband) && !/bless me with has\b/.test(friendsHusband));
check("friends' husband memo does not say my her", !/my her/.test(friendsHusband));

const herList = w.composeDua(w.nameNum('As-Sabur'), 'her husband getting married, leads, has a big heart and patience with her').text;
check('her husband list stays her husband', /her husband/.test(herList) && !/\bmy husband\b/i.test(herList));
check('her husband list does not say grant me has', !/grant me has\b/.test(herList) && !/bless me with has\b/.test(herList));
check('her husband list does not say my her', !/my her/.test(herList));

const couple = w.composeDua(w.nameNum('As-Sabur'), 'Sarah and Aisha are getting married, leads, has a big heart and patience with her').text;
check('both friends stay in a shared marriage', /Sarah/.test(couple) && /Aisha/.test(couple) && !/grant me Sarah/.test(couple));

const want = w.composeFree('I want a righteous husband', 0).text;
check('asking for a husband does not say my husband\'s marriage', !/my husband's marriage/.test(want));

const mom = w.composeFree('my mom is sick', 0).text;
check('mom stays a healing dua', /mother|mom|heal|cure|health|pain/i.test(mom) && !/grant me has/.test(mom));

const abu = "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik\nO Allah, help me to remember You, to thank You, and to worship You in the best manner.\n— Abu Dawud 1522";
const fajr = "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan\nO Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.\n— Ibn Majah 925";
check('Abu Dawud is not your father', !w.peopleIn(abu).some(p => /father/.test(p.label)));
check('Fajr sunnah is not your father', !w.peopleIn(fajr).some(p => /father/.test(p.label)));
check('abu is sick is still your father', w.peopleIn('abu is sick').some(p => /father/.test(p.label)));
const abuSick = w.composeFree('abu is sick', 0).text;
check('abu is sick prays for father', /father/.test(abuSick) && !/\bheal me\b|\bcure me\b|\bgrant me complete healing\b/.test(abuSick));
check('lowercase abu dawud is not your father', !w.peopleIn('hadith of abu dawud about dhikr').some(p => /father/.test(p.label)));
const friendsH = w.composeFree("my friends' husband getting married, leads, has a big heart and patience with her", 0).text;
check("friends' husband without is stays in the dua", /friend/.test(friendsH) && /husband/.test(friendsH) && !/\bmy husband\b/.test(friendsH) && !/righteous spouse/.test(friendsH));
const sisterH = w.composeFree("my sister's husband is sick", 0).text;
check("sister's husband is not replaced by the sister", /husband/.test(sisterH) && !/grant my sister complete healing/.test(sisterH));
const forSarah = w.composeFree('pray for Sarah', 0).text;
check('pray for Sarah does not say bless me with Sarah', !/bless me with Sarah/i.test(forSarah) && /Sarah/.test(forSarah));
const xavi = w.composeFree('I want patience with Xavi', 0).text;
check('patience with a name does not say my xavi', !/my xavi/i.test(xavi));
const leadsHas = w.composeFree('leads, has a big heart', 0).text;
check('a has-fragment is not glued onto leads', !/,\s*has a big heart/.test(leadsHas));
check('friends husband is not indexed as your husband', !w.peopleIn('my friends husband is sick').some(p => p.label === 'your husband'));
const oldSunnah = w.createDua({ n: null, memo: '', text: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik\nO Allah, help me to remember You, to thank You, and to worship You in the best manner.\n— Abu Dawud 1522", status: 'oneoff', how: 'suggested' });
w.sugAddDua({ tr: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik", en: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.', src: 'Abu Dawud 1522' });
check('an older sunnah wording is reused instead of copied', w.prayAdd(oldSunnah.id) === false);
const bothSick = w.composeFree('my friend Sarah and my friend Hana are both sick', 0).text;
check('two sick friends are both named', /Sarah/.test(bothSick) && /Hana/.test(bothSick));
const subjDua = w.createDua({ n: 1, memo: 'exam on friday', text: 'ease my exam', status: 'oneoff', how: 'typed' });
subjDua.subject = 'Finals';
w.saveData();
const stored = w.localStorage.getItem('asmaDuaLog.v1');
check('a typed subject is written to storage', !!(stored && stored.includes('"subject":"Finals"')));
const parsed = JSON.parse(stored);
const cleaned = w.cleanDua(parsed.duas.find(x => x.memo === 'exam on friday'));
check('a backup keeps the subject', cleaned && cleaned.subject === 'Finals');
check('my father stays your father', w.peopleIn('my father is sick').some(p => /father/.test(p.label)));

check('fajr reads this morning', w.dayPart('fajr') === 'this morning');
check('dhuhr reads today', w.dayPart('dhuhr') === 'today');
check('asr reads this afternoon', w.dayPart('asr') === 'this afternoon');
check('maghrib reads this evening', w.dayPart('maghrib') === 'this evening');
check('isha reads tonight', w.dayPart('isha') === 'tonight');

const blank = { memo: 'bless me with leads and patience with my friend Hana', subject: '', versions: [{ text: 'bless me with leads and patience with my friend Hana' }] };
check('blank subject uses the first words', w.subjectOf(blank).toLowerCase().startsWith('bless me with leads'));
const named = { memo: 'a very long memo that should not be the card title', subject: 'Hana’s heart', versions: [{ text: 'x' }] };
check('a typed subject is kept', w.subjectOf(named) === 'Hana’s heart');

const made = w.createDua({ n: 1, memo: 'leads for the week', text: 'grant me leads', status: 'keeper', how: 'typed' });
w.prayAdd(made.id);
const again = w.prayAdd(made.id);
const second = w.createDua({ n: 1, memo: 'leads for the week', text: 'grant me leads', status: 'keeper', how: 'typed' });
check('the same dua is not added twice', again === false && second.id === made.id);

if (fails.length) {
  console.log('\n' + two + '\n' + hers + '\n' + sarahH + '\n' + friendsHusband + '\n' + herList + '\n' + couple + '\n' + want + '\n' + mom);
  console.error(fails.length + ' failed');
  process.exit(1);
}
console.log('all passed');
