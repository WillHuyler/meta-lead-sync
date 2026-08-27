"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ClientRecord {
  id: string;
  name: string;
}

interface ClientSwitcherProps {
  onClientSelect?: (clientId: string) => void;
  onSelectClient?: (clientId: string) => void;
}

export default function ClientSwitcher({ onClientSelect, onSelectClient }: ClientSwitcherProps) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleTrigger = (id: string) => {
    setSelectedId(id);
    if (typeof onClientSelect === "function") {
      onClientSelect(id);
    }
    if (typeof onSelectClient === "function") {
      onSelectClient(id);
    }
  };

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (error) {
        console.error("Error loading clients:", error);
        return;
      }

      if (data && data.length > 0) {
        setClients(data);
        const firstId = data[0].id;
        handleTrigger(firstId);
      }
    }

    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleTrigger(e.target.value);
  };

  return (
    <select
      value={selectedId}
      onChange={handleChange}
      className="bg-slate-900 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
    >
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      ))}
    </select>
  );
}