import React, { useState } from "react";
import { Cpu, Terminal, Shield, Globe, Search, Database, Radio, MessageSquare, BookOpen, Layers, Play, CheckCircle2, RefreshCw, Zap, Server, Network } from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  category: string;
  status: string;
  specialty: string;
  accuracy: number;
}

interface OSNode {
  id: string;
  name: string;
  version: string;
  circuitState: string;
  latencyMs: number;
  encryption: string;
}

const INITIAL_RESEARCH_AGENTS: AgentItem[] = [
  { id: "ag-1", name: "Quantum Lattice Analyzer", category: "Scientific Research", status: "Active", specialty: "Condensed Matter Physics & Tensor Networks", accuracy: 98.4 },
  { id: "ag-2", name: "Bio-Informatics Synthesizer", category: "Scientific Research", status: "Active", specialty: "CRISPR off-target mutation prediction", accuracy: 97.9 },
  { id: "ag-3", name: "AutoGen Swarm Coordinator", category: "Multi-Agent Orchestration", status: "Standby", specialty: "Recursive code generation & theorem proving", accuracy: 99.1 },
  { id: "ag-4", name: "HuggingFace Hub Fine-Tuner", category: "Model Optimization", status: "Active", specialty: "LoRA adapters & quantized inference pipelines", accuracy: 96.8 },
  { id: "ag-5", name: "SpiderFoot OSINT Recon", category: "Intelligence Gathering", status: "Active", specialty: "Digital footprint mapping & passive threat intel", accuracy: 95.2 },
  { id: "ag-6", name: "Historical Archive Scraper (2008-Now)", category: "Data Ingest", status: "Active", specialty: "Web-scale temporal corpus indexing", accuracy: 98.1 }
];

const OS_CIRCUIT_NODES: OSNode[] = [
  { id: "os-1", name: "Kronos Temporal OS", version: "v4.9-cron", circuitState: "Synchronized", latencyMs: 2.1, encryption: "AES-256-GCM" },
  { id: "os-2", name: "Kairos Async Kernel", version: "v2.1-event", circuitState: "Active Pipeline", latencyMs: 1.4, encryption: "ChaCha20-Poly1305" },
  { id: "os-3", name: "DreamOS Subconscious Substrate", version: "v9.0-oneiric", circuitState: "Resonating", latencyMs: 4.8, encryption: "Quantum Lattice" },
  { id: "os-4", name: "Sophia OS Epistemic Engine", version: "v3.4-wisdom", circuitState: "Synthesizing", latencyMs: 3.2, encryption: "RSA-4096" },
  { id: "os-5", name: "Logos Symbolic Synthesizer", version: "v5.0-lexicon", circuitState: "Active", latencyMs: 1.9, encryption: "AES-256-GCM" },
  { id: "os-6", name: "Mythos Archetypal Matrix", version: "v1.8-lore", circuitState: "Dormant", latencyMs: 6.5, encryption: "Homomorphic" },
  { id: "os-7", name: "Parallaxis Distributed Mesh", version: "v7.2-vector", circuitState: "Mesh Active", latencyMs: 0.8, encryption: "Zero-Knowledge" },
  { id: "os-8", name: "Ubuntu Hardened Edge", version: "v24.04 LTS", circuitState: "Stable", latencyMs: 2.5, encryption: "SELinux Enforced" },
  { id: "os-9", name: "Silk Road Darknet Node", version: "v3.1-tor-onion", circuitState: "Routed (Tor)", latencyMs: 142.0, encryption: "Onion Routing (3-Hop)" }
];

