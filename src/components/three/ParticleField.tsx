"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const GRID_SIZE = 10;
const PARTICLE_COUNT = GRID_SIZE * GRID_SIZE;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const gridPos = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const x = (col - GRID_SIZE / 2 + 0.5) * 0.8;
      const y = (row - GRID_SIZE / 2 + 0.5) * 0.8;
      const z = 0;

      gridPos[i3] = x;
      gridPos[i3 + 1] = y;
      gridPos[i3 + 2] = z;

      pos[i3] = (Math.random() - 0.5) * 15;
      pos[i3 + 1] = (Math.random() - 0.5) * 15;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;
    }
    return { initial: pos, target: gridPos };
  }, []);

  const progressRef = useRef(0);

  useFrame(() => {
    if (meshRef.current) {
      if (progressRef.current < 1) {
        progressRef.current = Math.min(progressRef.current + 0.02, 1);
      }

      const progress = progressRef.current;
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const currentX = posAttr.getX(i);
        const currentY = posAttr.getY(i);
        const currentZ = posAttr.getZ(i);

        const targetX = positions.target[i3];
        const targetY = positions.target[i3 + 1];
        const targetZ = positions.target[i3 + 2];

        posAttr.setXYZ(
          i,
          currentX + (targetX - currentX) * progress * 0.1,
          currentY + (targetY - currentY) * progress * 0.1,
          currentZ + (targetZ - currentZ) * progress * 0.1
        );
      }

      posAttr.needsUpdate = true;

      meshRef.current.rotation.x = pointer.y * 0.2;
      meshRef.current.rotation.y = pointer.x * 0.2;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions.initial}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#7C6CFF" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas camera={{ position: [0, 0, 20] }}>
      <Particles />
    </Canvas>
  );
}