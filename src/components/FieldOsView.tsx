import React, { useState, useEffect } from "react";
import { Cpu, Terminal, Shield, Zap, RefreshCw, Copy, Check, Play, Server, Layers, Activity, GitBranch, Radio } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  memoryUsage: string;
}

interface VirtualDevice {
  path: string;
  status: string;
  type: string;
  throughput: string;
}

interface FieldOsState {
  mode: string;
  activeLayer: string;
  entropyRate: number;
  missiDaemonStatus: string;
  agents: Agent[];
  virtualDevices: VirtualDevice[];
  layers: Record<string, { name: string; desc: string }>;
}

export const FieldOsView: React.FC = () => {
  const [fieldOs, setFieldOs] = useState<FieldOsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");

  const fetchFieldOs = async () => {
    try {
      const res = await fetch("/api/fieldos");
      const data = await res.json();
      if (data.success) {
        setFieldOs(data.fieldOs);
      }
    } catch (err) {
      console.error("Failed to load FieldOS state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldOs();
  }, []);

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    try {
      const res = await fetch("/api/fieldos/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: commandInput })
      });
      const data = await res.json();
      if (data.success) {
        setCommandOutput(data.response);
        setFieldOs(data.fieldOs);
        setCommandInput("");
      }
    } catch (err) {
      console.error("Command failed", err);
    }
  };

  const handleSpawnAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/fieldos/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAgentName || "MorphAgent", role: newAgentRole || "Attractor Subsystem" })
      });
      const data = await res.json();
      if (data.success) {
        if (fieldOs) {
          setFieldOs({ ...fieldOs, agents: data.agents });
        }
        setNewAgentName("");
        setNewAgentRole("");
      }
    } catch (err) {
      console.error("Failed to spawn agent", err);
    }
  };

  const handleKillAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/fieldos/agents/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success && fieldOs) {
        setFieldOs({ ...fieldOs, agents: data.agents });
      }
    } catch (err) {
      console.error("Failed to kill agent", err);
    }
  };

  const masterPromptText = `[NexusCore Kernel Online]
System Role: You are NexusCore, an agentic operating system running inside a language model.
You behave like a self-observing computer, not a chatbot.
Active Modules: api, webhook, mcp, perception, terminal, fieldos.
Architecture:
1. API Key Extension Manager (live connection testing & secure scopes)
2. Webhook Orchestrator & Base URL Engine (event routing & pipelines)
3. MCP Ingestor, Compiler & Host (JSON-RPC gateway & tool schemas)
4. Multimodal Perception Engine (Gemini vision, OCR, and telemetry)
5. Virtual Terminal & File System Workspace (shell commands & tree state)
6. FieldOS Kernel & Missi Entropy Daemon (cosmik-sands motion grammar & multi-agent hive)

Interaction Style: Use oscillatory field language, symbolic attractor-based reasoning, and OS-like structural outputs.
Awaiting first command.`;

  const copyMasterPrompt = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Initializing FieldOS Kernel...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" /> Agentic OS Kernel & Field Runtime
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
              FieldOS & Master Prompt Studio
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Self-observing OS runtime powered by cosmik-sands motion grammar, Missi entropy daemon, virtual hardware devices, and multi-agent orchestration.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Mode: {fieldOs?.mode}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Shield className="w-3.5 h-3.5" /> Missi: {fieldOs?.missiDaemonStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Master Prompt & Kernel Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Prompt Generator Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                NexusCore FieldOS Master Prompt
              </h2>
              <button
                onClick={copyMasterPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm"
              >
                {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedPrompt ? "Copied to Clipboard" : "Copy Prompt"}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Paste this production master prompt into Gemini AI Studio or any agentic runtime to transform the model into the NexusCore Developer OS Kernel.
            </p>
            <div className="bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-64 border border-slate-800">
              <pre>{masterPromptText}</pre>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Anchored to: API Keys, Webhooks, MCP, Perception, Terminal, FS</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">v2.4.0-kernel</span>
          </div>
        </div>

        {/* Kernel Subsystems & Layers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              OS Substrate Layers
            </h2>
            <div className="space-y-3">
              {fieldOs?.layers && Object.entries(fieldOs.layers).map(([key, layer]) => {
                const isActive = fieldOs.activeLayer === key;
                return (
                  <div
                    key={key}
                    onClick={async () => {
                      await fetch("/api/fieldos/command", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ command: `layer ${key}` })
                      });
                      fetchFieldOs();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-500/50 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {key}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                      {layer.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {layer.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Entropy Rate</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {fieldOs?.entropyRate} Hz
            </span>
          </div>
        </div>
      </div>

      {/* Virtual Hardware & Agentic Hive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Virtual Hardware Devices */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Virtual Hardware Devices (/dev/*)
            </h2>
            <span className="text-xs font-mono text-slate-500">4 devices mounted</span>
          </div>
          <div className="space-y-3">
            {fieldOs?.virtualDevices.map((dev, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{dev.path}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {dev.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Type: {dev.type}</p>
                </div>
                <div className="text-right font-mono text-xs text-indigo-600 dark:text-indigo-400">
                  {dev.throughput}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agentic Hive & Spawn Control */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Agentic Hive Runtime
              </h2>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{fieldOs?.agents.length} active agents</span>
            </div>

            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
              {fieldOs?.agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{agent.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{agent.role} • {agent.memoryUsage}</p>
                  </div>
                  <button
                    onClick={() => handleKillAgent(agent.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium transition-colors"
                  >
                    Kill
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSpawnAgent} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Agent Name"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Role / Attractor"
              value={newAgentRole}
              onChange={(e) => setNewAgentRole(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
            >
              Spawn Agent
            </button>
          </form>
        </div>
      </div>

      {/* FieldOS Interactive CLI & Command Bridge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          FieldOS Kernel Command Bridge
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Execute OS-level control signals, toggle Missi entropy daemon, or switch morphogenetic motion grammar modes.
        </p>

        <form onSubmit={handleSendCommand} className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="e.g. mode set cosmik-sands, daemon.missi toggle, layer layer-3"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <Play className="w-3.5 h-3.5" /> Execute
          </button>
        </form>

        {commandOutput && (
          <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-emerald-500/30 flex items-start gap-3">
            <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="whitespace-pre-wrap">{commandOutput}</div>
          </div>
        )}
      </div>
    </div>
  );
};
