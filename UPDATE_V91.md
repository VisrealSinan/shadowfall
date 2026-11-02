# Shadowfall v91 — Tibo & Poteto reunion encounter

Replaces the second Tibo & Poteto unlock's boss/skill checklist with an escort encounter. The original code remains available, the achievement remains secret until earned, and existing ownership is preserved. Goose unlocks are unchanged.

## Encounter

- In a normal hunt, at 10:00, either Tibo or Poteto appears near the player. It waits until approached. No encounter appears in town, in Daily Challenges, or when the duo is already unlocked.
- The companion follows automatically once the player approaches within 54 world units. The companion is a friendly visual actor, has no enemy targeting or damage, and does not occupy a skill or summon slot.
- Walk for a cumulative 60 seconds in any direction. Only actual player movement with the companion nearby counts. Stops, blocked movement, pauses, towns, death, teleports and long background frame gaps cannot farm the timer. Stopping pauses progress rather than resetting it.
- At 60 seconds, the other partner appears just ahead. Approach them to reunite the pair and earn the secret achievement, unlocking Tibo & Poteto.
- World labels, a walking-progress message and offscreen direction markers explain the encounter after it appears. Nothing reveals the achievement's requirements in advance.
- Actor positions, phase, movement sampling and walking progress are serialized with the hunt. Save/Continue preserves the encounter; a new hunt starts fresh. Existing normal v90 hunts can encounter the travelers without automatic reward grants.

## Implementation and verification

Uses the existing painted duo artwork as separate runtime sprite regions. Friendly actors share the world's depth-sort pass. Movement checks run after actual player movement and obstacle resolution, and the escort uses obstacle resolution as well.

Six new tests exercise spawn timing, proximity recruitment, stopping, 59.9/60-second thresholds, travel in opposite directions, reunion, repeat rewards, blocked movement, pause, town, teleports, frame-gap limits, Save/Continue, fresh hunts, Daily Challenges, existing ownership, either partner leading, and the real gameplay update integration. Updated earlier tests prove the former boss/skill checklist no longer awards the duo and retain Goose regressions.

Headless Chrome preview completed the real encounter, rendered both standalone painted companions, and verified permanent ownership with zero page errors. Screenshots are in `artifacts/escort-*-91.png` (filenames use `escort-waiting91.png`, `escort-following91.png`, `escort-reunion91.png`, `escort-complete91.png`).
