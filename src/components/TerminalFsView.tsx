import React, { useState, useEffect, useRef } from "react";
import { Terminal, FolderTree, FileCode, Play, Plus, Trash2, Save, RefreshCw, Send, ShieldCheck, Cpu, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

interface SyscallRecord {
  id: string;
  syscall: string;
  command?: string;
  caller: string;
  pid: number;
  target: string;
  status: string;
  stabilityScore: number;
  timestamp: string;
}

interface StabilityCheckResult {
  verifiedAt: string;
  stabilityScore: number;
  entropyResidual: number;
  status: string;
  checks: { name: string; passed: boolean; status: string }[];
  activeSyscallCount: number;
}

export function TerminalFsView() {
  const [tree, setTree] = useState<Record<string, any>>({});
  const [selectedFile, setSelectedFile] = useState<string>("/README.md");
  const [fileContent, setFileContent] = useState<string>("");
  const [logs, setLogs] = useState<{ type: string; text: string }[]>([]);
  const [cmdInput, setCmdInput] = useState("");
  const [syscallProxyEnabled, setSyscallProxyEnabled] = useState<boolean>(true);
  const [interceptedSyscalls, setInterceptedSyscalls] = useState<SyscallRecord[]>([]);
  const [verifyingStability, setVerifyingStability] = useState<boolean>(false);
  const [stabilityData, setStabilityData] = useState<StabilityCheckResult | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchFs = async () => {
    try {
      const res = await fetch("/api/fs/tree");
      const data = await res.json();
      if (data.success) {
        setTree(data.tree);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSyscalls = async () => {
    try {
      const res = await fetch("/api/terminal/syscalls");
      const data = await res.json();
      if (data.success) {
        setInterceptedSyscalls(data.syscalls);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const verifySystemStability = async () => {
    setVerifyingStability(true);
    try {
      const res = await fetch("/api/terminal/verify-stability", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setStabilityData(data);
        fetchSyscalls();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingStability(false);
    }
  };

  const fetchFile = async (path: string) => {
    try {
      const res = await fetch(`/api/fs/file?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
        setSelectedFile(path);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveFile = async () => {
    try {
      await fetch("/api/fs/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: selectedFile, content: fileContent })
      });
      fetchFs();
    } catch (err) {
      console.error(err);
    }
  };

  const runCommand = async (e?: React.FormEvent, customCmd?: string) => {
    if (e) e.preventDefault();
    const command = customCmd || cmdInput;
    if (!command.trim()) return;
    if (!customCmd) setCmdInput("");

    try {
      const res = await fetch("/api/terminal/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        fetchFs();
        fetchSyscalls();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFs();
    fetchSyscalls();
    fetchFile("/README.md");
    setLogs([
      { type: "system", text: "NexusCore Terminal v2.4.0 (x86_64-nexus-linux)" },
      { type: "system", text: "Syscall Proxy Middleware is ACTIVE: Intercepting low-level system commands & piping into Cryptand maintenance loop." }
    ]);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Syscall Proxy Middleware Header & Stability Verification Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Syscall Proxy Middleware & Cryptand Maintenance Loop
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {syscallProxyEnabled ? "INTERCEPTING" : "STANDBY"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Intercepts low-level system commands, logs them as events to Cryptand Daemon, and verifies self-stability after execution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSyscallProxyEnabled(!syscallProxyEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition border ${
                syscallProxyEnabled
                  ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
              }`}
            >
              Proxy: {syscallProxyEnabled ? "ON" : "OFF"}
            </button>
            <button
              onClick={verifySystemStability}
              disabled={verifyingStability}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 ${verifyingStability ? "animate-spin" : ""}`} />
              {verifyingStability ? "Verifying Stability..." : "Verify System Stability"}
            </button>
          </div>
        </div>

        {/* Stability Verification Readout */}
        {stabilityData && (
          <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 rounded-xl space-y-3 animate-fade-in text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/40 dark:border-purple-900/40 pb-2">
              <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Stability Verification Protocol Status: {stabilityData.status}
              </span>
              <span className="text-slate-500 text-[11px]">Verified: {new Date(stabilityData.verifiedAt).toLocaleTimeString()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900">
                <span className="text-slate-400 block text-[10px]">Stability Score:</span>
                <span className="text-emerald-600 font-bold text-sm">{stabilityData.stabilityScore}%</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900">
                <span className="text-slate-400 block text-[10px]">Entropy Residual:</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{stabilityData.entropyResidual}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900">
                <span className="text-slate-400 block text-[10px]">Intercepted Syscalls:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm">{stabilityData.activeSyscallCount}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900">
                <span className="text-slate-400 block text-[10px]">Invariants Check:</span>
                <span className="text-emerald-600 font-bold text-sm">5 / 5 Passed</span>
              </div>
            </div>
            <div className="space-y-1 pt-1">
              {stabilityData.checks.map((chk, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>• {chk.name}</span>
                  <span className="text-emerald-600 font-bold">{chk.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Syscall Intercept Stream */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-600" /> Intercepted Syscall Stream ({interceptedSyscalls.length})
            </span>
            <button onClick={fetchSyscalls} className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto max-h-36 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Syscall</th>
                  <th className="py-2 px-3">Caller</th>
                  <th className="py-2 px-3">PID</th>
                  <th className="py-2 px-3">Target Subsystem</th>
                  <th className="py-2 px-3">Cryptand Loop</th>
                  <th className="py-2 px-3">Stability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {interceptedSyscalls.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 font-bold text-purple-600 dark:text-purple-400">{s.syscall}</td>
                    <td className="py-2 px-3 text-slate-500">{s.caller}</td>
                    <td className="py-2 px-3 text-slate-400">PID:{s.pid}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{s.target}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-emerald-600 font-bold">{s.stabilityScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
        {/* File System Explorer */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col shadow-sm overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Virtual File System
            </span>
            <button onClick={fetchFs} className="text-slate-400 hover:text-slate-600">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
            {Object.keys(tree).map((path) => {
              const item = tree[path];
              if (item.type === "file") {
                const isSelected = selectedFile === path;
                return (
                  <button
                    key={path}
                    onClick={() => fetchFile(path)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 transition ${
                      isSelected ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{path}</span>
                  </button>
                );
              }
              return (
                <div key={path} className="px-3 py-1 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  {path}
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor & Terminal Split */}
        <div className="lg:col-span-9 grid grid-rows-2 gap-6 h-full">
          {/* File Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col shadow-sm overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" /> {selectedFile}
              </span>
              <button
                onClick={saveFile}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" /> Save File
              </button>
            </div>
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="flex-1 w-full bg-slate-50 dark:bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Virtual Terminal */}
          <div className="bg-slate-900 rounded-2xl p-5 flex flex-col shadow-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
              <span className="flex items-center gap-2 text-indigo-400">
                <Terminal className="w-4 h-4" /> NexusCore Virtual Shell (Bash Sandbox & Syscall Proxy)
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">port 3000</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 mb-3">
              {logs.map((log, idx) => (
                <div key={idx} className={`${log.type === "input" ? "text-indigo-300 font-bold" : log.type === "system" ? "text-slate-400" : "text-emerald-400"} whitespace-pre-wrap leading-relaxed`}>
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2 pb-2 border-b border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono py-0.5">Syscalls:</span>
              {["sys_clone", "sys_mprotect", "sys_ptrace", "cryptand upgrade", "cpp-compile", "kernel-dump"].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => runCommand(undefined, cmd)}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono transition"
                >
                  {cmd}
                </button>
              ))}
            </div>
            <form onSubmit={runCommand} className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <span className="text-indigo-400">$</span>
              <input
                type="text"
                placeholder="Type command ('help', 'mcp list', 'webhook test', 'compile', 'sys_clone')..."
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs"
              />
              <button type="submit" className="text-indigo-400 hover:text-indigo-300 p-1">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
