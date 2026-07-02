"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

interface StageCardProps {
  number: number;
  title: string;
  description: string;
}

function StageCard({ number, title, description }: StageCardProps) {
  return (
    <div className="stage-card flex flex-col rounded-2xl border border-border bg-surface2 p-6 transition-all duration-500">
      <div className="flex-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
          {number}
        </span>
        <h3 className="mt-4 text-xl font-semibold text-text">{title}</h3>
        <p className="mt-2 text-sm text-text2">{description}</p>
      </div>
      <div className="mt-6 flex items-end gap-1.5">
        {[0.6, 0.8, 0.5, 0.9, 0.7].map((height, i) => (
          <div
            key={i}
            className="bar w-3 rounded-sm bg-accent/30 transition-all duration-500"
            style={{ height: `${height * 24}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export function InsightFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stage-card");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 40%",
        end: "bottom 60%",
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.min(Math.floor(progress * 3), 2);

          cards.forEach((card, i) => {
            const isActive = i === activeIndex || (i === 2 && progress > 0.66);
            if (isActive) {
              gsap.to(card, {
                borderColor: "var(--color-accent)",
                backgroundColor: "var(--color-surface)",
                duration: 0.3,
              });
              gsap.to(card.querySelectorAll(".bar"), {
                backgroundColor: "var(--color-accent)",
                height: (i: number, el: HTMLElement) => {
                  const originalHeight = parseFloat(el.style.height) || 24;
                  return `${originalHeight * 1.25}px`;
                },
                duration: 0.3,
              });
              gsap.to(card.querySelectorAll("h3, p"), { opacity: 1, y: 0, duration: 0.3 });
            } else {
              gsap.to(card, {
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface2)",
                duration: 0.3,
              });
              gsap.to(card, { opacity: 0.7, duration: 0.3 });
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="How It Works"
          title="Three stages. One continuous flow."
          subtitle="From ingestion to insight, our platform orchestrates your data journey."
        />

        <div ref={cardsRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StageCard
            number={1}
            title="Ingest Data"
            description="Upload files, connect APIs, or stream real-time data. We support all major formats and protocols."
          />
          <StageCard
            number={2}
            title="Analyze with AI"
            description="Our models process and structure your data, identifying patterns and relationships automatically."
          />
          <StageCard
            number={3}
            title="Generate Insight"
            description="Get structured reports, visualizations, and actionable recommendations tailored to your needs."
          />
        </div>
      </div>
    </section>
  );
}