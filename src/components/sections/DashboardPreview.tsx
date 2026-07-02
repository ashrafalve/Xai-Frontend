"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const EASING = "easeInOut";

// Sidebar configuration
const sidebarItems = [
  { id: "Tasks", label: "Tasks", icon: "⚡" },
  { id: "Data Sources", label: "Data Sources", icon: "📂" },
  { id: "Models", label: "Models", icon: "🧠" },
  { id: "History", label: "History", icon: "🕒" },
  { id: "Integrations", label: "Integrations", icon: "🔌" },
  { id: "Settings", label: "Settings", icon: "⚙️" },
];

// Mock dashboard databases per sidebar tab
const dashboardData: Record<string, {
  stats: Array<{ label: string; value: string; subtext: string; badge: string; pulsing?: boolean; positive: boolean }>;
  tasks: Array<{ id: string; name: string; status: "Completed" | "Processing" | "Failed"; time: string }>;
  chartLabel: string;
  chartAvg: string;
  chartBars: Array<{ value: number; label: string; runs: number }>;
}> = {
  Tasks: {
    stats: [
      { label: "Data Ingested", value: "1.84M", subtext: "+2.4% last month", positive: true, badge: "+2.4%" },
      { label: "Total Runs", value: "14", subtext: "Active now", positive: true, badge: "Active", pulsing: true },
      { label: "Success Rate", value: "94.2%", subtext: "+0.5%", positive: true, badge: "+0.5%" },
      { label: "Automations Run", value: "37", subtext: "Active", positive: true, badge: "Active" },
    ],
    tasks: [
      { id: "t1", name: "Ingest data from Postgres", status: "Completed", time: "2 mins ago" },
      { id: "t2", name: "Process client feedback", status: "Processing", time: "Just now" },
      { id: "t3", name: "Sync Salesforce records", status: "Failed", time: "10 mins ago" },
      { id: "t4", name: "Transcribe video call", status: "Completed", time: "1 hour ago" },
      { id: "t5", name: "Send Slack notifications", status: "Completed", time: "2 hours ago" },
    ],
    chartLabel: "Model Runs",
    chartAvg: "Average: 730/hr",
    chartBars: [
      { value: 62, label: "09:00", runs: 620 },
      { value: 85, label: "10:00", runs: 850 },
      { value: 48, label: "11:00", runs: 480 },
      { value: 92, label: "12:00", runs: 920 },
      { value: 68, label: "13:00", runs: 680 },
      { value: 82, label: "14:00", runs: 820 },
      { value: 74, label: "15:00", runs: 740 },
      { value: 96, label: "16:00", runs: 960 },
    ]
  },
  "Data Sources": {
    stats: [
      { label: "Data Connections", value: "8", subtext: "All synced", positive: true, badge: "Healthy" },
      { label: "Pending Uploads", value: "4", subtext: "Processing", positive: true, badge: "4 Active", pulsing: true },
      { label: "Inbound Rate", value: "4.8 MB/s", subtext: "+12.1% spike", positive: true, badge: "+12.1%" },
      { label: "Sync Freq", value: "10 mins", subtext: "Interval rate", positive: true, badge: "Automatic" },
    ],
    tasks: [
      { id: "ds1", name: "PostgreSQL Sync (Production)", status: "Completed", time: "5 mins ago" },
      { id: "ds2", name: "AWS S3 Bucket Webhook Ingest", status: "Processing", time: "Active now" },
      { id: "ds3", name: "Salesforce CRM Bulk Scan", status: "Completed", time: "15 mins ago" },
      { id: "ds4", name: "MySQL ETL Legacy Pipeline", status: "Failed", time: "4 hours ago" },
      { id: "ds5", name: "Stripe webhook payments loader", status: "Completed", time: "5 hours ago" },
    ],
    chartLabel: "Inbound Data Volume",
    chartAvg: "Avg: 4.2 MB/s",
    chartBars: [
      { value: 45, label: "09:00", runs: 450 },
      { value: 50, label: "10:00", runs: 500 },
      { value: 75, label: "11:00", runs: 750 },
      { value: 95, label: "12:00", runs: 950 },
      { value: 40, label: "13:00", runs: 400 },
      { value: 65, label: "14:00", runs: 650 },
      { value: 58, label: "15:00", runs: 580 },
      { value: 80, label: "16:00", runs: 800 },
    ]
  },
  Models: {
    stats: [
      { label: "Active LLMs", value: "3 Modeles", subtext: "Custom instances", positive: true, badge: "Online" },
      { label: "API Calls", value: "14,842", subtext: "+4.8% last hr", positive: true, badge: "+4.8%" },
      { label: "Success Ratio", value: "99.8%", subtext: "No drops", positive: true, badge: "Perfect" },
      { label: "Token Usage", value: "1.24M", subtext: "48% threshold", positive: true, badge: "Normal" },
    ],
    tasks: [
      { id: "m1", name: "Claude 3.5 Extraction Runner", status: "Completed", time: "1 mins ago" },
      { id: "m2", name: "GPT-4o Feedback Sentiment Tagging", status: "Completed", time: "3 mins ago" },
      { id: "m3", name: "Llama-3 Custom Classifier execution", status: "Completed", time: "8 mins ago" },
      { id: "m4", name: "Whisper audio transcript parse", status: "Processing", time: "Active now" },
      { id: "m5", name: "Fine-tuning weights update", status: "Failed", time: "1 day ago" },
    ],
    chartLabel: "Inference Latency (ms)",
    chartAvg: "Avg: 340ms",
    chartBars: [
      { value: 80, label: "09:00", runs: 800 },
      { value: 75, label: "10:00", runs: 750 },
      { value: 90, label: "11:00", runs: 900 },
      { value: 60, label: "12:00", runs: 600 },
      { value: 45, label: "13:00", runs: 450 },
      { value: 55, label: "14:00", runs: 550 },
      { value: 70, label: "15:00", runs: 700 },
      { value: 62, label: "16:00", runs: 620 },
    ]
  },
  History: {
    stats: [
      { label: "Total Tasks Run", value: "14,284", subtext: "Since June 1st", positive: true, badge: "Archived" },
      { label: "Failures Logged", value: "42", subtext: "All auto-restarted", positive: false, badge: "Healthy" },
      { label: "Average Execution Time", value: "1.42s", subtext: "Optimized pipelines", positive: true, badge: "Fast" },
      { label: "Storage Consumed", value: "482 GB", subtext: "Database indexes", positive: true, badge: "32% Free" },
    ],
    tasks: [
      { id: "h1", name: "Daily database index compression", status: "Completed", time: "12 hours ago" },
      { id: "h2", name: "S3 backup archive dispatch", status: "Completed", time: "15 hours ago" },
      { id: "h3", name: "Old log cleanup cron job", status: "Completed", time: "18 hours ago" },
      { id: "h4", name: "User audit logging sync", status: "Completed", time: "22 hours ago" },
      { id: "h5", name: "Billing billing cycle invoice sync", status: "Failed", time: "2 days ago" },
    ],
    chartLabel: "Daily Job Success",
    chartAvg: "Avg: 99.7%",
    chartBars: [
      { value: 92, label: "Mon", runs: 98 },
      { value: 96, label: "Tue", runs: 99 },
      { value: 95, label: "Wed", runs: 99 },
      { value: 93, label: "Thu", runs: 98 },
      { value: 94, label: "Fri", runs: 98 },
      { value: 98, label: "Sat", runs: 99 },
      { value: 99, label: "Sun", runs: 100 },
      { value: 96, label: "Today", runs: 99 },
    ]
  },
  Integrations: {
    stats: [
      { label: "Connected Apps", value: "18", subtext: "APIs & Webhooks", positive: true, badge: "Active" },
      { label: "Webhook Receivers", value: "62", subtext: "Live listeners", positive: true, badge: "Online" },
      { label: "Dispatched Actions", value: "4.5K/day", subtext: "+45% last week", positive: true, badge: "+45%" },
      { label: "Rate Limit Status", value: "18%", subtext: "Within safe range", positive: true, badge: "Safe" },
    ],
    tasks: [
      { id: "i1", name: "Post Slack notification to channels", status: "Completed", time: "1 min ago" },
      { id: "i2", name: "Notion database table sync row", status: "Completed", time: "4 mins ago" },
      { id: "i3", name: "Sync HubSpot workspace deals", status: "Completed", time: "9 mins ago" },
      { id: "i4", name: "Stripe invoice alert auto-trigger", status: "Processing", time: "Active now" },
      { id: "i5", name: "Mailchimp subscriber addition", status: "Completed", time: "1 hour ago" },
    ],
    chartLabel: "Integration Dispatches",
    chartAvg: "Avg: 410/hr",
    chartBars: [
      { value: 50, label: "09:00", runs: 500 },
      { value: 68, label: "10:00", runs: 680 },
      { value: 84, label: "11:00", runs: 840 },
      { value: 90, label: "12:00", runs: 900 },
      { value: 72, label: "13:00", runs: 720 },
      { value: 60, label: "14:00", runs: 600 },
      { value: 76, label: "15:00", runs: 760 },
      { value: 92, label: "16:00", runs: 920 },
    ]
  },
  Settings: {
    stats: [
      { label: "Workspace Seats", value: "5 / 10", subtext: "Standard tier", positive: true, badge: "Premium" },
      { label: "API Key Lifespan", value: "28 days", subtext: "Auto-rotates", positive: true, badge: "Secure" },
      { label: "Current Balance", value: "$124.50", subtext: "Auto-pay enabled", positive: true, badge: "Paid" },
      { label: "Bandwidth Used", value: "84.2 GB", subtext: "500 GB limit", positive: true, badge: "Normal" },
    ],
    tasks: [
      { id: "s1", name: "Rotate Master API Key Secret", status: "Completed", time: "2 hours ago" },
      { id: "s2", name: "Update credit card numbers info", status: "Completed", time: "5 hours ago" },
      { id: "s3", name: "Invite teammate (colleague@racoai.com)", status: "Completed", time: "1 day ago" },
      { id: "s4", name: "Revoke expired developer keys", status: "Completed", time: "3 days ago" },
      { id: "s5", name: "Change webhook endpoint format URL", status: "Completed", time: "4 days ago" },
    ],
    chartLabel: "API Request Fills",
    chartAvg: "Avg: 99.98% OK",
    chartBars: [
      { value: 98, label: "09:00", runs: 980 },
      { value: 99, label: "10:00", runs: 990 },
      { value: 99, label: "11:00", runs: 992 },
      { value: 99, label: "12:00", runs: 995 },
      { value: 98, label: "13:00", runs: 982 },
      { value: 99, label: "14:00", runs: 990 },
      { value: 99, label: "15:00", runs: 994 },
      { value: 99, label: "16:05", runs: 999 },
    ]
  }
};

