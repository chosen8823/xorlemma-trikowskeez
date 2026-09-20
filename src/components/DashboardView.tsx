import React from "react";
import { Server, Key, Webhook, Cpu, ShieldCheck, Activity, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  keysCount: number;
  webhooksCount: number;
  mcpCount: number;
}

export function DashboardView({ setActiveTab, keysCount, webhooksCount, mcpCount }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> NexusCore v2.4 Enterprise Orchestrator
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            API Extension, Webhook Orchestration & MCP Host Suite
          </h1>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Manage secure API extensions, configure base URL webhook orchestration, ingest & compile Model Context Protocol (MCP) servers, leverage multimodal machine perception, and execute in the virtual terminal workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab("webhooks")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
            >
              <Webhook className="w-4 h-4" /> Configure Webhooks <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("mcp")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 transition border border-slate-700"
            >
              <Cpu className="w-4 h-4" /> MCP Ingestor & Host
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          onClick={() => setActiveTab("keys")}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">API Key Extensions</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{keysCount}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Secure / Active</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab("webhooks")}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Active Webhooks</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <Webhook className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{webhooksCount}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Base URL Routed</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab("mcp")}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">MCP Host Servers</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">{mcpCount}</span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Compiled</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab("terminal")}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Terminal & FS</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition">
              <Terminal className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900">Online</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Sandbox Ready</span>
          </div>
        </div>
      </div>

      {/* Architecture & Orchestration Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" /> Orchestration Pipeline & Base URL Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Step 1: Extension</div>
            <h3 className="font-semibold text-slate-800">API Key Manager</h3>
            <p className="text-xs text-slate-500 mt-1">Secure credential injection and scoping for external services.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Step 2: Ingress</div>
            <h3 className="font-semibold text-slate-800">Webhook Router</h3>
            <p className="text-xs text-slate-500 mt-1">Base URL orchestration receiver with signature verification.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Step 3: Compilation</div>
            <h3 className="font-semibold text-slate-800">MCP Host & Ingestor</h3>
            <p className="text-xs text-slate-500 mt-1">Model Context Protocol tools compiler and JSON-RPC gateway.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Step 4: Perception</div>
            <h3 className="font-semibold text-slate-800">Multimodal AI & FS</h3>
            <p className="text-xs text-slate-500 mt-1">Gemini multimodal perception analysis and virtual sandbox terminal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
