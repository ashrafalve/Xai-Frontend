import { Hero } from "@/components/sections/Hero";
import { InsightFlow } from "@/components/sections/InsightFlow";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { SignatureInteraction } from "@/components/sections/SignatureInteraction";

export default function Home() {
  return (
    <>
      <Hero />
      <InsightFlow />
      <DashboardPreview />
      <SignatureInteraction />
    </>
  );
}