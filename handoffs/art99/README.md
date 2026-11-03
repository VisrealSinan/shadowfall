# v99 painted art sources

Created and repaired with the built-in image_gen tool. Exact prompts are preserved in prompts.json. Runtime files live under assets/ and never reference the external generation directory.

Final source inputs:

- gear.png: 5x6 sheet, thirty equipment appearances in head/shoulders/chest/hands/waist/legs/feet/neck/ring/trinket order, three consecutive appearances per slot.
- legend.png: 4x3 sheet; first eight cells are the eight Combat97 named relics in registry order. Remaining cells are unused resources.
- armory.png: Bloodforge, Aegis and Fortune panels. wayfarer.png supplies the fourth environment.
- encounter-fixed.png: 4x2 sheet; Bellkeeper, Unheard, unlit shrine, lit shrine, crystal, coins, potion, chest.
- propsA-fixed.png and propsB-fixed.png: fifty isolated scenery pieces. The importer uses their actual transparent gutters, since generated row spacing is not uniform. propsB.png supplies the extra throne at bottom right.
- units-fixed.png: sixteen isolated constructs. The final cell is superseded by hammer.png to correct the axe silhouette to a blunt holy war hammer.

encounter.png, propsA.png, propsB.png and units.png are original generation/repair inputs. They are retained for provenance; the runtime does not load those sheets. Repaired source images are also kept as originals without overwriting the generator's outputs.

Rebuild from the repository root with:

    node tools/build-art99.cjs
    node tools/build-world99.cjs
    node tools/build-crops99.cjs

These tools require sharp. Pixel review tools also use @napi-rs/canvas; browser QA uses Playwright and local Chrome. Build tools try the Node runtime's bundled module directory. Reports and contact sheets are written to artifacts/.
