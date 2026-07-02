"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Tooltip event type
interface NodeData {
  id: number;
  type: string;
  weight?: number;
  status?: string;
  value?: string;
}

// -------------------------------------------------------------
// Component 1: Chaos Scene (Scattered floating points)
// -------------------------------------------------------------
const CHAOS_COUNT = 45;
function ChaosParticles({ onNodeClick }: { onNodeClick: (node: NodeData) => void }) {
  const meshRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const [nodesData] = useState(() => {
    return Array.from({ length: CHAOS_COUNT }, (_, i) => ({
      id: 100 + i,
      type: ["IP Address", "Metadata Tag", "Log Event", "API Endpoint"][i % 4],
      value: `raw_log_x${i * 12}.dat`
    }));
  });

  const [positions, speeds, seeds] = useMemo(() => {
    const pos = new Float32Array(CHAOS_COUNT * 3);
    const spd = new Float32Array(CHAOS_COUNT * 3);
    const sd = new Float32Array(CHAOS_COUNT);

    for (let i = 0; i < CHAOS_COUNT; i++) {
      const i3 = i * 3;
      // Scatter in a ball cloud
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.random() * 2.5;

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      // Random slow speed
      spd[i3] = (Math.random() - 0.5) * 0.015;
      spd[i3 + 1] = (Math.random() - 0.5) * 0.015;
      spd[i3 + 2] = (Math.random() - 0.5) * 0.015;

      sd[i] = Math.random();
    }
    return [pos, spd, sd];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < CHAOS_COUNT; i++) {
        const i3 = i * 3;
        let x = posAttr.getX(i) + speeds[i3];
        let y = posAttr.getY(i) + speeds[i3 + 1];
        let z = posAttr.getZ(i) + speeds[i3 + 2];

        // Drift sinus
        x += Math.sin(time * 0.5 + seeds[i] * 10) * 0.003;
        y += Math.cos(time * 0.5 + seeds[i] * 5) * 0.003;

        // Boundaries checks
        if (Math.abs(x) > 4.5) speeds[i3] *= -1;
        if (Math.abs(y) > 4.5) speeds[i3 + 1] *= -1;
        if (Math.abs(z) > 4.5) speeds[i3 + 2] *= -1;

        // Pointer repulsion
        const mouseWorld = new THREE.Vector3(pointer.x * 5, pointer.y * 5, 0);
        const dist = new THREE.Vector3(x, y, z).distanceTo(mouseWorld);
        if (dist < 1.8) {
          const force = (1.8 - dist) * 0.018;
          const dir = new THREE.Vector3(x, y, z).sub(mouseWorld).normalize();
          x += dir.x * force;
          y += dir.y * force;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Get closest clicked point index
    if (e.index !== undefined) {
      const idx = e.index % CHAOS_COUNT;
      onNodeClick(nodesData[idx]);
    }
  };

  return (
    <points ref={meshRef} onClick={handlePointerDown}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={CHAOS_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        color="#7C6CFF"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Component 2: Process Scene (Connected constellation graph)
// -------------------------------------------------------------
const PROCESS_COUNT = 38;
function ProcessParticles({ onNodeClick }: { onNodeClick: (node: NodeData) => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { pointer } = useThree();

  const [nodesData] = useState(() => {
    return Array.from({ length: PROCESS_COUNT }, (_, i) => ({
      id: 200 + i,
      type: ["Node Relationship", "Graph Connection", "Vector Link"][i % 3],
      weight: Math.round((0.45 + Math.random() * 0.5) * 100) / 100,
    }));
  });

  const [positions, speeds, seeds] = useMemo(() => {
    const pos = new Float32Array(PROCESS_COUNT * 3);
    const spd = new Float32Array(PROCESS_COUNT * 3);
    const sd = new Float32Array(PROCESS_COUNT);

    for (let i = 0; i < PROCESS_COUNT; i++) {
      const i3 = i * 3;
      // Spiral positioning
      const t = (i / PROCESS_COUNT) * Math.PI * 2.0 * 5.0;
      const r = (i / PROCESS_COUNT) * 3.5 + 0.5;
      pos[i3] = r * Math.cos(t);
      pos[i3 + 1] = r * Math.sin(t) * 0.8;
      pos[i3 + 2] = (Math.random() - 0.5) * 2;

      spd[i3] = (Math.random() - 0.5) * 0.008;
      spd[i3 + 1] = (Math.random() - 0.5) * 0.008;
      spd[i3 + 2] = (Math.random() - 0.5) * 0.008;

      sd[i] = Math.random();
    }
    return [pos, spd, sd];
  }, []);

  // Compute connections and line layout dynamically
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current && linesRef.current) {
      const ptsGeom = pointsRef.current.geometry as THREE.BufferGeometry;
      const ptsPos = ptsGeom.attributes.position as THREE.BufferAttribute;

      // Update positions
      for (let i = 0; i < PROCESS_COUNT; i++) {
        const i3 = i * 3;
        let x = ptsPos.getX(i) + speeds[i3];
        let y = ptsPos.getY(i) + speeds[i3 + 1];
        let z = ptsPos.getZ(i) + speeds[i3 + 2];

        // Wandering motion
        x += Math.sin(time + seeds[i] * 12) * 0.002;
        y += Math.cos(time + seeds[i] * 6) * 0.002;

        if (Math.abs(x) > 4.0) speeds[i3] *= -1;
        if (Math.abs(y) > 4.0) speeds[i3 + 1] *= -1;
        if (Math.abs(z) > 3.0) speeds[i3 + 2] *= -1;

        // Mouse influence
        const mouseWorld = new THREE.Vector3(pointer.x * 4, pointer.y * 4, 0);
        const dist = new THREE.Vector3(x, y, z).distanceTo(mouseWorld);
        if (dist < 1.5) {
          const force = (1.5 - dist) * 0.012;
          const dir = new THREE.Vector3(x, y, z).sub(mouseWorld).normalize();
          x += dir.x * force;
          y += dir.y * force;
        }

        ptsPos.setXYZ(i, x, y, z);
      }
      ptsPos.needsUpdate = true;

      // Update lines by connecting close dots
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      const pColor = new THREE.Color("#7C6CFF");
      const tColor = new THREE.Color("#33E5C7");

      for (let i = 0; i < PROCESS_COUNT; i++) {
        const p1 = new THREE.Vector3(ptsPos.getX(i), ptsPos.getY(i), ptsPos.getZ(i));
        for (let j = i + 1; j < PROCESS_COUNT; j++) {
          const p2 = new THREE.Vector3(ptsPos.getX(j), ptsPos.getY(j), ptsPos.getZ(j));
          const dist = p1.distanceTo(p2);

          if (dist < 2.0) {
            linePositions.push(p1.x, p1.y, p1.z);
            linePositions.push(p2.x, p2.y, p2.z);

            // Interpolate line colors based on positions
            const ratio = (p1.x + 3) / 6;
            const mixCol = pColor.clone().lerp(tColor, ratio);
            lineColors.push(mixCol.r, mixCol.g, mixCol.b);
            lineColors.push(mixCol.r, mixCol.g, mixCol.b);
          }
        }
      }

      const lGeom = linesRef.current.geometry as THREE.BufferGeometry;
      lGeom.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lGeom.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
      lGeom.computeBoundingSphere();
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.index !== undefined) {
      const idx = e.index % PROCESS_COUNT;
      onNodeClick(nodesData[idx]);
    }
  };

  return (
    <group>
      {/* Node Points */}
      <points ref={pointsRef} onClick={handlePointerDown}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={PROCESS_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.24}
          color="#33E5C7"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      {/* Connection segments */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.35} linewidth={1} />
      </lineSegments>
    </group>
  );
}

// -------------------------------------------------------------
// Component 3: Order Scene (Perfect structured grid of points)
// -------------------------------------------------------------
const GRID_DIMS = 4; // 4x4x4 grid = 64 points
const ORDER_COUNT = GRID_DIMS * GRID_DIMS * GRID_DIMS;
function OrderParticles({ onNodeClick }: { onNodeClick: (node: NodeData) => void }) {
  const meshRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const [nodesData] = useState(() => {
    return Array.from({ length: ORDER_COUNT }, (_, i) => ({
      id: 300 + i,
      type: "Actionable Insight",
      status: "Structured & Indexed",
      value: `Node #${i + 1}`,
    }));
  });

  const positions = useMemo(() => {
    const pos = new Float32Array(ORDER_COUNT * 3);
    let idx = 0;
    const spacing = 1.3;
    const offset = ((GRID_DIMS - 1) * spacing) / 2;

    for (let x = 0; x < GRID_DIMS; x++) {
      for (let y = 0; y < GRID_DIMS; y++) {
        for (let z = 0; z < GRID_DIMS; z++) {
          const idx3 = idx * 3;
          pos[idx3] = x * spacing - offset;
          pos[idx3 + 1] = y * spacing - offset;
          pos[idx3 + 2] = z * spacing - offset;
          idx++;
        }
      }
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;

      // Make the grid wave gently like terrain or pulse based on sine waves
      let idx = 0;
      const spacing = 1.3;
      const offset = ((GRID_DIMS - 1) * spacing) / 2;

      for (let x = 0; x < GRID_DIMS; x++) {
        for (let y = 0; y < GRID_DIMS; y++) {
          for (let z = 0; z < GRID_DIMS; z++) {
            const idx3 = idx * 3;
            // Original grid positions
            const origX = x * spacing - offset;
            const origY = y * spacing - offset;
            const origZ = z * spacing - offset;

            // Apply wave factor
            const px = origX + Math.sin(time * 1.5 + origY) * 0.05;
            const py = origY + Math.cos(time * 1.5 + origX) * 0.05;
            // Hover effect
            const mouseWorld = new THREE.Vector3(pointer.x * 3, pointer.y * 3, 0);
            const dist = new THREE.Vector3(origX, origY, origZ).distanceTo(mouseWorld);

            let pz = origZ;
            if (dist < 1.8) {
              pz += (1.8 - dist) * 0.35 * Math.sin(time * 3);
            } else {
              pz += Math.sin(time * 2.0 + origX + origY) * 0.08;
            }

            posAttr.setXYZ(idx, px, py, pz);
            idx++;
          }
        }
      }
      posAttr.needsUpdate = true;

      // Slow spin
      meshRef.current.rotation.y = time * 0.08;
      meshRef.current.rotation.x = Math.sin(time * 0.04) * 0.1;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.index !== undefined) {
      const idx = e.index % ORDER_COUNT;
      onNodeClick(nodesData[idx]);
    }
  };

  return (
    <points ref={meshRef} onClick={handlePointerDown}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={ORDER_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#33E5C7"
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Interactive HUD display wrapper overlay
// -------------------------------------------------------------
function InteractionHUD({ node, onClose }: { node: NodeData | null; onClose: () => void }) {
  if (!node) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 bg-[#121215]/95 border border-[#7C6CFF]/45 rounded-lg p-3.5 backdrop-blur-md shadow-lg flex flex-col justify-between text-left gap-1">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-accent2 uppercase tracking-wide">Data Node Info</span>
        <button onClick={onClose} className="text-text3 hover:text-text text-sm leading-none bg-surface/50 hover:bg-surface h-5 w-5 rounded flex items-center justify-center">
          ✕
        </button>
      </div>
      <div className="mt-1 text-xs">
        <div className="text-white font-medium">Node ID: <span className="text-text2">#{node.id}</span></div>
        <div className="text-text2">Type: <span className="text-white">{node.type}</span></div>
        {node.weight !== undefined && (
          <div className="text-text2">Link Strength: <span className="text-[#33E5C7]">{node.weight}</span></div>
        )}
        {node.status && (
          <div className="text-text2">State Matrix: <span className="text-accent2">{node.status}</span></div>
        )}
        {node.value && (
          <div className="text-text2 truncate">Source File: <span className="text-accent italic">{node.value}</span></div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Main ClusterScene export representing 3 Panels side-by-side
// -------------------------------------------------------------
export default function ClusterScene() {
  const [activeNodeChaos, setActiveNodeChaos] = useState<NodeData | null>(null);
  const [activeNodeProcess, setActiveNodeProcess] = useState<NodeData | null>(null);
  const [activeNodeOrder, setActiveNodeOrder] = useState<NodeData | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {/* Box 1: Chaos */}
      <div className="flex flex-col gap-5 group">
        <div className="relative aspect-square w-full rounded-xl border border-border/60 bg-[#111114]/80 backdrop-blur-md overflow-hidden flex items-center justify-center hover:border-accent/40 transition-colors duration-300">
          <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold text-text3 group-hover:text-text2 tracking-wider select-none uppercase">
            01 // CHAOS SCENE
          </span>
          <Canvas camera={{ position: [0, 0, 7.5] }}>
            <ambientLight intensity={0.4} />
            <ChaosParticles onNodeClick={(n) => setActiveNodeChaos(n)} />
            <OrbitControls enableZoom={true} maxDistance={15} minDistance={3} enablePan={false} />
          </Canvas>
          <InteractionHUD node={activeNodeChaos} onClose={() => setActiveNodeChaos(null)} />
        </div>
        <div className="text-left py-1">
          <h4 className="text-sm font-semibold tracking-wide text-white">Raw Data (Chaos)</h4>
          <p className="text-xs text-text2 leading-relaxed mt-2.5">
            Scattered raw nodes of unindexed data points. Represents unstructured info ready to process.
          </p>
        </div>
      </div>

      {/* Box 2: Process */}
      <div className="flex flex-col gap-5 group">
        <div className="relative aspect-square w-full rounded-xl border border-border/60 bg-[#111114]/80 backdrop-blur-md overflow-hidden flex items-center justify-center hover:border-accent2/35 transition-colors duration-300">
          <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold text-text3 group-hover:text-text2 tracking-wider select-none uppercase">
            02 // RELATIONSHIP MAPPING
          </span>
          <Canvas camera={{ position: [0, 0, 7.0] }}>
            <ambientLight intensity={0.4} />
            <ProcessParticles onNodeClick={(n) => setActiveNodeProcess(n)} />
            <OrbitControls enableZoom={true} maxDistance={15} minDistance={3} enablePan={false} />
          </Canvas>
          <InteractionHUD node={activeNodeProcess} onClose={() => setActiveNodeProcess(null)} />
        </div>
        <div className="text-left py-1">
          <h4 className="text-sm font-semibold tracking-wide text-white">Structuring (Process)</h4>
          <p className="text-xs text-text2 leading-relaxed mt-2.5">
            Graph neural nets mapping links and relationships. Identifies patterns and overlaps dynamically.
          </p>
        </div>
      </div>

      {/* Box 3: Order */}
      <div className="flex flex-col gap-5 group">
        <div className="relative aspect-square w-full rounded-xl border border-border/60 bg-[#111114]/80 backdrop-blur-md overflow-hidden flex items-center justify-center hover:border-accent/40 transition-colors duration-300">
          <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold text-text3 group-hover:text-text2 tracking-wider select-none uppercase">
            03 // INDEXED ORDER
          </span>
          <Canvas camera={{ position: [0, 0, 7.0] }}>
            <ambientLight intensity={0.4} />
            <OrderParticles onNodeClick={(n) => setActiveNodeOrder(n)} />
            <OrbitControls enableZoom={true} maxDistance={15} minDistance={3} enablePan={false} />
          </Canvas>
          <InteractionHUD node={activeNodeOrder} onClose={() => setActiveNodeOrder(null)} />
        </div>
        <div className="text-left py-1">
          <h4 className="text-sm font-semibold tracking-wide text-white">Insight Grid (Order)</h4>
          <p className="text-xs text-text2 leading-relaxed mt-2.5">
            Actionable clusters ready for triggers. Organized structures prepared for automated workflows.
          </p>
        </div>
      </div>
    </div>
  );
}