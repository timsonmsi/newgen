'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js floating particles background
 * Creates a field of 3D particles that float and twinkle
 * Performance-optimized with BufferGeometry
 */
export function FloatingParticles({
  count = 300,
  color = '#ffffff',
  size = 0.5,
  speed = 0.02,
  spread = 80,
}: {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>(0);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    if (!containerRef.current) return;

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
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      velocitiesRef.current[i * 3] = (Math.random() - 0.5) * speed;
      velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * speed;
      velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * speed;

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      sizes[i] = Math.random() * size + size * 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Points material with vertex colors
    const material = new THREE.PointsMaterial({
      size: size * 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Update particle positions
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocitiesRef.current[i * 3];
        positions[i * 3 + 1] += velocitiesRef.current[i * 3 + 1];
        positions[i * 3 + 2] += velocitiesRef.current[i * 3 + 2];

        // Wrap around edges
        const limit = spread / 2;
        if (Math.abs(positions[i * 3]) > limit) velocitiesRef.current[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > limit) velocitiesRef.current[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > limit) velocitiesRef.current[i * 3 + 2] *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Slow rotation
      particles.rotation.y += 0.0002;

      // Twinkle effect
      material.opacity = 0.4 + Math.sin(Date.now() * 0.001) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [count, color, size, speed, spread]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default FloatingParticles;
