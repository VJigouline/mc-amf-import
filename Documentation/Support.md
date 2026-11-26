# Formats and support

mc-amf-import reads AMF with three.js's AMFLoader.

## What is read

- Objects and their meshes, with a mesh for each volume.
- Materials and colours of objects, volumes and vertices.
- Constellations, placing objects.
- The file's unit and metadata.

## Orientation and units

AMF is Z up, in its unit (millimetres by default); the group turns it Y up and scales it to metres.

## Limits

Textures are not read, and curved triangles (edges) are drawn flat; the warnings say so. three.js reads the XML with DOMParser, so in Node a DOM implementation must be provided; the tests use jsdom.
