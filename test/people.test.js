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

const want = w.composeFree('I want a righteous husband', 0).text;
check('asking for a husband does not say my husband\'s marriage', !/my husband's marriage/.test(want));

const mom = w.composeFree('my mom is sick', 0).text;
check('mom stays a healing dua', /mother|mom|heal|cure|health|pain/i.test(mom) && !/grant me has/.test(mom));

const abu = "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik\nO Allah, help me to remember You, to thank You, and to worship You in the best manner.\n— Abu Dawud 1522";
const fajr = "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan\nO Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.\n— Ibn Majah 925";
check('Abu Dawud is not your father', !w.peopleIn(abu).some(p => /father/.test(p.label)));
check('Fajr sunnah is not your father', !w.peopleIn(fajr).some(p => /father/.test(p.label)));
check('abu is sick is still your father', w.peopleIn('abu is sick').some(p => /father/.test(p.label)));
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
  console.log('\n' + two + '\n' + hers + '\n' + sarahH + '\n' + want + '\n' + mom);
  console.error(fails.length + ' failed');
  process.exit(1);
}
console.log('all passed');
