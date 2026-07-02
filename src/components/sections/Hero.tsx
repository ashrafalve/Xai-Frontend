"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Suspense, lazy } from "react";

const ParticleField = lazy(() => import("@/components/three/ParticleField"));

const EASING = "easeOut";

export function Hero() {
  return (
    <section className="flex-1 pt-32 pb-16 px-4 sm:px-8 bg-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent2/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-8rem)]">
        <motion.div
          className="flex flex-col lg:col-span-6 z-10"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15, ease: EASING } },
            hidden: {},
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
          >
            <span className="inline-block px-3 py-1 text-[10px] font-semibold text-accent2 uppercase tracking-[0.2em] bg-accent2/10 border border-accent2/20 rounded-full w-fit">
              INTELLIGENT WORKFLOWS
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-5xl font-semibold text-text leading-[1.15] sm:text-6xl tracking-tight"
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
          >
            From raw data to<br />actionable intelligence.
          </motion.h1>

          <motion.p
            className="mt-6 text-md sm:text-lg text-text2 leading-relaxed max-w-lg font-normal"
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
          >
            Xai turns inconsistent, unorganized data into automated workflows. Capture data from any source, transform it, and orchestrate actions in real-time.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center gap-6"
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
          >
            <Button variant="primary" className="bg-[#7C6CFF] text-white hover:bg-[#6654ff] hover:shadow-lg hover:shadow-accent/20 rounded-lg px-6 h-11 text-sm font-medium tracking-wide">
              Start workspace
            </Button>
            <button className="flex items-center gap-2 text-sm font-semibold tracking-wide text-text2 hover:text-text group transition-colors duration-200">
              Watch walkthrough
              <span className="transition-transform duration-200 group-hover:translate-x-1 text-sm">→</span>
            </button>
          </motion.div>
        </motion.div>

        <div className="relative aspect-square lg:col-span-6 w-full max-w-xl mx-auto flex items-center justify-center bg-transparent">
          <Suspense fallback={
            <div className="w-full h-full bg-surface/50 rounded-2xl border border-border/30 animate-pulse" />
          }>
            <div className="w-full h-full p-2">
              <ParticleField />
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  );
}