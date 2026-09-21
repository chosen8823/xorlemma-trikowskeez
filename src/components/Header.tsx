import React from "react";
import { Server, Key, Webhook, Cpu, Eye, Terminal, Activity, ShieldCheck, Sparkles, HardDrive, Network } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "oshub", label: "Command Center & OS", icon: Network },
    { id: "fieldos", label: "FieldOS & Kernel", icon: ShieldCheck },
    { id: "cryptand", label: "Cryptand & YAML", icon: Sparkles },
    { id: "drive", label: "Google Drive", icon: HardDrive },
    { id: "keys", label: "API Key Extensions", icon: Key },
    { id: "webhooks", label: "Webhook & Base URL", icon: Webhook },
    { id: "mcp", label: "MCP Ingestor & Host", icon: Cpu },
    { id: "perception", label: "Multimodal Perception", icon: Eye },
    { id: "terminal", label: "Terminal & FS", icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 font-bold text-lg">
              N
            </div>
            <div>
              <h1 className="font-bold text-slate-900 tracking-tight text-base flex items-center gap-2">
                NexusCore <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">Orchestrator</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">API Extension, Webhook & MCP Host Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Base URL Active
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
