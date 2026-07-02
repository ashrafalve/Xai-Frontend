"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const POINT_COUNT = 300;
const GRID_SIZE = 10;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const makePositions = () => {
  const initial = new Float32Array(POINT_COUNT * 3);
  const target = new Float32Array(POINT_COUNT * 3);

  for (let i = 0; i < POINT_COUNT; i++) {
    const i3 = i * 3;

    const seed = i * 0.107;
    initial[i3] = (seed - Math.floor(seed) - 0.5) * 20;
    initial[i3 + 1] = ((seed * 1.3) - Math.floor(seed * 1.3) - 0.5) * 20;
    initial[i3 + 2] = ((seed * 1.7) - Math.floor(seed * 1.7) - 0.5) * 20;

    const idx = i % (GRID_SIZE * GRID_SIZE);
    const row = Math.floor(idx / GRID_SIZE);
    const col = idx % GRID_SIZE;
    const layer = Math.floor(i / (GRID_SIZE * GRID_SIZE));

    target[i3] = (col - GRID_SIZE / 2 + 0.5) * 0.8;
    target[i3 + 1] = (row - GRID_SIZE / 2 + 0.5) * 0.8;
    target[i3 + 2] = (layer - 2) * 0.8;
  }

  return { initial, target };
};

function Points() {
  const meshRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const [progress, setProgress] = useState(0);

  const { initial, target } = useMemo(() => makePositions(), []);

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: "canvas",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => setProgress(self.progress),
      scrub: true,
    });

    return () => trigger.kill();
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < POINT_COUNT; i++) {
        const i3 = i * 3;
        const eased = easeOutCubic(progress);

        const currentX = posAttr.getX(i);
        const currentY = posAttr.getY(i);
        const currentZ = posAttr.getZ(i);

        posAttr.setXYZ(
          i,
          currentX + (target[i3] - currentX) * eased * 0.05,
          currentY + (target[i3 + 1] - currentY) * eased * 0.05,
          currentZ + (target[i3 + 2] - currentZ) * eased * 0.05
        );
      }

      posAttr.needsUpdate = true;

      meshRef.current.rotation.x = pointer.y * 0.3;
      meshRef.current.rotation.y = pointer.x * 0.3;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initial, 3]}
          count={POINT_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#7C6CFF" sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

export default function ClusterScene() {
  return (
    <Canvas camera={{ position: [0, 0, 30] }}>
      <ambientLight intensity={0.5} />
      <Points />
    </Canvas>
  );
}