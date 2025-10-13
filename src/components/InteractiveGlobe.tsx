'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { geoJsonToThreeObjects } from '@/utils/geoJsonToThree';

const InteractiveGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isInteracting: false });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 16;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.pointerEvents = 'auto'; // Allow interaction
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create globe group for rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

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

    // Mouse/Touch interaction - Très douce avec retour automatique
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.isInteracting = true;
      lastInteractionTimeRef.current = Date.now();
      
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Sensibilité normale pour le drag
      targetRotationRef.current.y = mouseRef.current.x * Math.PI * 0.5; // Sensibilité normale
      targetRotationRef.current.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, mouseRef.current.y * Math.PI * 0.4)); // Limité à ±60°
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInteracting = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (event.touches.length > 0) {
        mouseRef.current.isInteracting = true;
        lastInteractionTimeRef.current = Date.now();
        
        const touch = event.touches[0];
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        // Sensibilité normale pour le touch
        targetRotationRef.current.y = mouseRef.current.x * Math.PI * 0.5; // Sensibilité normale
        targetRotationRef.current.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, mouseRef.current.y * Math.PI * 0.4)); // Limité à ±60°
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isInteracting = false;
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation loop
    const animate = () => {
      if (!globeGroupRef.current) return;

      const currentTime = Date.now();
      const timeSinceLastInteraction = currentTime - lastInteractionTimeRef.current;
      const isInteracting = mouseRef.current.isInteracting && timeSinceLastInteraction < 1000; // 1 seconde de délai

      // Rotation automatique quand pas d'interaction
      if (!isInteracting) {
        globeGroupRef.current.rotation.y += 0.005; // Rotation automatique horizontale
        // Retour graduel vers la position neutre pour l'axe vertical
        const currentRotation = globeGroupRef.current.rotation;
        targetRotationRef.current.x *= 0.98; // Retour lent vers 0
        currentRotation.x += (targetRotationRef.current.x - currentRotation.x) * 0.05;
      }

      // Interaction fluide quand on contrôle
      if (isInteracting) {
        const currentRotation = globeGroupRef.current.rotation;
        const targetRotation = targetRotationRef.current;
        
        // Interaction fluide pour les deux axes
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05; // Plus fluide
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05; // Plus fluide
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-auto cursor-grab active:cursor-grabbing" />;
};

export default InteractiveGlobe;
