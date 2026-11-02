# Shadowfall v90 — additional secret unlock paths

Both original keyboard-code unlocks remain available. Existing unlocks and saves are preserved.

The new achievement routes are hidden from the achievement list, filters and next-achievement suggestions until earned. They require a normal hunt started after this update. Old profile totals, old continued hunts and Daily Challenges cannot satisfy them. Fresh hunts retain eligibility through Save / Continue.

## Secret requirements (developer reference / spoilers)

- **Untamed Migration → Goose:** reach at least 10 minutes and 1,000 kills in one eligible hunt before using any revival (standard, ancestral, or Undying). The achievement is earned as soon as all conditions are met; a later revival cannot take away an earned unlock.
- **A Perfect Conspiracy → Tibo & Poteto:** reach at least 15 minutes, defeat at least 5 bosses and carry 6 distinct learned skills belonging to the current class, all in one eligible hunt. Druid form skills count toward the six slots.

Normal achievement checks award these during play. End-of-hunt settlement also checks the last milestone before merging progress, so a final boss kill or immediate exit does not lose the unlock. Tibo & Poteto ownership and the achievement are saved together; Goose availability accepts either of its two secret achievements. No public menu reveals the unearned names or requirements.

Validation: six targeted tests cover hidden achievement presentation, old-save exclusion, exact thresholds, all revival flags, duplicate skills, off-class skills, Daily Challenges, continuing an eligible hunt, end settlement, persistent ownership, repeat settlement, and prevention of cross-run accumulation. The complete suite is run before installation.
