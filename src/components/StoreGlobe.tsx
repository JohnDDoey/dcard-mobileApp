'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { geoJsonToThreeObjects } from '@/utils/geoJsonToThree';

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  hours: string;
  services: string[];
  isOpen: boolean;
}

interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stores: Store[];
  color: string;
}

interface StoreGlobeProps {
  zones: Zone[];
  onStoreSelect?: (store: Store) => void;
}

// Fonction pour convertir lat/lng en coordonnées 3D
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const StoreGlobe: React.FC<StoreGlobeProps> = ({ zones, onStoreSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const zoneMarkersRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const shouldAutoRotateRef = useRef(true);
  const targetZoomRef = useRef(20);
  const currentZoomRef = useRef(20);
  
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  // Fonction pour sélectionner une zone et zoomer
  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);
    shouldAutoRotateRef.current = false; // Arrêter la rotation
    
    if (globeGroupRef.current) {
      // Orienter vers la zone
      const targetRotationY = -(zone.lng * Math.PI) / 180;
      const targetRotationX = (zone.lat * Math.PI) / 180 * 0.5;
      
      globeGroupRef.current.userData.targetRotation = {
        x: targetRotationX,
        y: targetRotationY
      };
    }
    
    // Zoom vers la zone
    targetZoomRef.current = 15; // Plus proche
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 20; // Plus de recul pour voir le globe agrandi
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Calculer la position moyenne des zones pour orienter le globe
    const avgLat = zones.reduce((sum, zone) => sum + zone.lat, 0) / zones.length;
    const avgLng = zones.reduce((sum, zone) => sum + zone.lng, 0) / zones.length;
    
    // Orienter le globe vers la zone moyenne dès le départ
    globeGroup.rotation.y = -(avgLng * Math.PI) / 180;
    globeGroup.rotation.x = (avgLat * Math.PI) / 180 * 0.3; // 30% de l'inclinaison pour ne pas être trop vertical

    // Create base sphere (plus grand)
    const sphereGeometry = new THREE.SphereGeometry(8, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x001122,
      transparent: true,
      opacity: 0.15,
      wireframe: false,
    });
    const baseSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(baseSphere);

    // Load GeoJSON data
    const loadGeoJsonData = async () => {
      try {
        const response = await fetch('/data/world-countries.json');
        const geoJsonData = await response.json();
        const countryObjects = geoJsonToThreeObjects(geoJsonData, 8.01); // Agrandi pour correspondre au globe
        countryObjects.forEach(obj => {
          globeGroup.add(obj);
        });
      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
      }
    };

    loadGeoJsonData();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x606060, 1.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create zone markers (PLUS GROS pour être cliquables)
    zones.forEach(zone => {
      const position = latLngToVector3(zone.lat, zone.lng, 8.3); // Ajusté pour le globe agrandi
      
      // Marker sphere (BEAUCOUP plus gros pour être cliquable)
      const markerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: zone.color || 0xff0066,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.userData = { zoneId: zone.id, zone };
      globeGroup.add(marker);
      zoneMarkersRef.current.push(marker);

      // Glow effect (plus gros aussi)
      const glowGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: zone.color || 0xff0066,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(position);
      globeGroup.add(glow);

      // Pulse animation (will be handled in animate loop)
      glow.userData = { isPulse: true, time: 0 };
    });

    // Stars
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

    // Mouse down handler - commence le drag
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    // Mouse up handler - arrête le drag
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    // Mouse move handler pour le drag
    const handleMouseMove = (event: MouseEvent) => {
      // Rotation drag
      if (isDraggingRef.current && globeGroup) {
        const deltaX = event.clientX - previousMousePositionRef.current.x;
        const deltaY = event.clientY - previousMousePositionRef.current.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        // Limiter la rotation X
        globeGroup.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, globeGroup.rotation.x));

        previousMousePositionRef.current = {
          x: event.clientX,
          y: event.clientY
        };
        
        renderer.domElement.style.cursor = 'grabbing';
      }
    };

    // Event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mouseleave', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.style.cursor = 'grab';

    // Animation loop
    const animate = () => {
      if (!globeGroup) return;

      // Auto rotation seulement si autorisé et pas de drag
      if (shouldAutoRotateRef.current && !isDraggingRef.current) {
        globeGroup.rotation.y += 0.002;
      }

      // Zoom progressif
      const zoomDiff = targetZoomRef.current - currentZoomRef.current;
      if (Math.abs(zoomDiff) > 0.01) {
        currentZoomRef.current += zoomDiff * 0.05;
        camera.position.z = currentZoomRef.current;
      }

      // Smooth rotation to target
      if (globeGroup.userData.targetRotation) {
        const target = globeGroup.userData.targetRotation;
        globeGroup.rotation.x += (target.x - globeGroup.rotation.x) * 0.05;
        globeGroup.rotation.y += (target.y - globeGroup.rotation.y) * 0.05;
        
        // Clear target when close enough
        if (Math.abs(target.x - globeGroup.rotation.x) < 0.01 && 
            Math.abs(target.y - globeGroup.rotation.y) < 0.01) {
          delete globeGroup.userData.targetRotation;
        }
      }

      // Pulse animation for glows
      globeGroup.children.forEach(child => {
        if (child.userData.isPulse) {
          child.userData.time += 0.05;
          const scale = 1 + Math.sin(child.userData.time) * 0.2;
          child.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mouseleave', handleMouseUp);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [zones]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[700px]">
      {/* Liste des zones (GAUCHE) */}
      <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md rounded-2xl p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">🌍 Nos zones</h3>
          <p className="text-sm text-white/70">
            Cliquez sur une zone pour voir les boutiques
          </p>
        </div>

        {/* Liste des zones avec vignettes */}
        <div className="space-y-3">
          {zones.map(zone => (
            <div key={zone.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all">
              {/* En-tête de zone */}
              <button
                onClick={() => {
                  handleZoneSelect(zone);
                  setExpandedZone(expandedZone === zone.id ? null : zone.id);
                }}
                className="w-full p-4 flex items-center gap-3 hover:bg-white/10 transition-all text-left"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: zone.color + '30', border: `2px solid ${zone.color}` }}
                >
                  📍
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg">{zone.name}</h4>
                  <p className="text-xs text-white/60">
                    {zone.stores.length} boutique{zone.stores.length > 1 ? 's' : ''}
                  </p>
                </div>
                <svg 
                  className={`w-5 h-5 text-white/60 transition-transform ${expandedZone === zone.id ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Liste des boutiques (expandable) */}
              {expandedZone === zone.id && (
                <div className="border-t border-white/10 p-4 space-y-3 bg-white/5">
                  {zone.stores.map(store => (
                    <div
                      key={store.id}
                      className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all cursor-pointer border border-white/10"
                      onClick={() => onStoreSelect?.(store)}
                    >
                      <h4 className="font-bold text-white mb-2">{store.name}</h4>
                      
                      <div className="space-y-2 text-sm text-white/80">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <div>
                            <p>{store.address}</p>
                            <p className="text-xs opacity-70">{store.postalCode} {store.city}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>{store.hours}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            store.isOpen ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {store.isOpen ? '● Ouvert' : '● Fermé'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {store.services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <a
                          href={`tel:${store.phone}`}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium py-2 px-3 rounded-lg transition-all text-center text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📞 Appeler
                        </a>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.city)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium py-2 px-3 rounded-lg transition-all text-center text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🗺️ Itinéraire
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Globe Container (DROITE) */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900">
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Info zone sélectionnée */}
        {selectedZone && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-5 py-3 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedZone.color }}
              ></div>
              <p className="text-lg font-bold">{selectedZone.name}</p>
            </div>
            <p className="text-xs opacity-80">
              {selectedZone.stores.length} boutique{selectedZone.stores.length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg text-right">
          <p className="text-xs opacity-90">
            {selectedZone ? '🔍 Zone focalisée' : '🌍 Sélectionnez une zone à gauche'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreGlobe;