export function DashboardPreview() {
  const [activeSidebar, setActiveSidebar] = useState("Tasks");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Retrieve current active category data
  const categoryData = dashboardData[activeSidebar] || dashboardData.Tasks;

  return (
    <section className="py-28 px-8 bg-bg border-b border-border/20 relative overflow-hidden">
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-accent/2.5 rounded-full blur-[110px] pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="DASHBOARD"
          title="Where insight becomes action."
        />

        {/* Dashboard Mock Shell */}
        <div className="mt-20 rounded-xl border border-border/50 bg-[#121215]/80 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[580px]">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-border/50 bg-[#17171c]/45 p-5">
              <div className="mb-6 flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] text-accent font-bold">X</span>
                <span className="text-[13px] font-semibold text-text tracking-wide">Xai Workspace</span>
              </div>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSidebar(item.id)}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all w-full shrink-0 ${activeSidebar === item.id
                        ? "bg-white/5 border border-white/10 text-white font-medium shadow-sm shadow-black/10"
                        : "text-text2 hover:text-text hover:bg-white/2"
                      }`}
                  >
                    <span className={`text-[12px] opacity-80 ${activeSidebar === item.id ? "text-accent2" : "text-text3"}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-[#111114]/30">
              {/* Header Controls */}
              <div className="flex items-center justify-between border-b border-border/50 px-8 py-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold tracking-wide text-white">{activeSidebar}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-accent2/10 border border-accent2/20 text-[9px] font-semibold tracking-widest text-accent2 uppercase">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-border/60 bg-surface px-3 py-1.5 text-xs font-medium text-text2 hover:text-white hover:bg-surface2 transition-all">
                    Filter
                  </button>
                  <button className="rounded-lg border border-border/60 bg-surface px-3 py-1.5 text-xs font-medium text-text2 hover:text-white hover:bg-surface2 transition-all">
                    Share
                  </button>
                  <button className="rounded-lg bg-accent text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-accent/95 hover:shadow-lg hover:shadow-accent/15 transition-all">
                    Run Integration
                  </button>
                </div>
              </div>

              {/* Dynamic content view transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSidebar}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASING }}
                  className="p-8 flex-1 flex flex-col justify-between gap-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categoryData.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-border/40 bg-surface2/45 p-5 relative overflow-hidden group hover:border-[#7C6CFF]/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-[11px] font-semibold tracking-wider text-text2 uppercase select-none">{stat.label}</p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1 ${stat.pulsing
                                ? "bg-accent2/10 border-accent2/35 text-accent2 shadow-[0_0_8px_rgba(51,229,199,0.15)]"
                                : "bg-surface border-border text-text2"
                              }`}
                          >
                            {stat.pulsing && (
                              <span className="h-1.5 w-1.5 rounded-full bg-accent2 animate-ping" />
                            )}
                            {stat.badge}
                          </span>
                        </div>
                        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
                        <p className="mt-1 text-[11px] text-text3 select-none">{stat.subtext}</p>
                      </div>
                    ))}
                  </div>

                  {/* Dashboard Center Components */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1">
                    {/* Performance chart card */}
                    <div className="rounded-lg border border-border/40 bg-surface2/30 p-6 flex flex-col justify-between min-h-[220px]">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-semibold text-text2 tracking-wider uppercase">{categoryData.chartLabel}</h3>
                        <span className="text-[10px] text-text3">{categoryData.chartAvg}</span>
                      </div>

                      {/* Chart visualizers block */}
                      <div className="flex items-end justify-between h-40 gap-3.5 relative px-2">
                        {categoryData.chartBars.map((bar, i) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end relative"
                            onMouseEnter={() => setHoveredBar(i)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {/* Tooltip trigger animation */}
                            <AnimatePresence>
                              {hoveredBar === i && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: -8, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-[105%] z-20 bg-white text-bg px-2 py-1 rounded text-[10px] font-semibold shadow-xl pointer-events-none whitespace-nowrap"
                                >
                                  {bar.runs} {activeSidebar === "History" ? "jobs" : activeSidebar === "Models" ? "ms" : "runs"}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Graphical bar */}
                            <div
                              style={{ height: `${bar.value}%` }}
                              className={`w-full rounded-md transition-all duration-300 relative ${i % 2 === 0
                                  ? "bg-gradient-to-t from-accent/40 to-accent"
                                  : "bg-gradient-to-t from-accent2/45 to-accent2"
                                } ${hoveredBar === i
                                  ? "brightness-125 saturate-110 shadow-[0_0_12px_rgba(124,108,255,0.4)]"
                                  : ""
                                }`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between mt-3 text-[10px] text-text3 px-2 select-none border-t border-border/20 pt-2.5">
                        <span>{categoryData.chartBars[0].label}</span>
                        <span>{categoryData.chartBars[Math.floor(categoryData.chartBars.length / 2)].label}</span>
                        <span>{categoryData.chartBars[categoryData.chartBars.length - 1].label}</span>
                      </div>
                    </div>

                    {/* Tasks progress table */}
                    <div className="rounded-lg border border-[#26262B]/40 bg-surface2/30 overflow-hidden flex flex-col justify-between">
                      <div className="p-5 border-b border-border/30 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-text2 tracking-wider uppercase">Recent Actions</h3>
                        <button className="text-[10px] text-accent/80 hover:text-accent font-medium tracking-wide">
                          View Log
                        </button>
                      </div>

                      <div className="flex-1 divide-y divide-[#26262B]/30">
                        {categoryData.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition-colors cursor-pointer group"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-medium text-text group-hover:text-white transition-colors">
                                {task.name}
                              </span>
                              <span className="text-[10px] text-text3">{task.time}</span>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide border ${task.status === "Completed"
                                  ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400"
                                  : task.status === "Processing"
                                    ? "bg-amber-500/10 border-amber-500/35 text-amber-400 animate-pulse"
                                    : "bg-rose-500/10 border-rose-500/35 text-rose-400"
                                }`}
                            >
                              {task.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}