"use client";

import { Suspense, lazy } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ClusterScene = lazy(() => import("@/components/three/ClusterScene"));

const deliverableLinks = [
  {
    label: "GITHUB REPOSITORY",
    href: "https://github.com/ashrafalve/Xai-Frontend",
    urlText: "github.com/ashrafalve/Xai-Frontend",
  },
  {
    label: "LIVE DEPLOYMENT",
    href: "https://xaiworkspace.vercel.app/",
    urlText: "xaiworkspace.vercel.app",
  },
  {
    label: "PRODUCT DOCUMENTATION",
    href: "https://xaiworkspace.vercel.app/product_experience_prototype_documentation.md",
    urlText: "xai-prototype-documentation.md",
  },
];

export function SignatureInteraction() {
  return (
    <section id="signature" className="py-24 px-4 sm:px-8 bg-bg relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-accent/2.5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-accent2/2.5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="SIGNATURE INTERACTION"
          title="The data cluster that reorganizes itself."
        />

        {/* 3D Scene Panels container */}
        <div className="mt-20">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square w-full rounded-xl border border-border bg-surface2/30 animate-pulse" />
              ))}
            </div>
          }>
            <ClusterScene />
          </Suspense>
        </div>

        {/* Interactive guidelines legend bar */}
        <div className="mt-16 py-5 px-6 border border-border/40 bg-surface/40 rounded-xl flex flex-col md:flex-row justify-center items-center gap-8 md:gap-14 text-center select-none">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-accent/15 border border-accent/25 text-[10px] font-bold text-accent tracking-wider uppercase">
              Interactive
            </span>
            <span className="text-xs font-semibold text-text2">
              Hover to scatter points
            </span>
          </div>

          <div className="hidden md:block text-[#26262B]">|</div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-accent2/10 border border-accent2/20 text-[10px] font-bold text-accent2 tracking-wider uppercase">
              Click Point
            </span>
            <span className="text-xs font-semibold text-text2">
              View node content
            </span>
          </div>

          <div className="hidden md:block text-[#26262B]">|</div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/25 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
              Zoom
            </span>
            <span className="text-xs font-semibold text-text2">
              Mouse wheel to explore 3D space
            </span>
          </div>
        </div>

        <div className="my-20 h-px bg-border/20 w-full" />

        {/* Deliverables external link buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deliverableLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-lg border border-border/50 bg-[#121215]/30 hover:border-accent/30 hover:bg-white/1 transition-all duration-300 group"
            >
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold tracking-widest text-text3 group-hover:text-text2 transition-colors">
                  {link.label}
                </span>
                <span className="text-xs font-semibold text-text2 group-hover:text-white transition-colors truncate">
                  {link.urlText}
                </span>
              </div>
              <span className="text-text2 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1 font-semibold text-lg">
                →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <footer className="mt-32 border-t border-border/30 bg-[#080809] py-8 px-8 mx-[-2rem] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-semibold tracking-wider text-text3 uppercase">
        <div>
          © 2026. Xai Tech Inc. All rights reserved.
        </div>
        <div className="text-text3/80">
          Built for RacoAI | Product Experience Prototype
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-text2 transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-text2 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </section>
  );
}