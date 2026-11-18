# Dua Book brand kit

The color and the mat are locked. This kit records that system and the type that sits on it. Type does not introduce a new palette.

## What the app is

Dua Book is a personal dua companion. It is built around the prayer you are in, the 99 Names, and the words you actually want to say to Allah. It stays on this device.

## What it says

Intimate, sincere, calm, unhurried, and private. Warm rather than preachy. Rooted in tradition, and still personal. The voice asks. It does not scold.

## Who it is for

A person who prays and wants a private record of what they ask, timed to the prayer they are in. Inferred from the product. Not a researched audience study.

## Type principles

Type is ink on a soft textile, not a product logo.

The prayer mat is powder blue, indigo, and sea glass. Letters should feel woven into that, quiet enough that the Names and the dua stay first.

Arabic has to carry full harakat. Line height stays open so fatha, kasra, damma, sukun, shadda, and tanween are not clipped.

Latin display and Latin text are a pair. They are not the same face at two weights, and they are not Fraunces, Inter, or Playfair.

One scale per kit. Display size, text size, and Arabic leading change together. Color tokens do not.

## Locked page palette

Sajjada V3 Blend, from `brand/palettes/sajjada8/palettes.js` (`powder_v3`) and `brand/sajjada8-decision.md`. Day and night share every shape. Only the values swap.

The live CSS is in `index.html` on `html[data-mode]`.

### Ground, structure, accent

| Role | Token | Day | Night |
| --- | --- | --- | --- |
| Ground | `--ground` | #E2E8F2 | #171F38 |
| Sheet | `--sheet` | #EDF1F8 | #212B4C |
| Field | `--field` | #D3DBEA | #1D2642 |
| Structure (niche) | `--madder` | #4A5A8C | #3A4A7A |
| On structure | `--on-madder` | #FFFFFF | #F0F3FB |
| Accent, sea glass | `--accent` | #2B7A72 | #8FD3C3 |
| Accent ink | `--accent-ink` | #174A44 | #8FD3C3 |
| Badge | `--badge` | #23685F | #8FD3C3 |
| Badge ink | `--badge-ink` | #FFFFFF | #171F38 |
| Button ink | `--btn-ink` | #2C3763 | #2A3560 |
| Olive | `--olive` | #2D6B57 | #A6D8BD |
| Ink | `--ink` | #1E2540 | #E8EDF8 |
| Muted | `--muted` | #303753 | #CFD6E8 |

Muted in the running app is darker by day and lighter by night than `powder_v3` in the palette file (#4A5170 day, #A9B3CF night). That value was already on `main` before this round. It was not dropped. It was not moved back, because every secondary label uses it.

Arch line `--arch` is #B2BFD7 by day and #4B5677 by night. Mat stitches use `--pat`, `--guard`, `--bandfill`, `--bord`, `--sp`, `--spfill`. Those are the textile, not a second theme.

### Avatar palettes

Style 3 avatars. Six tiles, `--tint-1` through `--tint-6`, plus Me on `--tint-me`.

The six textile sets live in `brand/palettes/sajjada6/palettes.js` and `palette-report.json`. Each has a day row and a deeper night row.

| Id | Name |
| --- | --- |
| a | Iznik tile (cobalt, turquoise, sage, coral-dust) |
| b | Indigo dye (indigo, woad, denim, celadon) |
| c | Mughal miniature (lapis, verdigris, saffron-dust, rose-madder) |
| d | Kashmiri shawl (slate, teal, mustard, plum) |
| e | Sea-glass (aqua, seafoam, blue-glass, sand) |
| f | Dusk sky (periwinkle, violet-dusk, rose, apricot) |

The page does not switch among a to f. The live tiles are the V3 mix already on `main`.

Day: #95A2C7, #9ED0CB, #8DA2C4, #B2D9C4, #97A0B6, #A9C7BC.

Night: #414E6E, #4A646B, #4E5C75, #536868, #4E576B, #55676B.

Me is `--tint-me` #4A5A8C by day and #D6DCF2 by night.

### 99 Names colors

Fifteen category colors, used on chips, card edges, and transliteration. They are not the avatar tiles. On `main` they had collapsed onto `--tint-1`. This round keeps them distinct.

| Token | Day | Night |
| --- | --- | --- |
| `--c-majesty` | #8A6A12 | #E0B84A |
| `--c-mercy` | #8E4A6C | #E3A3C2 |
| `--c-power` | #9A332C | #F0A099 |
| `--c-knowledge` | #2E5E9A | #9EC0F0 |
| `--c-creation` | #1F7A4E | #8ED4AE |
| `--c-forgiveness` | #6A4A9A | #C4B0E8 |
| `--c-provision` | #8A6414 | #E8C56A |
| `--c-justice` | #6E5E30 | #D4C48A |
| `--c-guardianship` | #0E7568 | #7ED4C8 |
| `--c-life` | #3E4288 | #B0B4E4 |
| `--c-oneness` | #6A5E28 | #F0E4B8 |
| `--c-guidance` | #1A7490 | #8ED4E8 |
| `--c-exaltation` | #A85A38 | #F0B89A |
| `--c-response` | #8A3E72 | #E8A8D0 |
| `--c-time` | #3E5E86 | #A8C0DC |

### Mat pattern

Same drawing day and night. The field is `tiles/iznik.svg` (softened Iznik millefleur) masked with `--pat`. Spandrels are sparse dots, `tiles/sp-sdots.svg`, masked with `--sp`. The border is `tiles/bord-rosette.svg` masked with `--bord`. `brand/tiles` on `brand-refs` holds the options that were not chosen.

The arch mark is `assets/mark-soft.png`, used as a mask and filled with `--accent`, so the sage drawing takes the sea-glass token.

Home-screen icons, the apple-touch icon, and the favicon are resized from `assets/icon-final-1024.png` on `brand-refs` at `1a1750f`. The art is borderless and full bleed. The pixels were not redrawn.

## Type kits

All three use the tokens above. Switch with `?type=a`, `?type=b`, or `?type=c`. The default is A.

Faces are OFL and on Google Fonts, so they can be self-hosted. The app loads them from the Google Fonts stylesheet, the same way it already loaded type.

### A. Margin

A margin note on the mat.

Display is EB Garamond. Text is Crimson Pro. Arabic is Amiri.

It fits because the mat is a textile and the Names are a manuscript. An old-style Latin serif and a naskh that holds harakat sit in indigo and sea glass without looking like a new app.

Risk: Crimson Pro on small tab labels can look softer than a grotesque. Amiri at card size needs the open leading this kit sets.

### B. Letter

A note written before you pray.

Display is Kalam. Text is Atkinson Hyperlegible. Arabic is Scheherazade New.

It fits because the duas are your own words, and a pen for titles keeps that feeling. Atkinson stays clear for the long stack. Scheherazade New is there so harakat stay intact. A ruqaa face was rejected for the Arabic, because the marks collide.

Risk: Kalam can look casual if the display size grows. It is kept near the text size on purpose.

### C. Journal

A quiet column of type.

Display is Newsreader. Text is Schibsted Grotesk. Arabic is Noto Naskh Arabic.

It fits because a journal can be calm on a powder ground. Newsreader is a text serif with optical sizes, not a fashion display. Noto Naskh is a book naskh with full marks.

Risk: Schibsted Grotesk is closer to a news site than the other two. It is the one that can feel least like a prayer mat if the display is small.

## Recommendation

A, Margin. The locked object is a prayer mat. A book serif and Amiri read as writing on that cloth. B is warmer and easier to mistake for a greeting card. C is calmer and easier to mistake for a magazine. Colors stay V3 Blend in all three.
