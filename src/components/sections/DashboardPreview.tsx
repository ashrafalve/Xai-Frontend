"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const EASING = [0.34, 1.56, 0.64, 1];

const sidebarItems = [
  { label: "Overview", icon: "▶" },
  { label: "Data Sources", icon: "▼" },
  { label: "Models", icon: "●" },
  { label: "Insights", icon: "◆" },
  { label: "Automations", icon: "◇" },
  { label: "Reports", icon: "★" },
];

const statData = [
  { label: "Total Data Points", value: "24.8K", delta: "+12.4%", positive: true },
  { label: "Active Models", value: "12", delta: "+3.1%", positive: true },
  { label: "Insights Generated", value: "142", delta: "-2.3%", positive: false },
  { label: "Time Saved", value: "342h", delta: "+18.7%", positive: true },
];

const insightsData = [
  { label: "Customer behavior anomaly detected in Q2", severity: "High" },
  { label: "Supply chain optimization opportunity", severity: "Medium" },
  { label: "Revenue forecast variance identified", severity: "High" },
  { label: "User retention pattern shift", severity: "Low" },
  { label: "Recommendation engine performance dip", severity: "Medium" },
];

export function DashboardPreview() {
  const [activeSidebar, setActiveSidebar] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Day");

  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="The Product"
          title="Where insight becomes action."
          subtitle="Monitor, analyze, and act on your data in real-time."
        />

        <div className="mt-16 rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-surface2 p-4">
              <div className="mb-4 text-xl font-semibold text-text">X</div>
              <nav className="grid grid-cols-3 lg:grid-cols-1 gap-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveSidebar(item.label)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeSidebar === item.label
                        ? "bg-accent/20 text-text"
                        : "text-text2 hover:bg-surface hover:text-text"
                    }`}
                  >
                    <span className={`text-xs ${activeSidebar === item.label ? "text-accent2" : "text-text3"}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-medium text-text">Analytics Overview</h2>
                <div className="flex items-center gap-1 rounded-lg bg-surface2 p-1">
                  {["Day", "Week", "Month"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                        activeTab === tab
                          ? "bg-accent text-white"
                          : "text-text2 hover:bg-surface hover:text-text"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.1, ease: EASING } },
                    hidden: {},
                  }}
                >
                  {statData.map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
                      className="rounded-xl border border-border bg-surface2 p-4"
                    >
                      <p className="text-sm text-text2">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-text">{stat.value}</p>
                      <p className={`mt-1 text-sm ${stat.positive ? "text-accent2" : "text-red-400"}`}>
                        {stat.delta}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.15, ease: EASING } },
                    hidden: {},
                  }}
                >
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
                    className="rounded-xl border border-border bg-surface2 p-6"
                  >
                    <h3 className="text-sm font-medium text-text2 mb-4">Performance Trends</h3>
                    <div className="flex items-end justify-between h-32 gap-2">
                      {[60, 80, 45, 90, 65, 85, 70, 95].map((height, i) => (
                        <div key={i} className="flex-1 bg-accent/30 rounded-sm" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: EASING } } }}
                    className="rounded-xl border border-border bg-surface2 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="text-sm font-medium text-text2">Recent Insights</h3>
                    </div>
                    {insightsData.map((insight) => (
                      <div
                        key={insight.label}
                        className="flex items-center justify-between px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-surface/50 transition-colors cursor-pointer"
                      >
                        <span className="text-text">{insight.label}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            insight.severity === "High"
                              ? "bg-red-500/20 text-red-300"
                              : insight.severity === "Medium"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {insight.severity}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}