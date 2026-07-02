"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const CHAOS_COUNT = 80;
const GRID_ROWS = 8;
const GRID_COLS = 8;
const GRID_COUNT = GRID_ROWS * GRID_COLS;
const TOTAL_COUNT = CHAOS_COUNT + GRID_COUNT;

function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { pointer } = useThree();

  // Create references and configurations for nodes
  const [nodes, linePairs] = useMemo(() => {
    const list: Array<{
      pos: THREE.Vector3;
      target: THREE.Vector3;
      speed: THREE.Vector3;
      type: "chaos" | "grid";
      seed: number;
    }> = [];

    // 1. Create Chaos Nodes (left side of the screen)
    for (let i = 0; i < CHAOS_COUNT; i++) {
      const seed = Math.random();
      // Scattered on the left: X is between -8 and -2, Y is between -4 and 4, Z is between -3 and 3
      const x = -6 + (Math.random() - 0.5) * 5;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;

      const pos = new THREE.Vector3(x, y, z);
      list.push({
        pos,
        target: pos.clone(),
        speed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        type: "chaos",
        seed,
      });
    }

    // 2. Create Grid Nodes (right side of the screen)
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const seed = Math.random();
        // Structured on the right: X is between 1 and 7, Y is between -3 and 3, Z is 0
        const x = 2 + c * 0.65;
        const y = -2.28 + r * 0.65;
        const z = 0;

        const pos = new THREE.Vector3(x, y, z);
        list.push({
          pos,
          target: pos.clone(),
          speed: new THREE.Vector3(0, 0, 0),
          type: "grid",
          seed,
        });
      }
    }

    // 3. Establish structural connections/lines from Chaos to Grid
    const pairs: Array<[number, number]> = [];

    // Connect each chaos node to at least one grid node to show structural mapping
    for (let i = 0; i < CHAOS_COUNT; i++) {
      // Pick 1 or 2 random grid nodes to link to
      const linkCount = Math.random() > 0.7 ? 2 : 1;
      for (let l = 0; l < linkCount; l++) {
        const gridIndex = CHAOS_COUNT + Math.floor(Math.random() * GRID_COUNT);
        pairs.push([i, gridIndex]);
      }
    }

    // Connect close grid nodes to each other to make the grid feel interconnected
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const i1 = CHAOS_COUNT + r * GRID_COLS + c;
        if (c < GRID_COLS - 1) { // connector search right partner
          pairs.push([i1, i1 + 1]);
        }
        if (r < GRID_ROWS - 1) { // connector search top partner
          pairs.push([i1, i1 + GRID_COLS]);
        }
      }
    }

    return [list, pairs];
  }, []);

  // Set up Float32Arrays for position and color attributes
  const [positions, colors] = useMemo(() => {
    const posArr = new Float32Array(TOTAL_COUNT * 3);
    const colArr = new Float32Array(TOTAL_COUNT * 3);

    const purple = new THREE.Color("#7C6CFF");
    const teal = new THREE.Color("#33E5C7");

    nodes.forEach((node, idx) => {
      const idx3 = idx * 3;
      posArr[idx3] = node.pos.x;
      posArr[idx3 + 1] = node.pos.y;
      posArr[idx3 + 2] = node.pos.z;

      const color = node.type === "chaos" ? purple : teal;
      colArr[idx3] = color.r;
      colArr[idx3 + 1] = color.g;
      colArr[idx3 + 2] = color.b;
    });

    return [posArr, colArr];
  }, [nodes]);

  // Set up lines positions and colors
  const [linePositions, lineColors] = useMemo(() => {
    const posArr = new Float32Array(linePairs.length * 2 * 3);
    const colArr = new Float32Array(linePairs.length * 2 * 3);

    const purple = new THREE.Color("#7C6CFF");
    const teal = new THREE.Color("#33E5C7");

    linePairs.forEach((pair, idx) => {
      const p1 = nodes[pair[0]];
      const p2 = nodes[pair[1]];

      const idx6 = idx * 6;

      posArr[idx6] = p1.pos.x;
      posArr[idx6 + 1] = p1.pos.y;
      posArr[idx6 + 2] = p1.pos.z;

      posArr[idx6 + 3] = p2.pos.x;
      posArr[idx6 + 4] = p2.pos.y;
      posArr[idx6 + 5] = p2.pos.z;

      // Color from node 1 to node 2
      const c1 = p1.type === "chaos" ? purple : teal;
      const c2 = p2.type === "chaos" ? purple : teal;

      colArr[idx6] = c1.r;
      colArr[idx6 + 1] = c1.g;
      colArr[idx6 + 2] = c1.b;

      colArr[idx6 + 3] = c2.r;
      colArr[idx6 + 4] = c2.g;
      colArr[idx6 + 5] = c2.b;
    });

    return [posArr, colArr];
  }, [nodes, linePairs]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current && linesRef.current) {
      const ptsGeometry = pointsRef.current.geometry as THREE.BufferGeometry;
      const ptsPosAttr = ptsGeometry.attributes.position as THREE.BufferAttribute;

      const linesGeometry = linesRef.current.geometry as THREE.BufferGeometry;
      const linesPosAttr = linesGeometry.attributes.position as THREE.BufferAttribute;

      // 1. Update nodes positions in simulation
      nodes.forEach((node, idx) => {
        if (node.type === "chaos") {
          // Chaos nodes drift slightly and react to cursor
          const xDrift = Math.sin(time + node.seed * 100) * 0.003;
          const yDrift = Math.cos(time + node.seed * 50) * 0.003;
          node.pos.add(node.speed);
          node.pos.x += xDrift;
          node.pos.y += yDrift;

          // Boundaries checking for chaotic nodes box
          if (node.pos.x < -8.5 || node.pos.x > -1.5) node.speed.x *= -1;
          if (node.pos.y < -4.5 || node.pos.y > 4.5) node.speed.y *= -1;
          if (node.pos.z < -3.5 || node.pos.z > 3.5) node.speed.z *= -1;

          // Influence of mouse pointer (gently push points away/towards pointer)
          const mouseWorld = new THREE.Vector3(pointer.x * 5, pointer.y * 3, 0);
          const dist = node.pos.distanceTo(mouseWorld);
          if (dist < 2.5) {
            const force = (2.5 - dist) * 0.015;
            const dir = new THREE.Vector3().subVectors(node.pos, mouseWorld).normalize();
            node.pos.addScaledVector(dir, force);
          }
        } else {
          // Grid nodes wave gently based on sinus wave
          const waveFreq = 2.0;
          const waveAmp = 0.15;
          node.pos.z = Math.sin(time * waveFreq + node.pos.x * 1.5 + node.pos.y * 1.5) * waveAmp;

          // Subtle cursor reaction
          const mouseWorld = new THREE.Vector3((pointer.x + 1) * 3, pointer.y * 2, 0);
          const dist = node.pos.distanceTo(mouseWorld);
          if (dist < 1.5) {
            node.pos.z += (1.5 - dist) * 0.1;
          }
        }

        // Apply back to buffer attribute
        ptsPosAttr.setXYZ(idx, node.pos.x, node.pos.y, node.pos.z);
      });

      ptsPosAttr.needsUpdate = true;

      // 2. Update lines geometry positions to follow updated nodes
      linePairs.forEach((pair, idx) => {
        const p1 = nodes[pair[0]];
        const p2 = nodes[pair[1]];

        const idx6 = idx * 6;

        linesPosAttr.setXYZ(idx6, p1.pos.x, p1.pos.y, p1.pos.z);
        linesPosAttr.setXYZ(idx6 + 1, p2.pos.x, p2.pos.y, p2.pos.z);
      });

      linesPosAttr.needsUpdate = true;

      // Gentle overall scene rotation based on cursor
      pointsRef.current.rotation.y = pointer.x * 0.08;
      pointsRef.current.rotation.x = -pointer.y * 0.08;
      linesRef.current.rotation.y = pointer.x * 0.08;
      linesRef.current.rotation.x = -pointer.y * 0.08;
    }
  });

  return (
    <group>
      {/* Dynamic line connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
            count={lineColors.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.12} linewidth={1} />
      </lineSegments>

      {/* Nodes points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={TOTAL_COUNT}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={TOTAL_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.85}
        />
      </points>
    </group>
  );
}

export default function ParticleField() {
  return (
    <Canvas camera={{ position: [0, 0, 8.5], fov: 60 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <ParticleNetwork />
    </Canvas>
  );
}