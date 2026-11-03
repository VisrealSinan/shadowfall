# Shadowfall v101 - Painted prompts and popups

The artwork audit now covers short-lived UI as well as permanent menus. All 18 quest identities, six random events, seven landmarks and 36 trader offers (including shrine blessings and themed town goods) use the existing painted collection. Quest failures, event results, achievement banners and archive emblems, evolution recipes, loadout details, Armory detail emblems and empty equipment slots follow the same artwork as their related menus.

Random event announcements and timers show contained painted illustrations beside their text. Evolution recipes and loadout details reuse the skill illustration. The card-pick animation keeps the painted card presentation when its clone leaves the level-up screen. Spirit shrines have their own sanctuary heading instead of inheriting the travelling merchant's name. Treasure, Codex, achievement, quest and confirmation surfaces use the current menu palette. Routine messages retain their existing hunt-log routing.

Artwork comes from already shipped assets; no new image downloads are required. Gameplay, prices, rewards and save rules retain their existing behavior. Direction arrows, controller hints and status symbols remain navigation and text controls.

Verification: tools/browser-popups101.cjs checks every artwork route and exercises all quest-start, event-result and landmark-result handlers. It captures 36 desktop/mobile views, decodes each referenced image, verifies card transition styling and checks for page errors, missing requests and horizontal overflow. Regression checks cover complete route coverage, ability identity, quest/event reward behavior and serializable visual-only message data. Reports and screenshots are written to artifacts/.

Final validation: all 177 regression tests and syntax checks pass. The existing art browser audit passes with 62 decoded assets and no missing obstacle routes. All 180 map/quest combinations render without page errors, missing requests or mobile overflow; banners remain noninteractive.
