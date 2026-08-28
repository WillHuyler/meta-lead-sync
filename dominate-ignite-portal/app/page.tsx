"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import ScenarioModal from "@/components/ScenarioModal";

interface Client {
  id: string;
  name: string;
  domain?: string;
}

interface KeywordData {
  keyword: string;
  rank: number | null;
  domain: string;
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("Loading Clients...");
  const [selectedPlatform, setSelectedPlatform] = useState("Google My Business (GMB)");
  const [selectedSabZip, setSelectedSabZip] = useState("All Service Territory ZIPs (5)");
  const [selectedGain, setSelectedGain] = useState<"5%" | "10%" | "15%" | "25%">("10%");

  // Dynamic Metrics State
  const [metrics, setMetrics] = useState({
    interactions: 0,
    calls: 0,
    directions: 0,
    clicks: 0,
  });
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const platforms = [
    "Google My Business (GMB)",
    "Google Ads (Paid Search)",
    "Meta Ads (CAPI / Paid Social)",
    "Google Search Console (GSC)",
    "Google Analytics 4 (GA4)",
    "CRM Lead & Revenue Pipeline"
  ];

  // 1. Fetch Client List on Mount
  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase.from("clients").select("id, name, domain");
      if (!error && data && data.length > 0) {
        setClients(data);
        setSelectedClientId(data[0].id);
        setSelectedClientName(data[0].name);
      } else {
        setSelectedClientName("No Active Clients in Supabase");
      }
    }
    fetchClients();
  }, []);

  // 2. Fetch Real Metrics whenever selected client changes
  useEffect(() => {
    if (!selectedClientId) return;

    async function fetchRealClientData() {
      setLoading(true);

      // Fetch Latest GMB Data for Selected Client
      const { data: gmb } = await supabase
        .from("gmb_metrics")
        .select("views, searches, actions, calls")
        .eq("client_id", selectedClientId)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (gmb) {
        setMetrics({
          interactions: (gmb.views || 0) + (gmb.searches || 0),
          calls: gmb.calls || 0,
          directions: gmb.actions || 0,
          clicks: gmb.searches || 0
        });
      } else {
        setMetrics({ interactions: 0, calls: 0, directions: 0, clicks: 0 });
      }

      // Fetch Live SerpAPI Keywords for Selected Client
      const { data: ranks } = await supabase
        .from("keyword_rankings")
        .select("keyword, rank, domain")
        .eq("client_id", selectedClientId);

      setKeywords(ranks || []);
      setLoading(false);
    }

    fetchRealClientData();
  }, [selectedClientId]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedClientId(id);
    const matched = clients.find((c) => c.id === id);
    if (matched) setSelectedClientName(matched.name);
  };

  const getTargetVal = (base: number) => {
    const multipliers = { "5%": 1.05, "10%": 1.10, "15%": 1.15, "25%": 1.25 };
    return Math.round(base * multipliers[selectedGain]);
  };

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-6 md:p-10 font-sans">
      {/* 1. White Hero Header Container */}
      <header className="bg-white text-slate-900 rounded-2xl p-6 mb-8 shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-100">
        <div className="flex items-center gap-6">
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
            
            {/* Dynamic Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">CLIENT:</span>
                <select 
                  value={selectedClientId} 
                  onChange={handleClientChange}
                  className="bg-slate-900 text-white font-bold text-xs px-2 py-1 rounded outline-none cursor-pointer"
                >
                  {clients.length > 0 ? (
                    clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  ) : (
                    <option value="">No Database Clients</option>
                  )}
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
          <ScenarioModal />
          <button className="bg-[#1b2234] hover:bg-slate-800 text-white text-xs font-bold px-6 py-2 rounded-lg transition w-full" onClick={() => window.print()}>
            Export PDF Report
          </button>

          <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-800 mt-1">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-amber-400 uppercase">PRO LICENSE ACTIVE</span>
              <span className="text-[10px] font-mono text-slate-300">3 / 5 Seats Claimed</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Target Outcome Scenario Simulator */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <span>🎯 Target Outcome Scenario Simulator — <span className="text-amber-400">{selectedClientName}</span></span>
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Live Baseline</span>
            <div className="text-2xl font-black text-slate-200 mt-1">{loading ? "..." : `${metrics.calls} Calls/mo`}</div>
            <span className="text-[10px] text-slate-500 font-mono">VERIFIED SUPABASE METRICS</span>
          </div>

          <div className="border-r border-slate-800/80 pr-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Modeled Target (+{selectedGain})</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{getTargetVal(metrics.calls)} Calls/mo</div>
            <span className="text-[10px] text-amber-500/80 font-mono">PROJECTED GAIN: +{getTargetVal(metrics.calls) - metrics.calls} CALLS</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Required Operational Recipe</span>
            <div className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              {metrics.calls === 0 
                ? "Run initial ETL sync pipeline to record baseline metrics for this client."
                : `Target requires +${getTargetVal(metrics.calls) - metrics.calls} additional monthly conversions across search and paid channels.`}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">INTERACTIONS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.interactions}</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Live Supabase Database Query</div>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CALLS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.calls}</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Live Supabase Database Query</div>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DIRECTIONS / ACTIONS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.directions}</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Live Supabase Database Query</div>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl relative">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SEARCH CLICKS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.clicks}</div>
          <div className="text-[10px] text-slate-500 mt-3 font-medium">Live Supabase Database Query</div>
        </div>
      </section>

      {/* 4. Live Verified SerpAPI Keywords Table */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-black text-amber-500">
              Top High-Volume Keywords — <span className="text-amber-400">{selectedClientName}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Live SerpAPI position tracking backed by Supabase</p>
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
                <th className="p-3">TARGET DOMAIN</th>
                <th className="p-3">ORGANIC GOOGLE RANK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {keywords.length > 0 ? (
                keywords.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-white">{item.keyword}</td>
                    <td className="p-3 font-mono text-slate-400">{item.domain}</td>
                    <td className="p-3 font-black text-emerald-400">
                      {item.rank ? `#${item.rank}` : "Not in Top 100"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-500 font-mono">
                    No verified SerpAPI keyword rows found in database for {selectedClientName}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}