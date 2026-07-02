"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface StageCardProps {
  number: string;
  title: string;
  description: string;
  isActive: boolean;
  type: "ingest" | "analyze" | "insight";
}

function StageCard({ number, title, description, isActive, type }: StageCardProps) {
  // Generate random animation delays for the equalizer bars
  const bars = Array.from({ length: 9 }, (_, idx) => ({
    height: 12 + Math.abs(Math.sin(idx * 0.8)) * 32,
    delay: idx * 0.1,
  }));

  return (
    <motion.div
      initial={false}
      animate={{
        borderColor: isActive ? "rgba(124, 108, 255, 0.4)" : "rgba(38, 38, 43, 0.5)",
        backgroundColor: isActive ? "rgba(19, 19, 22, 0.85)" : "rgba(27, 27, 31, 0.3)",
        opacity: isActive ? 1 : 0.45,
        y: isActive ? -6 : 0,
        boxShadow: isActive ? "0 10px 30px -10px rgba(124, 108, 255, 0.15)" : "none",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col justify-between rounded-xl border p-8 h-[280px] relative overflow-hidden transition-all duration-350 cursor-pointer select-none group"
    >
      {/* Light glow inside when active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent2/5 pointer-events-none" />
      )}

      <div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${isActive ? "text-accent2" : "text-text3"} tracking-widest`}>
            {number}
          </span>
          {type === "analyze" && isActive && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
            </span>
          )}
        </div>
        <h3 className="mt-6 text-xl font-medium text-text tracking-wide">{title}</h3>
        <p className="mt-3 text-sm text-text2 leading-relaxed font-normal">{description}</p>
      </div>

      {/* Visual Component in Card Footer */}
      <div className="mt-8 flex items-end gap-1.5 h-12">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            animate={
              isActive
                ? {
                  height: [
                    `${bar.height * 0.4}px`,
                    `${bar.height}px`,
                    `${bar.height * 0.6}px`,
                    `${bar.height * 1.1}px`,
                    `${bar.height * 0.4}px`,
                  ],
                }
                : { height: `${bar.height * 0.25}px` }
            }
            transition={{
              duration: isActive ? 1.5 + (i % 3) * 0.2 : 0,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bar.delay,
            }}
            className={`w-[7px] rounded-md transition-colors duration-450 ${isActive
                ? type === "analyze"
                  ? "bg-accent2 shadow-[0_0_8px_rgba(51,229,199,0.4)]"
                  : type === "ingest"
                    ? "bg-[#7C6CFF]/85 shadow-[0_0_8px_rgba(124,108,255,0.4)]"
                    : "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.4)]"
                : "bg-surface border border-border/80"
              }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function InsightFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 45%",
        end: "bottom 55%",
        onUpdate: (self) => {
          const progress = self.progress;
          // Split progress (from 0 to 1) into 3 brackets: 0 -> Stage 1, 0.33 -> Stage 2, 0.66 -> Stage 3
          let idx = 0;
          if (progress > 0.35 && progress <= 0.7) {
            idx = 1;
          } else if (progress > 0.7) {
            idx = 2;
          }
          setActiveIndex(idx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stages" className="py-28 px-8 bg-bg relative overflow-hidden border-b border-border/20">
      <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-accent2/2.5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="STAGES"
          title="Three stages. One continuous flow."
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StageCard
            number="01"
            title="Ingest Data"
            description="Automatically ingest data from any source - databases, APIs, documents, or event streams."
            isActive={activeIndex === 0}
            type="ingest"
          />
          <StageCard
            number="02"
            title="Analyze with AI"
            description="Structure, clean, and enrich files with modern AI models tailored to your business needs."
            isActive={activeIndex === 1}
            type="analyze"
          />
          <StageCard
            number="03"
            title="Generate Insight"
            description="Transform analyzed results into automated actions and alerts for your workflows."
            isActive={activeIndex === 2}
            type="insight"
          />
        </div>
      </div>
    </section>
  );
}