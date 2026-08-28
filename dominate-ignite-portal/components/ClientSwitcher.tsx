'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Client {
  id: string;
  name: string;
}

interface GmbMetric {
  client_id: string;
  views: number;
  searches: number;
  actions: number;
  date: string;
}

interface KeywordRanking {
  keyword: string;
  rank: number | null;
  domain: string;
}

export default function ClientSwitcher() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [gmbData, setGmbData] = useState<GmbMetric | null>(null);
  const [rankings, setRankings] = useState<KeywordRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load client list on mount
  useEffect(() => {
    async function loadClients() {
      const { data, error } = await supabase.from('clients').select('id, name');
      if (!error && data && data.length > 0) {
        setClients(data);
        setSelectedClientId(data[0].id); // Default to first client
      }
    }
    loadClients();
  }, []);

  // Fetch GMB metrics and rankings whenever selectedClientId changes
  useEffect(() => {
    if (!selectedClientId) return;

    async function fetchClientData() {
      setLoading(true);

      // Fetch GMB Data for selected client
      const { data: gmbRes } = await supabase
        .from('gmb_metrics')
        .select('*')
        .eq('client_id', selectedClientId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch Latest SerpAPI Keyword Rankings for selected client
      const { data: rankRes } = await supabase
        .from('keyword_rankings')
        .select('keyword, rank, domain')
        .eq('client_id', selectedClientId);

      setGmbData(gmbRes || null);
      setRankings(rankRes || []);
      setLoading(false);
    }

    fetchClientData();
  }, [selectedClientId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Client
      </label>
      <select
        value={selectedClientId}
        onChange={(e) => setSelectedClientId(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
      >
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading client metrics...</p>
      ) : (
        <div className="space-y-4">
          {/* GMB Metrics Section */}
          <div className="p-3 bg-gray-50 rounded border">
            <h3 className="font-bold text-gray-800 mb-2">Google My Business Performance</h3>
            {gmbData ? (
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-white p-2 rounded shadow-sm">
                  <span className="block text-gray-500">Views</span>
                  <span className="font-semibold">{gmbData.views}</span>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <span className="block text-gray-500">Searches</span>
                  <span className="font-semibold">{gmbData.searches}</span>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <span className="block text-gray-500">Actions</span>
                  <span className="font-semibold">{gmbData.actions}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No GMB metrics recorded for this client.</p>
            )}
          </div>

          {/* Keyword Rankings Section */}
          <div className="p-3 bg-gray-50 rounded border">
            <h3 className="font-bold text-gray-800 mb-2">SerpAPI Keyword Rankings</h3>
            {rankings.length > 0 ? (
              <ul className="divide-y divide-gray-200 text-sm">
                {rankings.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span className="text-gray-700">{item.keyword}</span>
                    <span className="font-semibold text-blue-600">
                      {item.rank ? `#${item.rank}` : 'Not Ranked'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">No keyword ranking data found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}