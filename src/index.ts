// Reads Additive Manufacturing Format files (ISO/ASTM 52915), plain XML or zipped, with
// three.js's AMFLoader: objects, volumes, materials, colours and constellations, in metres and Y up.

import * as THREE from 'three';
import { unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { AMFLoader } from 'three/examples/jsm/loaders/AMFLoader.js';
import { countModel, ImportFiles, orient, toStandardMaterials, type ImportInput, type ImportStats } from './common.js';

export { ImportFiles, countModel } from './common.js';
export type { ImportInput, ImportFile, ImportData, ImportStats } from './common.js';

export interface AmfOptions {
  /** The .amf file to open, if several are given. By default, the first. */
  main?: string;
  /** Metres per model unit, overriding the unit the file states (millimetres by default). */
  unitScale?: number;
}

export interface AmfLoadResult {
  /** The model, in metres and Y up: a group named after the file. */
  group: THREE.Group;
  /** The unit the file states: millimeter, inch, feet, meter or micron. */
  unit: string;
  /** Metres per model unit. */
  unitScale: number;
  /** The file's metadata, such as name and author. */
  metadata: Record<string, string>;
  /** Whether the file was a zip. */
  zipped: boolean;
  warnings: string[];
  stats: ImportStats & { objects: number; volumes: number };
}

export class AmfImportError extends Error {
  override name = 'AmfImportError';
}

const UNITS: Record<string, number> = { millimeter: 0.001, inch: 0.0254, feet: 0.3048, meter: 1, micron: 1e-6 };

/** Reads an AMF file. three.js's AMFLoader reads the XML with DOMParser, so Node needs a DOM. */
export async function loadAmf(input: ImportInput, options: AmfOptions = {}): Promise<AmfLoadResult> {
  const files = await ImportFiles.from(input, 'model.amf', ['amf']);
  const main = files.main(['amf'], options.main) ?? files.files[0];
  if (!main) throw new AmfImportError('There is no .amf file to open');
  let bytes = main.bytes;
  const zipped = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (zipped) {
    // A zipped AMF holds one .amf file; AMFLoader opens it itself, but the header is read here.
    const inner = Object.entries(unzipSync(bytes)).find(([n]) => !n.endsWith('/'));
    if (!inner) throw new AmfImportError(`${main.name} is an empty zip`);
    bytes = inner[1];
  }
  const xml = new TextDecoder().decode(bytes.subarray(0, Math.min(bytes.length, 1 << 20)));
  const root = /<amf\b([^>]*)>/i.exec(xml);
  if (!root) throw new AmfImportError(`${main.name} is not an AMF file: it has no <amf> element`);
  const unit = /\bunit\s*=\s*"([^"]+)"/i.exec(root[1]!)?.[1]?.toLowerCase() ?? 'millimeter';
  const metadata: Record<string, string> = {};
  // Metadata directly under <amf>, before the first object.
  const head = xml.slice(root.index, xml.search(/<object\b/i) >= 0 ? xml.search(/<object\b/i) : undefined);
  for (const m of head.matchAll(/<metadata\b[^>]*\btype\s*=\s*"([^"]+)"[^>]*>([^<]*)<\/metadata>/gi)) metadata[m[1]!] = m[2]!.trim();
  const objects = [...xml.matchAll(/<object\b/gi)].length;
  const volumes = [...xml.matchAll(/<volume\b/gi)].length;

  const warnings: string[] = [];
  if (!(unit in UNITS)) warnings.push(`Unknown unit ${unit}; millimetres are assumed`);
  if (/<texture\b/i.test(xml)) warnings.push('Textures are not read');
  if (/<edge\b/i.test(xml)) warnings.push('Curved triangles (edges) are drawn flat');

  let model: THREE.Group;
  const log = console.log;
  try {
    // AMFLoader logs as it reads; that is kept out of the application's console.
    console.log = () => {};
    model = new AMFLoader().parse(main.bytes.buffer.slice(main.bytes.byteOffset, main.bytes.byteOffset + main.bytes.byteLength) as ArrayBuffer);
  } catch (error) {
    throw new AmfImportError(`${main.name} could not be read: ${(error as Error).message}`);
  } finally {
    console.log = log;
  }
  toStandardMaterials(model);
  // AMFLoader gives millimetres; AMF is Z up.
  const scale = options.unitScale !== undefined ? options.unitScale / (UNITS[unit] ?? 0.001) * 0.001 : 0.001;
  const name = main.name.replace(/\\/g, '/').split('/').pop()!.replace(/\.amf$/i, '');
  model.name = name;
  const group = orient(model, name, true, scale);
  return { group, unit, unitScale: options.unitScale ?? UNITS[unit] ?? 0.001, metadata, zipped, warnings, stats: { ...countModel(group), objects, volumes } };
}
