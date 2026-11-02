# Missing character actions

Added 328 supplemental transparent PNG sprite sheets, containing 7,808 rig-generated frames from the existing character artwork:

- Hurt and death for 328 character variants.
- Ultimate for 320 variants; Bearlina retains her existing painted ultimate.
- Existing idle, run, attack, casting and dodge frames retain their original sources.

`assets/motion88-manifest.js` describes each supplement's dimensions, anchor, scale, action rows, timing and frame count. Each action has eight frames. The runtime chooses the supplemental source only for its missing action, including outfit recoloring. Ultimate casts now request the ultimate action, and the death renderer accepts the original characters as well as the previously compiled characters.

The audited baseline includes 360 character variants, 32 Druid forms, 214 enemy types, six summons and five vendors. Existing enemy, summon, vendor and Druid-form action sheets were already present. Inert scenery and interface icons do not require character action sets.

Rebuild from the source directory with `node --expose-gc tools/build-missing-actions.cjs`. Validate actual pixels with `node --expose-gc tools/check-missing-actions.cjs`; the report is saved to `artifacts/motion88-pixel-qa.json`. Runtime regression checks are in `tests/missing-actions.test.cjs`.

These are articulated poses derived from existing artwork, rather than newly painted frames. A sampled contact sheet is available at `artifacts/missing-actions-preview.png`.

Validation: all 328 sheets and 7,808 frames passed decoding, dimension, distinct-pose, empty-frame and edge-clipping checks. Three targeted runtime tests passed. The asset-reference audit found 938 unique sprite sources and zero missing files. Full-suite validation encountered failures in concurrently changing secret-origin content and the unreleased content manifest; this update has not independently installed or published that combined build.
