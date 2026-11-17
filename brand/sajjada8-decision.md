# sajjada8 decision

## Goal

Settle one calm sajjada with the avatars at home on the page. Two calls were open. The palette is V2 Indigo or V3 Blend. The field inside the arch is the powder florals or a softened Iznik field. Everything else stays as chosen earlier: border A, sparse-dot spandrels C, arch below the avatar row, style 3 avatars, English left with the Arabic Name right and transliteration beneath. The mat is the same in day and night, and only the palette swaps.

## Picks

**Palette: V3 Blend** (indigo structure with sea-glass accents).
**Field: softened Iznik**, from the traced tile `tiles/iznik.svg`, at the same pattern strength as the powder field (about .20 day and .11 night).
Winner: C4. Runner-up: C3 (V3 Blend with the powder florals). For the palette alone, the runner-up is V2 Indigo.

## Why V3 Blend

Shamilah's finding was that the avatars feel out of place because they are the only other colors on the page. V3 fixes that and V2 does not. Outside the avatar tiles, 4.76% of the page by day and 3.08% by night reads as sea-glass green or teal under V3. Under V2 it is 0.29% and 0.02%. The mean hue gap from each avatar tile to the nearest non-avatar element drops from 5.8 to 3.5 degrees. V3 is not louder: mean page chroma is 8.73 under V3 and 9.05 under V2 by day, and 20.53 against 20.34 by night.

Principle: experience-first. I chose the palette on how the page feels, with avatars belonging to it. I did not choose it on contrast, where V2 led by 0.72 on one element.

## Why the softened Iznik field

At the same line color and opacity, the Iznik field has fewer marks behind the content. Edge density of the bare field is 22% lower by day (0.258 against 0.331) and 17% lower by night (0.321 against 0.388). Edge density behind text boxes is 11% lower (0.218 against 0.246), and there are 198 stroke components against 277. Its repeat is also less visible (autocorrelation 0.44 against 0.51). The large leaves, carnations, hyacinths and tulips read as a prayer-mat panel, where the small scattered florals read as a print. "Natural, not stiff" has no number, and the two fields tie on it by eye.

Principle: exhaust-the-design-space. I built all four cells and did not stop at the two obvious ones. A sibling option, a darker badge for V3 only, came out of reading the losing cell's numbers.

## Graft

V3 lost 0.72 of contrast on the day count badge (5.09, white on #2B7A72) against V2. I darkened the badge fill only, to #23685F, and left the accent as it was. Badge ink contrast is now 6.53. The day minimum across all screens rose from 5.09 to 5.81.

## Measurements

| Candidate | Min contrast day / night | Field edge density day / night | Edge density behind text | Off-avatar teal share day / night | Impeccable |
|---|---|---|---|---|---|
| C1 V2 + florals | 5.81 / 5.61 | 0.333 / 0.385 | 0.246 | 0.29% / 0.02% | 1 flag, 1 advisory |
| C2 V2 + Iznik | 5.81 / 5.61 | 0.260 / 0.319 | 0.218 | 0.29% / 0.02% | 1 flag, 1 advisory |
| C3 V3 + florals | 5.81 / 5.62 | 0.331 / 0.388 | 0.246 | 4.76% / 3.08% | 1 flag, 1 advisory |
| C4 V3 + Iznik | 5.81 / 5.62 | 0.258 / 0.321 | 0.218 | 4.76% / 3.08% | 1 flag, 1 advisory |

Contrast is the worst-case pixel under every text box on all six screens, measured at 412 wide. The winner measures 5.81 day and 5.62 night at 360 wide too. Nothing is below 4.5. The Impeccable detector flags the arch clip-path (intentional) and gives an advisory on the weave texture (intentional) on Pray and Reflect, day and night, for every candidate. Nothing else.

Reviewer passes and their dropped claims are in `reviews.md`. The environment had no subagent tool, so I ran them myself, and no outside judge was used.

## Verification

After the graft I re-rendered the 2x2 and the winner's six screens in day and night at 412 and 360 wide, and re-ran the contrast probe on C3 and C4 at 412 and on C4 at 360. Principle: prove-it-works.

## Files

- `compare-2x2-pray-reflect.png`, all four candidates on Pray and Reflect, day and night.
- `compare-winner.png`, the six screens of C4, day and night.
- `measure-*.json`, `contrast4-*.json`, `impeccable.txt`, the raw measurements.
- Viewer, served on port 8938: `index.html?d=A&b=powder_v3&fld=iznik&mode=day&s=pray`
