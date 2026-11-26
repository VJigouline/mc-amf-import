# mc-amf-import

An AMF importer for [three.js](https://threejs.org/), written in TypeScript. It reads Additive Manufacturing Format files (ISO/ASTM 52915), plain or zipped, with their objects, volumes, materials, colours and constellations, in metres and Y up. It was made for [SceneEditor](https://github.com/VJigouline/SceneEditor), and works in any three.js application.

```ts
import { loadAmf } from 'mc-amf-import';

const result = await loadAmf(await file.arrayBuffer());
scene.add(result.group);
console.log(result.warnings);       // anything that couldn't be read
```

## What it reads

- Objects and their meshes, with a mesh for each volume.
- Materials and colours of objects, volumes and vertices.
- Constellations, placing objects.
- The file's unit and metadata.

Textures are not read, and curved triangles (edges) are drawn flat; the warnings say so. three.js reads the XML with DOMParser, so in Node a DOM implementation must be provided; the tests use jsdom. See [Formats and support](Documentation/Support.md) for the details.

## Install

The package is not on the npm registry. Install it from GitHub:

```sh
npm install github:VJigouline/mc-amf-import
```

`three` (r160 or later) is a peer dependency. The package builds itself on install.

## Documentation

- [Getting started](Documentation/GettingStarted.md)
- [API](Documentation/API.md)
- [Formats and support](Documentation/Support.md)
- [Using it in SceneEditor](Documentation/SceneEditor.md)

## Development

```sh
npm install
npm test           # unit tests, with Vitest
npm run typecheck
npm run build      # dist/
```

The tests load real AMF files, kept in [`tests/samples`](tests/samples/README.md) with their licences. It needs Node.js 22 or later.

## Licence

[MIT](LICENSE)
