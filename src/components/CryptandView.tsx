import React, { useState, useEffect } from "react";
import { Cpu, Layers, RefreshCw, Save, Check, Terminal, Play, Shield, Database, Activity, Sparkles, Maximize2, Minimize2, Download, Bell } from "lucide-react";
import { YamlManager } from "./YamlManager";
import { HiveAgentManager } from "./HiveAgentManager";

interface Tier {
  name: string;
  content: string;
}

interface CryptandState {
  status: string;
  tickCount: number;
  alignmentLock: string;
  evolutionLevel: number;
  tiers: Record<string, Tier>;
  lumetraEngram?: {
    storageBackend: string;
    agentEvolutionLogs: { id: string; agentName: string; event: string; timestamp: string; significance: string }[];
    entropyTraces: { traceId: string; source: string; variance: string; resonanceHz: string; status: string }[];
    symbolicThreads: { threadId: string; name: string; tension: string; status: string; description: string }[];
    agents?: { id: string; name: string; role: string; status: string; alignment: number; maintenanceStatus: string }[];
  };
  logs: { timestamp: string; text: string }[];
}

export const CryptandView: React.FC = () => {
  const [cryptand, setCryptand] = useState<CryptandState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>("tier-0");
  const [tierContent, setTierContent] = useState<string>("");
  const [savingTier, setSavingTier] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ticking, setTicking] = useState(false);
  const [threadToggles, setThreadToggles] = useState<Record<string, boolean>>({
    "th-401": true,
    "th-402": true
  });
  
  // Dynamic panel undock state ("Return to Source")
  const [undockedPanels, setUndockedPanels] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCryptand = async () => {
    try {
      const res = await fetch("/api/cryptand");
      const data = await res.json();
      if (data.success) {
        setCryptand(data.cryptand);
        if (data.cryptand.tiers[selectedTier]) {
          setTierContent(data.cryptand.tiers[selectedTier].content);
        }
      }
    } catch (err) {
      console.error("Failed to load cryptand state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptand();
  }, []);

  useEffect(() => {
    if (cryptand && cryptand.tiers[selectedTier]) {
      setTierContent(cryptand.tiers[selectedTier].content);
    }
  }, [selectedTier]);

  const handleRunTick = async () => {
    setTicking(true);
    try {
      const res = await fetch("/api/cryptand/tick", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCryptand(data.cryptand);
        showToast("Cryptand Daemon tick executed successfully.");
      }
    } catch (err) {
      console.error("Tick failed", err);
    } finally {
      setTicking(false);
    }
  };

  const handleExportEngram = () => {
    if (!cryptand) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cryptand, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lumetra_engram_snapshot_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Lumetra Engram snapshot exported successfully.");
  };

  const toggleUndock = (panelId: string) => {
    setUndockedPanels(prev => {
      const nextState = !prev[panelId];
      if (nextState) {
        showToast(`Panel '${panelId}' undocked into floating dynamic stage.`);
      } else {
        showToast(`Panel '${panelId}' returned to source grid.`);
      }
      return { ...prev, [panelId]: nextState };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-purple-950 dark:text-purple-100 px-4 py-3 rounded-xl shadow-xl border border-purple-500/30 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <Bell className="w-4 h-4 text-purple-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
              Evolution v{cryptand?.evolutionLevel || 1}.0
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {cryptand?.status || "Active"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Cryptand Daemon & Lumetra Engram
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Autonomous multi-agent orchestration, Tier 0-4 YAML structures, and live entropy resonance engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportEngram}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" /> Export Engram
          </button>
          <button
            onClick={handleRunTick}
            disabled={ticking}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {ticking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {ticking ? "Running Tick..." : `Run Tick (#${cryptand?.tickCount || 0})`}
          </button>
        </div>
      </div>

      {/* Main Grid: Engine Core & Lumetra Engram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engine Core Panel */}
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 ${undockedPanels["engine"] ? "fixed inset-8 z-40 shadow-2xl overflow-y-auto bg-white dark:bg-slate-900" : ""}`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Engine Telemetry & Alignment
            </h2>
            <button
              onClick={() => toggleUndock("engine")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={undockedPanels["engine"] ? "Return to Source Grid" : "Undock Dynamic Panel"}
            >
              {undockedPanels["engine"] ? <Minimize2 className="w-4 h-4 text-purple-600" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Tick Count</span>
                <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{cryptand?.tickCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Alignment Lock</span>
                <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 truncate">{cryptand?.alignmentLock}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-medium text-slate-500">Daemon Log Substrate</span>
              <div className="bg-slate-950 text-purple-200 font-mono text-[11px] p-4 rounded-xl h-56 overflow-y-auto space-y-2 border border-slate-800">
                {cryptand?.logs.map((log, idx) => (
                  <div key={idx} className="border-b border-purple-900/30 pb-1.5">
                    <span className="text-purple-400 text-[10px]">[{log.timestamp.slice(11, 19)}]</span> <span className="text-slate-300">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lumetra Engram / Entropy Traces */}
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-2 ${undockedPanels["engram"] ? "fixed inset-8 z-40 shadow-2xl overflow-y-auto bg-white dark:bg-slate-900" : ""}`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Lumetra Engram Memory & Symbolic Threads
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                Backend: {cryptand?.lumetraEngram?.storageBackend || "Firestore/Memory"}
              </span>
              <button
                onClick={() => toggleUndock("engram")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={undockedPanels["engram"] ? "Return to Source Grid" : "Undock Dynamic Panel"}
              >
                {undockedPanels["engram"] ? <Minimize2 className="w-4 h-4 text-purple-600" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entropy Traces */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Active Entropy Traces</h3>
              <div className="space-y-2">
                {cryptand?.lumetraEngram?.entropyTraces.map((trace) => (
                  <div key={trace.traceId} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{trace.source}</span>
                      <p className="text-[10px] text-slate-500">Variance: {trace.variance} | {trace.resonanceHz}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {trace.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Symbolic Threads */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Symbolic Threads & Tensions</h3>
              <div className="space-y-2">
                {cryptand?.lumetraEngram?.symbolicThreads.map((thread) => {
                  const isEnabled = threadToggles[thread.threadId] ?? true;
                  return (
                    <div key={thread.threadId} className={`p-3 bg-white dark:bg-slate-900 border rounded-xl shadow-xs transition-all ${isEnabled ? 'border-purple-500/50 bg-purple-50/10' : 'border-slate-300 dark:border-slate-800 opacity-60'}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">{thread.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold">
                            Tension: {thread.tension}
                          </span>
                          <button
                            onClick={() => setThreadToggles(prev => ({ ...prev, [thread.threadId]: !isEnabled }))}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${isEnabled ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                          >
                            {isEnabled ? 'Active' : 'Muted'}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{thread.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tiered YAML Manager & Config Substrate */}
      <YamlManager
        tiers={cryptand?.tiers || {}}
        onUpdateTier={async (tierId, content) => {
          const res = await fetch("/api/cryptand/tier", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tierId, content })
          });
          const data = await res.json();
          if (data.success) {
            setCryptand(data.cryptand);
            showToast(`Tier '${tierId}' updated and synced to Engram.`);
          }
        }}
      />

      {/* Active Hive Agent Management & Alignment Substrate */}
      <HiveAgentManager
        agents={cryptand?.lumetraEngram?.agents}
        onRealignment={async (agentId) => {
          const res = await fetch("/api/cryptand/realign-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId })
          });
          const data = await res.json();
          if (data.success) {
            setCryptand(data.cryptand);
            showToast("Agent re-alignment verified by Constitutional Council.");
          }
        }}
        onUpdateAgents={async (agents) => {
          const res = await fetch("/api/cryptand/update-agents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agents })
          });
          const data = await res.json();
          if (data.success) {
            setCryptand(data.cryptand);
            showToast("Hive Agent roster updated successfully.");
          }
        }}
      />
    </div>
  );
};
