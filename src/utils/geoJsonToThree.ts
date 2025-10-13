import * as THREE from 'three';

// Convert lat/lon to 3D coordinates on a sphere
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (180 - lon) * Math.PI / 180;
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Convert GeoJSON coordinates to Three.js Vector3 array
export function coordinatesToVector3Array(coordinates: number[][], radius: number): THREE.Vector3[] {
  return coordinates.map(coord => {
    const [lon, lat] = coord;
    return latLonToVector3(lat, lon, radius);
  });
}

// Create line geometry from GeoJSON polygon
export function createCountryLineGeometry(coordinates: number[][][], radius: number): THREE.BufferGeometry[] {
  const geometries: THREE.BufferGeometry[] = [];
  
  coordinates.forEach(ring => {
    const points = coordinatesToVector3Array(ring, radius);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometries.push(geometry);
  });
  
  return geometries;
}

// Process GeoJSON feature into Three.js objects
export function processGeoJsonFeature(feature: any, radius: number): THREE.Object3D[] {
  const objects: THREE.Object3D[] = [];
  
  // Create random HSL color for this country
  const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.9,
    linewidth: 2
  });
  
  if (feature.geometry.type === 'Polygon') {
    const geometries = createCountryLineGeometry([feature.geometry.coordinates[0]], radius);
    geometries.forEach(geometry => {
      const line = new THREE.Line(geometry, material);
      objects.push(line);
    });
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach((polygon: number[][][]) => {
      const geometries = createCountryLineGeometry([polygon[0]], radius);
      geometries.forEach(geometry => {
        const line = new THREE.Line(geometry, material);
        objects.push(line);
      });
    });
  }
  
  return objects;
}

// Main function to convert GeoJSON to Three.js objects
export function geoJsonToThreeObjects(geoJson: any, radius: number): THREE.Object3D[] {
  const objects: THREE.Object3D[] = [];
  
  if (geoJson.type === 'FeatureCollection') {
    geoJson.features.forEach((feature: any) => {
      const featureObjects = processGeoJsonFeature(feature, radius);
      objects.push(...featureObjects);
    });
  } else if (geoJson.type === 'Feature') {
    const featureObjects = processGeoJsonFeature(geoJson, radius);
    objects.push(...featureObjects);
  }
  
  return objects;
}
