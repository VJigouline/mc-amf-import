# Getting started

## Install

```sh
npm install three github:VJigouline/mc-amf-import
```

## Open a file

`loadAmf` takes the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files. Zip archives among them are opened. It returns a promise of the model.

```ts
import * as THREE from 'three';
import { loadAmf } from 'mc-amf-import';

const input = document.querySelector<HTMLInputElement>('input[type=file]')!;
input.addEventListener('change', async () => {
  const result = await loadAmf(input.files![0]!);
  scene.add(result.group);
  for (const warning of result.warnings) console.warn(warning);
});
```

## What you get

- **`group`:** a `THREE.Group` holding the model, named after the file.
- **`stats`:** counts of what was read.
- **`warnings`:** anything that couldn't be read or was left out.

AMF is Z up, in its unit (millimetres by default); the group turns it Y up and scales it to metres.

## Options

- **`main`** (default the first .amf file): The file to open, if several are given.
- **`unitScale`** (default from the file): Metres per unit.

See the [API](API.md) for every field of the result.
