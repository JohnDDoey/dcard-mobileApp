'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { geoJsonToThreeObjects } from '@/utils/geoJsonToThree';

// Globe global persistant - créé une seule fois
let globalGlobe: {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  globeGroup: THREE.Group;
  animationId: number | null;
  isInitialized: boolean;
  targetZoom: number;
  currentZoom: number;
  setTargetZoom?: (newTargetZoom: number) => void;
} | null = null;

// Fonction pour changer le zoom du globe
export const setGlobeZoom = (step: number) => {
  if (!globalGlobe) {
    return;
  }
  
  // Zoom progressif : step 1 = 16, step 2 = 12, step 3 = 8, step 4 = 4 (centre)
  const zoomLevels = [16, 12, 8, 4];
  const targetZoom = zoomLevels[step - 1] || 16;
  
  globalGlobe.targetZoom = targetZoom;
  
  // Utiliser la fonction setTargetZoom si disponible
  if (globalGlobe.setTargetZoom) {
    globalGlobe.setTargetZoom(targetZoom);
  }
  
  // Forcer la mise à jour immédiate
  setTimeout(() => {
    if (globalGlobe) {
      globalGlobe.camera.position.z = globalGlobe.currentZoom;
    }
  }, 100);
};

// Fonction pour initialiser le globe global
const initializeGlobalGlobe = () => {
  if (globalGlobe?.isInitialized) return globalGlobe;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 16; // Initial zoom
  
  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  renderer.domElement.style.width = '100vw';
  renderer.domElement.style.height = '100vh';
  renderer.domElement.style.pointerEvents = 'none'; // Allow clicks to pass through
  document.body.appendChild(renderer.domElement); // Attach to body

  // Create globe group for rotation
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Create base sphere (subtle dark background)
  const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x001122,
    transparent: true,
    opacity: 0.15,
    wireframe: false,
  });
  const baseSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  globeGroup.add(baseSphere);

  // Load and render GeoJSON data
  const loadGeoJsonData = async () => {
    try {
      const response = await fetch('/data/world-countries.json');
      const geoJsonData = await response.json();
      const countryObjects = geoJsonToThreeObjects(geoJsonData, 5.01);
      countryObjects.forEach(obj => {
        globeGroup.add(obj);
      });
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
      // Fallback: Create a simple wireframe globe
      const fallbackGeometry = new THREE.SphereGeometry(5, 32, 32);
      const fallbackMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const fallbackGlobe = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      globeGroup.add(fallbackGlobe);
    }
  };

  loadGeoJsonData();

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x606060, 1.2);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 2, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Create particles for stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 1000;
  const positions = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Animation loop
  let animationId: number | null = null;
  let currentZoom = 16; // Initial zoom
  let targetZoom = 16; // Initial target zoom
  
  const animate = () => {
    // Auto rotation
    globeGroup.rotation.y += 0.005;

    // Smooth zoom animation
    const zoomDiff = targetZoom - currentZoom;
    if (Math.abs(zoomDiff) > 0.01) {
      currentZoom += zoomDiff * 0.05; // Smooth transition
      camera.position.z = currentZoom;
      console.log(`Animation: currentZoom=${currentZoom}, targetZoom=${targetZoom}, camera.z=${camera.position.z}`);
    }

    // Update global zoom values
    if (globalGlobe) {
      globalGlobe.currentZoom = currentZoom;
      globalGlobe.targetZoom = targetZoom;
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  globalGlobe = {
    scene,
    renderer,
    camera,
    globeGroup,
    animationId,
    isInitialized: true,
    targetZoom: 16,
    currentZoom: 16 // Initialize currentZoom
  };
  
  // Exposer les variables locales à la fonction setGlobeZoom
  globalGlobe.setTargetZoom = (newTargetZoom: number) => {
    targetZoom = newTargetZoom;
    globalGlobe!.targetZoom = newTargetZoom;
    console.log(`setTargetZoom: ${newTargetZoom}`);
  };

  return globalGlobe;
};

const PersistentGlobe: React.FC = () => {
  useEffect(() => {
    const globe = initializeGlobalGlobe();
    return () => {
      // Cleanup if needed, though for a persistent globe, it might not be fully unmounted
      if (globe && globe.renderer.domElement.parentNode) {
        // globe.renderer.domElement.parentNode.removeChild(globe.renderer.domElement);
        // if (globe.animationId) cancelAnimationFrame(globe.animationId);
        // globalGlobe = null; // Reset global reference if truly unmounting
      }
    };
  }, []);

  return null; // This component doesn't render anything itself, it manages the global canvas
};

export default PersistentGlobe;
