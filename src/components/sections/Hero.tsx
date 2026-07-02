"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Suspense, lazy } from "react";

const ParticleField = lazy(() => import("@/components/three/ParticleField"));

export function Hero() {
  return (
    <section className="flex-1 pt-24 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
        <motion.div
          className="flex flex-col"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {},
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-accent2 uppercase tracking-wider border border-accent2/30 rounded-full w-fit">
              Intelligence Workspace
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-5xl font-semibold text-text leading-tight sm:text-6xl"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            From raw data to actionable intelligence.
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-text2 max-w-lg"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            Transform unstructured data into structured insights with our AI-powered platform.
            Visualize patterns, uncover hidden relationships, and make informed decisions faster.
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">View Documentation</Button>
          </motion.div>
        </motion.div>

        <div className="relative aspect-square rounded-2xl border border-border bg-surface2 overflow-hidden">
          <Suspense fallback={<div className="w-full h-full bg-surface2 rounded-2xl" />}>
            <ParticleField />
          </Suspense>
        </div>
      </div>
    </section>
  );
}