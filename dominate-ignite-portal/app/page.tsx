"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import ScenarioModal from "@/components/ScenarioModal";

interface Client {
  id: string;
  name: string;
}

interface KeywordData {
  keyword: string;
  rank: number | null;
  domain: string;
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedClientName, setSelectedClientName] = useState<string>("Loading...");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Google My Business (GMB)");
  const [selectedGain, setSelectedGain] = useState<"5%" | "10%" | "15%" | "25%">("10%");

  const [metrics, setMetrics] = useState({
    interactions: 0,
    calls: 0,
    directions: 0,
    clicks: 0,
  });
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Fetch active client directory from Supabase
  useEffect(() => {
    async function loadClients() {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (!error && data && data.length > 0) {
        setClients(data);
        setSelectedClientId(data[0].id);
        setSelectedClientName(data[0].name);
      } else {
        setSelectedClientName("No Active Clients Found");
      }
    }
    loadClients();
  }, []);

  // 2. Fetch client-specific performance metrics and keyword ranks
  useEffect(() => {
    if (!selectedClientId) return;

    async function loadClientData() {
      setLoading(true);

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
          clicks: gmb.searches || 0,
        });
      } else {
        setMetrics({ interactions: 0, calls: 0, directions: 0, clicks: 0 });
      }

      const { data: ranks } = await supabase
        .from("keyword_rankings")
        .select("keyword, rank, domain")
        .eq("client_id", selectedClientId);

      setKeywords(ranks || []);
      setLoading(false);
    }

    loadClientData();
  }, [selectedClientId]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedClientId(id);
    const found = clients.find((c) => c.id === id);
    if (found) setSelectedClientName(found.name);
  };

  const getTargetVal = (base: number) => {
    const multipliers = { "5%": 1.05, "10%": 1.10, "15%": 1.15, "25%": 1.25 };
    return Math.round(base * multipliers[selectedGain]);
  };

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-6 md:p-10 font-sans">
      {/* Top Header & Client Switcher Bar */}
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
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">CLIENT:</span>
                <select 
                  value={selectedClientId} 
                  onChange={handleClientChange}
                  className="bg-slate-900 text-white font-bold text-xs px-2 py-1 rounded outline-none cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                  <option value="Google My Business (GMB)">Google My Business (GMB)</option>
                  <option value="Google Ads (Paid Search)">Google Ads (Paid Search)</option>
                  <option value="Meta Ads (CAPI / Paid Social)">Meta Ads (CAPI / Paid Social)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full xl:w-auto">
          <ScenarioModal />
        </div>
      </header>

      {/* Target Outcome Scenario Simulator */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <h2 className="text-sm font-black text-slate-100">
            🎯 Target Outcome Scenario Simulator — <span className="text-amber-400">{selectedClientName}</span>
          </h2>
          <div className="flex space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(["5%", "10%", "15%", "25%"] as const).map((gain) => (
              <button
                key={gain}
                onClick={() => setSelectedGain(gain)}
                className={`px-3.5 py-1 text-xs font-bold rounded-lg transition ${
                  selectedGain === gain ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                +{gain}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#070a12] p-4 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Current Baseline</span>
            <div className="text-2xl font-black text-slate-200 mt-1">{loading ? "..." : `${metrics.calls} Calls/mo`}</div>
            <span className="text-[9px] text-slate-500 uppercase">Verified Native GBP API</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase">Modeled Target (+{selectedGain})</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{getTargetVal(metrics.calls)} Calls/mo</div>
            <span className="text-[9px] text-amber-500/80 uppercase">Projected Gain: +{getTargetVal(metrics.calls) - metrics.calls} Calls</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Required Operational Input Recipe</span>
            <div className="text-xs text-slate-300 mt-1.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              Acquire +5 reviews; push 1 target keyword into Top 3 Map Pack in underperforming ZIP.
            </div>
          </div>
        </div>
      </section>

      {/* Core Performance Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">INTERACTIONS</span>
            <span className="text-[10px] bg-rose-950/80 text-rose-400 font-bold px-2 py-0.5 rounded border border-rose-800">▼ -4.6% DECAY</span>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-3">{loading ? "..." : metrics.interactions}</div>
          <span className="text-[10px] text-slate-500 mt-2 block">Vs MTD vs. Last MTD</span>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CALLS</span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">▲ +8.2% TREND</span>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-3">{loading ? "..." : metrics.calls}</div>
          <span className="text-[10px] text-slate-500 mt-2 block">Vs MTD vs. Last MTD</span>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">DIRECTIONS</span>
            <span className="text-[10px] bg-rose-950/80 text-rose-400 font-bold px-2 py-0.5 rounded border border-rose-800">▼ -2.5% DECAY</span>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-3">{loading ? "..." : metrics.directions}</div>
          <span className="text-[10px] text-slate-500 mt-2 block">Vs MTD vs. Last MTD</span>
        </div>

        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">WEBSITE CLICKS</span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">▲ +6.1% TREND</span>
          </div>
          <div className="text-4xl font-black text-amber-500 mt-3">{loading ? "..." : metrics.clicks}</div>
          <span className="text-[10px] text-slate-500 mt-2 block">Vs MTD vs. Last MTD</span>
        </div>
      </section>

      {/* Verified Keyword Rankings Table */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-amber-500">
            Top High-Volume Keywords & Row-Level Competitors — <span className="text-amber-400">{selectedClientName}</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">SOURCE: GOOGLE MY BUSINESS (GMB)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] bg-[#070a12]">
                <th className="p-3">KEYWORD</th>
                <th className="p-3">DOMAIN</th>
                <th className="p-3">ORGANIC GOOGLE RANK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {keywords.length > 0 ? (
                keywords.map((k, i) => (
                  <tr key={i}>
                    <td className="p-3 font-bold text-white">{k.keyword}</td>
                    <td className="p-3 font-mono text-slate-400">{k.domain}</td>
                    <td className="p-3 font-black text-emerald-400">
                      {k.rank ? `#${k.rank}` : "Not Ranked"}
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