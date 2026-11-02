# Shadowfall v86 animation completion

Both animation paths are included: dedicated sprite sheets for the remaining actors and creatures, plus improved live rigs and continuous secondary motion. The existing character designs, race variants, outfits and gameplay rules are preserved.

| Coverage added | Dedicated sheets | Actions |
| --- | ---: | --- |
| Graveshade and Tibo & Poteto, across eight races and two bodies | 32 | Idle, run, attack, cast, dodge, hurt, death, ultimate |
| Druid Cat and Tree, across eight races and two bodies | 32 | Idle, run, attack, cast, dodge, hurt, death, ultimate |
| Previously static enemies | 75 | Idle, walk, windup, attack, hurt, death |
| Summoner companions | 6 | Idle, walk, attack, cast, hurt, death, arrival |
| Vendors and shrine | 5 | Idle, walk, greeting, trade, work |
| **Total** | **150** | **8,232 frames** |

The original 328 character sheets and 132 enemy sheets retain priority. The 207 enemy designs plus seven encounter variants give all 214 enemy types animated action coverage. Lost Shadows use their animated base creature with their encounter palette. The Lanternless Pursuer uses the Graveshade action set.

The new sheets are compiled from the existing painted artwork using weighted articulated rigs. They are rig-generated poses, not newly hand-painted artwork for each frame. Arms, legs, knees, heads, cloth, wings and tails follow separate pose tracks. Quadrupeds, flyers, crawling creatures, spirits, heavy creatures, rooted forms and the paired survivor use different movement profiles. Compilation includes overscan and floor alignment to keep weapons and collapsing bodies within their cells.

Live motion adds continuous sway and hover between the sheet frames. Vendors walk when travelling, greet nearby players, gesture while trading and work while idle. Summons react to hits and play death/arrival animations while retaining their existing reserved respawn slots. Foliage and cloth move in the wind; lights flicker and machinery pulses. Inert stone remains still. Ambient and thumbnail motion respect the operating system's reduced-motion preference.

Class/race thumbnails now advance their idle animation while visible. Visual event state lives in weak maps and is excluded from saved runs. Collision bodies, damage, cooldowns, talent allocations and rewards are unchanged.

## Files and reproduction

- `assets/motion86-manifest.js` maps every new action and source sheet.
- `assets/motion86-*.png` contains the 150 compiled sheets.
- `assets/motion-rig.js` contains the shared pose, skeleton deformation and secondary-motion logic.
- `assets/motion-completion.js` connects the sheets to gameplay events and vendor/scenery motion.
- Run `node --expose-gc tools/build-animation-sheets.cjs` to compile the sheets. A source-hash cache makes unchanged rebuilds inexpensive.
- Run `node --expose-gc tools/check-motion-sheets.cjs` to decode every sheet and check dimensions, distinct poses, transparency, empty frames and clipped edges.
- Run `node --test tests/*.test.cjs` and `node tools/check-syntax.cjs` for integration and syntax validation.

Validation: 60 automated checks passed; all 150 sheets and 8,232 frames passed pixel checks with zero clipped frames and zero unintended empty frames. Isolated native-game visual review covers the new actors, Druid forms, enemy actions and summon lifecycle.
