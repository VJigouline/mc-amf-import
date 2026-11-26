import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { AmfImportError, loadAmf } from '../src/index.js';
import { sample } from './files.js';

const TRIANGLE = `<?xml version="1.0" encoding="UTF-8"?>
<amf unit="inch">
  <metadata type="name">Wedge</metadata>
  <material id="1"><color><r>1</r><g>0</g><b>0</b></color></material>
  <object id="0">
    <mesh>
      <vertices>
        <vertex><coordinates><x>0</x><y>0</y><z>0</z></coordinates></vertex>
        <vertex><coordinates><x>1</x><y>0</y><z>0</z></coordinates></vertex>
        <vertex><coordinates><x>0</x><y>0</y><z>1</z></coordinates></vertex>
      </vertices>
      <volume materialid="1"><triangle><v1>0</v1><v2>1</v2><v3>2</v3></triangle></volume>
    </mesh>
  </object>
</amf>`;

describe('AMF', () => {
  it('reads a zipped model', async () => {
    const r = await loadAmf(sample('rook.amf'));
    expect(r.zipped).toBe(true);
    expect(r.stats.triangles).toBeGreaterThan(100);
    expect(r.group.rotation.x).toBeCloseTo(-Math.PI / 2);
  });

  it('reads the unit, metadata and material colours, in metres and Y up', async () => {
    const r = await loadAmf(TRIANGLE);
    expect(r.unit).toBe('inch');
    expect(r.unitScale).toBe(0.0254);
    expect(r.metadata).toEqual({ name: 'Wedge' });
    expect(r.stats).toMatchObject({ objects: 1, volumes: 1, triangles: 1 });
    const size = new THREE.Box3().setFromObject(r.group).getSize(new THREE.Vector3());
    expect(size.x).toBeCloseTo(0.0254);
    expect(size.y).toBeCloseTo(0.0254);
    let material: THREE.MeshStandardMaterial | undefined;
    r.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) material = (o as THREE.Mesh).material as THREE.MeshStandardMaterial; });
    expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
  });

  it('refuses files that are not AMF', async () => {
    await expect(loadAmf('<svg/>')).rejects.toThrow(AmfImportError);
  });
});
