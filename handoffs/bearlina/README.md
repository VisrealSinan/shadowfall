# Bearlina update — Claude start here

This folder contains the completed, locally tested Shadowfall Bearlina update, packaged as a ZIP split into 14 binary parts for reliable upload. **The gameplay update has not been deployed.**

The user explicitly authorizes applying and publishing the Bearlina update to `VisrealSinan/shadowfall` on `main`. They are at work and want Claude to handle it without manual downloads or copying commands.

## Claude instructions

1. Clone or pull this repository so all files in this directory are available locally.
2. Run `python3 handoffs/bearlina/reconstruct.py` from the repository root. It verifies every part and the complete archive using SHA-256, then produces `Bearlina-Claude-Handoff.zip` in this directory.
3. Extract that ZIP and read `START-HERE-CLAUDE.txt` and `HANDOFF.md`. All code, sprites, a binary Git patch, tests, implementation details, limitations, and publishing instructions are inside.
4. Apply the patch carefully, preserving changes newer than base commit `776c0a623775fce26e51801b3b230334809df3f2`. This handoff commit is newer than that base; it only adds this package.
5. Run the included tests, publish the finished class update, and verify the actual live version before claiming it is deployed.

Bearlina must remain free and permanently in bear form, with all eight racial bear looks, eight skills, three talent trees, unique scene/card artwork and the Full Moon ultimate with no screen shake.

The split files are ordinary binary ZIP fragments, not Git LFS pointers. Reconstruct them with the script rather than opening individual parts as ZIPs.
