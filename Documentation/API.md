# API

## `loadAmf(input, options?)`

Reads `.amf`, plain XML or zipped and returns a promise of a `AmfLoadResult`.

`input` is the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files. Zip archives among them are opened.

It throws a `AmfImportError` for input that isn't AMF.

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `main` | the first .amf file | The file to open, if several are given. |
| `unitScale` | from the file | Metres per unit. |

### `AmfLoadResult`

| Field | Type | Meaning |
| --- | --- | --- |
| `group` | `THREE.Group` | The model. |
| `unit` | `string` | The file's unit. |
| `unitScale` | `number` | Metres per unit. |
| `metadata` | `Record<string, string>` | The file's metadata. |
| `zipped` | `boolean` | Whether the file was zipped. |
| `warnings` | `string[]` | Problems that didn't stop the import. |
| `stats` | object | Counts of meshes, triangles, lines and points. |

See the package's `index.d.ts` for every exported type and helper.
