import * as THREE from 'three';

export interface RegionCoords {
  lat: number;
  lon: number;
}

export const regionCoordinates: Record<string, RegionCoords> = {
  'Afrique de l\'Ouest': { lat: 8, lon: -2 },
  'Afrique de l\'Est': { lat: 1, lon: 38 },
  'Afrique Centrale': { lat: 7, lon: 21 },
  'Afrique du Sud': { lat: -30, lon: 25 },
  'Afrique du Nord': { lat: 31, lon: 10 },
  'Europe': { lat: 54, lon: 10 },
  'Amérique du Nord': { lat: 40, lon: -100 },
  'Amérique du Sud': { lat: -15, lon: -60 },
  'Asie': { lat: 35, lon: 105 },
  'Océanie': { lat: -25, lon: 133 },
};

export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}
