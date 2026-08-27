"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedClient, setSelectedClient] = useState("High Rise Chimney Sweep & Service");
  const [selectedPlatform, setSelectedPlatform] = useState("Google My Business (GMB)");
  const [selectedSabZip, setSelectedSabZip] = useState("All Service Territory ZIPs (5)");
  const [selectedGain, setSelectedGain] = useState<"5%" | "10%" | "15%" | "25%">("10%");

  const clients = [
    "All About Fences",
    "CarBahn",
    "Dry Space Crawlspace Solutions",
    "High Rise Chimney Sweep & Service",
    "Hyundai",
    "Hyundai Parts and Service",
    "KCW",
    "Koon Cook & Walters",
    "Recoat Revolution",
    "Sicardo Towing",
    "Southeast Motorcycle",
    "Twin Lakes Boat Rental"
  ];

  const platforms = [
    "Google My Business (GMB)",
    "Google Ads (Paid Search)",
    "Meta Ads (CAPI / Paid Social)",
    "Google Search Console (GSC)",
    "Google Analytics 4 (GA4)",
    "CRM Lead & Revenue Pipeline"
  ];

  const getTargetVal = (base: number) => {
    const multipliers = { "5%": 1.05, "10%": 1.10, "15%": 1.25, "25%": 1.25 };
    return Math.round(base * multipliers[selectedGain]);
  };

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-6 md:p-10 font-sans">
      {/* 1. White Hero Header Container with Local Logo Asset */}
      <header className="bg-white text-slate-900 rounded-2xl p-6 mb-8 shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-100">
        <div className="flex items-center gap-6">
          {/* Logo image rendered directly from /public */}
          <div className="flex flex-col items-center justify-center border-r border-slate-200 pr-6">
            <Image 
              src="/porch-light-google-oauth-logo-120x120.png" 
              alt="Porch Light Logo" 
              width={100} 
              height={100} 
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Paid Media and Local Search Intelligence Center
            </h1>
            
            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">CLIENT:</span>
                <select 
                  value={selectedClient} 
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-slate-900 text-white font-bold text-xs px-2 py-1 rounded outline-none cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">PLATFORM:</span>
                <select 
                  value={selectedPlatform} 
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="bg-slate-900 text-white font-bold text-xs px-2 py-1 rounded outline-none cursor-pointer"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">SAB ZIP:</span>
                <select 
                  value={selectedSabZip} 
                  onChange={(e) => setSelectedSabZip(e.target.value)}
                  className="bg-slate-900 text-white font-bold text-xs px-2 py-1 rounded outline-none cursor-pointer"
                >
                  <option value="All Service Territory ZIPs (5)">All Service Territory ZIPs (5)</option>
                  <option value="Core Territory Only (3)">Core Territory Only (3)</option>
                </select>
              </div>
            </div>

            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-3">
              LOCAL SEARCH INTELLIGENCE & SAB PERFORMANCE ENGINE
            </div>
          </div>
        </div>

        {/* Action Buttons & Licensing Section */}
        <div className="flex flex-col gap-2.5 w-full xl:w-auto">
          <button className="bg-[#00a86b] hover:bg-emerald-600 text-white text-xs font-black px-6 py-2.5 rounded-lg transition shadow-md w-full">
            ⚡ Analyze & Recommend Actions
          </button>
          <button className="bg-[#1b2234] hover:bg-slate-800 text-white text-xs font-bold px-6 py-2 rounded-lg transition w-full">
            Export PDF
          </button>
          <button className="bg-[#ff9900] hover:bg-amber-500 text-slate-950 text-xs font-black px-6 py-2 rounded-lg transition shadow-md w-full">
            Copy Gemini Prompt
          </button>

          {/* Seat License Badge */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-800 mt-1">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-amber-400 uppercase">PRO LICENSE ACTIVE</span>
              <span className="text-[10px] font-mono text-slate-300">3 / 5 Seats Claimed</span>
            </div>
            <button className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded hover:bg-amber-400 transition">
              + Add Seats
            </button>
          </div>
        </div>
      </header>

      {/* 2. Target Outcome Scenario Simulator */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>🎯 Target Outcome Scenario Simulator</span>
              <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono">
                APEX PREDICTIVE ENGINE
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a growth target to calculate exact operational input recipes across connected channels
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(["5%", "10%", "15%", "25%"] as const).map((gain) => (
              <button
                key={gain}
                onClick={() => setSelectedGain(gain)}
                className={`px-3.5 py-1 text-xs font-black rounded-lg transition ${
                  selectedGain === gain
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                +{gain}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#070a12] p-4 rounded-xl border border-slate-800/80">
          <div className="border-r border-slate-800/80 pr-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Baseline</span>
            <div className="text-2xl font-black text-slate-200 mt-1">31 Calls/mo</div>
            <span className="text-[10px] text-slate-500 font-mono">VERIFIED NATIVE GBP API</span>
          </div>

          <div className="border-r border-slate-800/80 pr-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Modeled Target (+{selectedGain})</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{getTargetVal(31)} Calls/mo</div>
            <span className="text-[10px] text-amber-500/80 font-mono">PROJECTED GAIN: +{getTargetVal(31) - 31} CALLS</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Required Operational Input Recipe</span>
            <div className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              {selectedGain === "5%" && "Acquire +2 new reviews referencing 'chimney repair'; publish 1 geotagged GBP post."}
              {selectedGain === "10%" && "Acquire +5 reviews; push 1 target keyword into Top 3 Map Pack in underperforming ZIP."}
              {selectedGain === "15%" && "Acquire +8 reviews; publish 3 localized posts; optimize primary GMB subcategories."}
              {selectedGain === "25%" && "Acquire +15 reviews; execute geofenced Google Ads; secure Top 2 Map Pack across all ZIPs."}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Core Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">INTERACTIONS</span>
            <div className="bg-rose-950/80 border border-rose-800/80 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold text-right">
              <div>▼ -4.6%</div>
              <div className="text-[8px] text-rose-500 uppercase">DECAY NOTICE</div>
            </div>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-2">31</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Vs MTD vs. Last MTD</div>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CALLS</span>
            <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold text-right">
              <div>▲ +8.2%</div>
              <div className="text-[8px] text-emerald-500 uppercase">GROWTH TREND</div>
            </div>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-2">8</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Vs MTD vs. Last MTD</div>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DIRECTIONS</span>
            <div className="bg-rose-950/80 border border-rose-800/80 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold text-right">
              <div>▼ -2.5%</div>
              <div className="text-[8px] text-rose-500 uppercase">DECAY NOTICE</div>
            </div>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-2">7</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Vs MTD vs. Last MTD</div>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WEBSITE CLICKS</span>
            <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold text-right">
              <div>▲ +6.1%</div>
              <div className="text-[8px] text-emerald-500 uppercase">GROWTH TREND</div>
            </div>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-2">16</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Vs MTD vs. Last MTD</div>
        </div>
      </section>

      {/* 4. Service Territory ZIP Map Pack Ranks */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-black text-amber-500">
              GBP Profile Service Territory ZIPs — <span className="text-amber-400">{selectedClient}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Map Pack rank position across GMB profile service area ZIP codes</p>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-1 rounded">
            ACTIVE ZIP FILTER: ALL GBP ZIPS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { zip: "ZIP 53202", rank: "#3", color: "text-emerald-400 border-emerald-900/40" },
            { zip: "ZIP 53211", rank: "#2", color: "text-emerald-400 border-emerald-900/40" },
            { zip: "ZIP 53217", rank: "#3", color: "text-emerald-400 border-emerald-900/40" },
            { zip: "ZIP 53092", rank: "#2", color: "text-emerald-400 border-emerald-900/40" },
            { zip: "ZIP 53097", rank: "#2", color: "text-emerald-400 border-emerald-900/40" },
          ].map((item, idx) => (
            <div key={idx} className={`bg-[#070a12] border ${item.color} p-4 rounded-xl text-center`}>
              <div className="text-xs text-slate-400 font-mono">{item.zip}</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{item.rank}</div>
              <div className="text-[9px] text-slate-500 font-bold mt-1 uppercase">MAP PACK RANK</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Top High-Volume Keywords & Row-Level Competitors Table */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-black text-amber-500">
              Top High-Volume Keywords & Row-Level Competitors — <span className="text-amber-400">{selectedClient}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Rankings sorted by monthly search volume</p>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-1 rounded">
            SOURCE: {selectedPlatform.toUpperCase()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] bg-[#070a12]">
                <th className="p-3">KEYWORD PHRASE</th>
                <th className="p-3">MONTHLY VOL</th>
                <th className="p-3">ORGANIC RANK</th>
                <th className="p-3">MAP PACK</th>
                <th className="p-3">ROW-LEVEL COMPETITORS (#1, #2, #3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="p-3 font-bold text-white">Chimney Sweep & Repair</td>
                <td className="p-3 font-mono">1,900/mo</td>
                <td className="p-3 font-black text-emerald-400">#2</td>
                <td className="p-3 font-black text-amber-400">#1</td>
                <td className="p-3 space-x-2">
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px]">1. Milwaukee Chimney Pros</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px]">2. Clean Sweep MKE</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px]">3. Lakefront Chimney Service</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Fireplace Inspection Near Me</td>
                <td className="p-3 font-mono">1,200/mo</td>
                <td className="p-3 font-black text-emerald-400">#4</td>
                <td className="p-3 font-black text-amber-400">#3</td>
                <td className="p-3 space-x-2">
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px]">1. Wisconsin Hearth Specialists</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px]">2. Milwaukee Chimney Pros</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px]">3. Brew City Sweeps</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}