export const CommandCenterView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"desktop" | "notebook" | "agents" | "osint" | "circuit">("desktop");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[06:03:40] [DesktopCommander] Initialized virtual X11 display buffer (:0)",
    "[06:03:41] [WebRTC Mesh] P2P signaling relay active on port 3000",
    "[06:03:41] [OpenNotebookLM] Initialized semantic notebook embedding index",
    "[06:03:42] [OS Circuit] Synchronized Kronos, Kairos, DreamOS, and Tor onion routing nodes."
  ]);
  const [commandInput, setCommandInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "OpenNotebookLM", text: "Welcome to the OpenNotebookLM & Chat Hub. Ask any question across your 162 scientific research papers and scraped internet corpus.", time: "06:03" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [osintTarget, setOsintTarget] = useState<string>("target-alpha.onion / research-corpus");
  const [osintScanning, setOsintScanning] = useState<boolean>(false);
  const [osintResults, setOsintResults] = useState<string[]>([
    "[Recon] DNS enumeration complete (14 records found)",
    "[SpiderFoot] Passive threat intel feed synchronized (0 vulnerabilities)",
    "[Temporal Scrape] 2008-2026 archive index verified (4.2M vectors)"
  ]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const cmd = commandInput;
    setCommandInput("");
    setTerminalLogs(prev => [`[${new Date().toLocaleTimeString()}] $ ${cmd}`, `[Output] Executed '${cmd}' across active OS circuit matrix.`, ...prev]);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "You", text: userMsg, time: new Date().toLocaleTimeString().slice(0, 5) }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: "OpenNotebookLM / Research Agent", 
        text: `Analysis of "${userMsg}" synthesized across 162 scientific research agents and 2008-now internet corpus. High confidence resonance detected in tensor networks and multi-agent AutoGen swarms.`, 
        time: new Date().toLocaleTimeString().slice(0, 5) 
      }]);
    }, 800);
  };

  const runOsintScan = () => {
    setOsintScanning(true);
    setTimeout(() => {
      setOsintResults(prev => [
        `[OSINT Scan] Target '${osintTarget}' probed via SpiderFoot & temporal scraper.`,
        `[Result] 34 open endpoints mapped, cryptographic fingerprint verified.`,
        ...prev
      ]);
      setOsintScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Universal Command Center & OS Circuit
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Desktop Commander, Chat Hub, OSINT & Multi-OS Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            162 scientific research agents, OpenNotebookLM, WebRTC mesh, SpiderFoot OSINT, AutoGen, HuggingFace, and Linux/Tor OS circuits.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "desktop", label: "Desktop & WebRTC", icon: Terminal },
            { id: "notebook", label: "Chat Hub & NotebookLM", icon: MessageSquare },
            { id: "agents", label: "162 Research Agents", icon: Cpu },
            { id: "osint", label: "OSINT & SpiderFoot", icon: Search },
            { id: "circuit", label: "Multi-OS Circuit", icon: Network },
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab 1: Desktop Commander & WebRTC */}
      {activeSubTab === "desktop" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-sm lg:col-span-2 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Virtual Desktop Commander & X11 Buffer</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">WebRTC P2P Active</span>
            </div>

            <div className="bg-black/80 rounded-xl p-4 h-80 overflow-y-auto space-y-2 text-xs border border-slate-900">
              {terminalLogs.map((log, i) => (
                <div key={i} className="text-slate-300 font-mono">
                  <span className="text-emerald-400">root@nexus-desktop:~#</span> {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleRunCommand} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter desktop command (e.g., 'webrtc-stream --peer=alpha', 'spiderfoot --scan', 'os-sync')..."
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
              >
                Execute
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-600" /> WebRTC P2P Stream Hub
            </h3>
            <p className="text-xs text-slate-500">Live decentralized audio/video and desktop streaming channels across OS circuits.</p>
            
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">Peer Stream #1 (Kronos)</span>
                  <p className="text-[10px] text-emerald-600">Connected • 60 FPS • 1080p</p>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">Live</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">Peer Stream #2 (Tor Node)</span>
                </div>
                <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Chat Hub & OpenNotebookLM */}
      {activeSubTab === "notebook" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">OpenNotebookLM & Chat Hub</h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100">
              Corpus: 162 Research Agents & 2008-Now Web Scrape
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 h-96 overflow-y-auto space-y-4 border border-slate-200 dark:border-slate-800">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <div className={`p-4 rounded-2xl text-xs max-w-xl ${msg.sender === "You" ? "bg-indigo-600 text-white rounded-br-none" : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-xs"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-3">
            <input
              type="text"
              placeholder="Ask anything across scientific research agents and internet corpus..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
            >
              Synthesize
            </button>
          </form>
        </div>
      )}

      {/* Sub-Tab 3: 162 Scientific Research Agents */}
      {activeSubTab === "agents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">162 Scientific Research Agents (GitHub / AutoGen / HuggingFace)</h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              162/162 Swarm Units Deployed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_RESEARCH_AGENTS.map((agent) => (
              <div key={agent.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                    {agent.category}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold">{agent.accuracy}% Accuracy</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{agent.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{agent.specialty}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">Status: {agent.status}</span>
                  <button className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 transition">
                    Inspect Swarm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: OSINT & SpiderFoot */}
      {activeSubTab === "osint" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" /> SpiderFoot & 2008-Now Internet Scrape Engine
            </h2>
            <p className="text-xs text-slate-500">Autonomous OSINT reconnaissance and temporal web archive correlation.</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={osintTarget}
                onChange={(e) => setOsintTarget(e.target.value)}
                placeholder="Target domain, IP, or onion address..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
              <button
                onClick={runOsintScan}
                disabled={osintScanning}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-2"
              >
                {osintScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {osintScanning ? "Scanning..." : "Run OSINT Scan"}
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Recon Substrate Logs</span>
              <div className="bg-slate-950 text-indigo-200 font-mono text-xs p-4 rounded-xl h-64 overflow-y-auto space-y-2 border border-slate-800">
                {osintResults.map((r, i) => (
                  <div key={i} className="border-b border-indigo-900/30 pb-1.5">{r}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" /> Temporal Scrape (2008-Now)
            </h3>
            <p className="text-xs text-slate-500">18 years of continuous internet crawl corpus indexed for instant semantic retrieval.</p>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 space-y-2 text-xs font-mono text-indigo-900 dark:text-indigo-200">
              <div className="flex justify-between"><span>Total Records:</span> <span className="font-bold">4.2 Billion</span></div>
              <div className="flex justify-between"><span>Index Latency:</span> <span className="font-bold">12ms</span></div>
              <div className="flex justify-between"><span>Storage Tier:</span> <span className="font-bold">Distributed SSD / IPFS</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Multi-OS Circuit Matrix */}
      {activeSubTab === "circuit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Multi-OS Circuit Matrix (Kronos, Kairos, DreamOS, Sophia, Linux, Tor)</h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              9 Kernel Nodes Interconnected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OS_CIRCUIT_NODES.map((os) => (
              <div key={os.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
                    {os.version}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold">{os.circuitState}</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{os.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Encryption: {os.encryption} | Latency: {os.latencyMs}ms</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">Circuit Status: Online</span>
                  <button className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-100 transition">
                    Inspect Circuit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
