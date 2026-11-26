# AMF test files

Real AMF files that the tests load. They are unchanged copies, taken at commit `1d3772857e` of three.js.

| Files | What they cover | Source and licence |
| --- | --- | --- |
| `rook.amf` | A zipped chess piece | The [three.js](https://github.com/mrdoob/three.js) repository (`examples/models/amf`), under its [MIT licence](https://github.com/mrdoob/three.js/blob/dev/LICENSE); no other licence is stated for them. |

The tests also write a file with a unit, metadata and a material.

These files keep their own licences. They are test data only, and are not part of the npm package, which includes only `dist`, `Documentation`, `README.md` and `LICENSE`.
