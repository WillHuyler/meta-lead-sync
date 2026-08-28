"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import ScenarioModal from "../../components/ScenarioModal";

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
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Google My Business (GMB)");
  const [selectedGain, setSelectedGain] = useState<"5%" | "10%" | "15%" | "25%">("10%");

  const [metrics, setMetrics] = useState({
    interactions: 0,
    calls: 0,
    directions: 0,
    clicks: 0
  });
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Fetch real clients directly from Supabase
  useEffect(() => {
    async function loadClients() {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (!error && data && data.length > 0) {
        setClients(data);
        setSelectedClientId(data[0].id);
        setSelectedClientName(data[0].name);
      }
    }
    loadClients();
  }, []);

  // 2. Load metrics and rankings dynamically per selected client
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
          clicks: gmb.searches || 0
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

      {/* Dynamic Target Simulator */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <h2 className="text-sm font-black text-slate-100">
            🎯 Target Outcome Simulator — <span className="text-amber-400">{selectedClientName}</span>
          </h2>
          <div className="flex space-x-2 bg-slate-900 p-1 rounded-xl">
            {(["5%", "10%", "15%", "25%"] as const).map((gain) => (
              <button
                key={gain}
                onClick={() => setSelectedGain(gain)}
                className={`px-3 py-1 text-xs font-bold rounded ${selectedGain === gain ? "bg-amber-500 text-black" : "text-slate-400"}`}
              >
                +{gain}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#070a12] p-4 rounded-xl">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Live Monthly Baseline Calls</span>
            <div className="text-2xl font-black text-slate-200 mt-1">{loading ? "..." : `${metrics.calls} Calls/mo`}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase">Target (+{selectedGain})</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{getTargetVal(metrics.calls)} Calls/mo</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Required Action</span>
            <div className="text-xs text-slate-300 mt-1 bg-slate-900 p-2 rounded">
              +{getTargetVal(metrics.calls) - metrics.calls} additional call conversions required.
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Core Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">INTERACTIONS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.interactions}</div>
        </div>
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">CALLS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.calls}</div>
        </div>
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">DIRECTIONS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.directions}</div>
        </div>
        <div className="bg-[#0f1422] border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase">SEARCH CLICKS</span>
          <div className="text-4xl font-black text-amber-500 mt-2">{loading ? "..." : metrics.clicks}</div>
        </div>
      </section>

      {/* Dynamic SerpAPI Keyword Rankings */}
      <section className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-black text-amber-500 mb-4">
          Live Keywords — <span className="text-amber-400">{selectedClientName}</span>
        </h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="p-3">KEYWORD</th>
              <th className="p-3">DOMAIN</th>
              <th className="p-3">RANK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {keywords.length > 0 ? (
              keywords.map((k, i) => (
                <tr key={i}>
                  <td className="p-3 font-bold">{k.keyword}</td>
                  <td className="p-3 text-slate-400">{k.domain}</td>
                  <td className="p-3 font-black text-emerald-400">{k.rank ? `#${k.rank}` : "Not Ranked"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-slate-500">No keyword records found for this client ID in Supabase.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}