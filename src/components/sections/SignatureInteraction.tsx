"use client";

import { Suspense, lazy } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ClusterScene = lazy(() => import("@/components/three/ClusterScene"));

export function SignatureInteraction() {
  return (
    <section className="relative h-[200vh] px-6">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <SectionHeader
          eyebrow="Signature Interaction"
          title="The data cluster that reorganizes itself."
          subtitle="Watch raw data transform into structured intelligence as you scroll."
          className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl"
        />
        <Suspense fallback={<div className="h-full w-full rounded-2xl border border-border bg-surface2" />}>
          <ClusterScene />
        </Suspense>
      </div>
    </section>
  );
}