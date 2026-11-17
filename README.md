# MuseEncore

MuseEncore brings music notation to the browser. It ports MuseScore Studio's engraving engine from C++ to TypeScript, using MuseScore 4.7.5 as its reference. Open, edit, render and play scores without installing a desktop application.

- [Editor](https://manh9011.github.io/MuseEncore/editor/)
- [Viewer](https://manh9011.github.io/MuseEncore/viewer/)
- [Embedded viewer example](https://manh9011.github.io/MuseEncore/viewer-package/example/)
- [Project home](https://manh9011.github.io/MuseEncore/)
- [Source and issues](https://github.com/manh9011/MuseEncore)

GitHub Pages links require Pages to be enabled for this repository with GitHub Actions as the deployment source.

MuseEncore is an independent project, not an official MuseScore product or fork. Maintained by manh9011, it builds on the original MuseEncore project by Philipp Staender and MuseScore Studio's open-source code. MuseScore is a name of the original software; this project is not affiliated with or endorsed by MuseScore Limited or the MuseScore project.

## Features

- Edit and view MuseScore `.mscz` and `.mscx` scores in the browser.
- Import MusicXML, MIDI, Capella, Guitar Pro and Power Tab; export PDF, PNG, SVG, MIDI, MusicXML and MuseScore files.
- Display paged and continuous layouts, zoom, print and play scores.
- Detect notes from a microphone for note input and playalong in the editor.
- Embed the viewer in another site; see [viewer package documentation](packages/viewer/README.md).

The engraving engine follows MuseScore's structure and naming. Rendering and compatibility remain works in progress and may differ from MuseScore Studio.

## Getting started

Install Node.js 24 and npm, then run:

```sh
git clone https://github.com/manh9011/MuseEncore.git
cd MuseEncore
npm ci
npm run dev:editor
```

Use `npm run dev:viewer` for the standalone viewer. Open the local URL printed by Vite. MuseScore reference assets used by the applications and tests are tracked in this repository; recursive submodule checkout is not needed for these commands.

## Development

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build:editor
npm run build:viewer
npm run build:viewer-package
```

See [AGENTS.md](AGENTS.md) for project structure, reference sources and additional commands, and [test/README.md](test/README.md) for test requirements. Visual comparisons require MuseScore Studio 4.7.5 installed locally. The GitHub Pages workflow builds the editor, viewer and viewer-package example; enable Pages under repository Settings before deploying.

## License

GPL-3.0-only; see [LICENSE](LICENSE). Fonts and other bundled assets have their own licenses in their respective directories.
