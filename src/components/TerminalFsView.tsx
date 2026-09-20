import React, { useState, useEffect, useRef } from "react";
import { Terminal, FolderTree, FileCode, Play, Plus, Trash2, Save, RefreshCw, Send } from "lucide-react";

export function TerminalFsView() {
  const [tree, setTree] = useState<Record<string, any>>({});
  const [selectedFile, setSelectedFile] = useState<string>("/README.md");
  const [fileContent, setFileContent] = useState<string>("");
  const [logs, setLogs] = useState<{ type: string; text: string }[]>([]);
  const [cmdInput, setCmdInput] = useState("");
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

  const runCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cmdInput.trim()) return;
    const command = cmdInput;
    setCmdInput("");

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFs();
    fetchFile("/README.md");
    // Initial terminal logs
    setLogs([
      { type: "system", text: "NexusCore Terminal v2.4.0 (x86_64-nexus-linux)" },
      { type: "system", text: "Type 'help' for available commands, 'mcp list', 'webhook test', or 'compile'." }
    ]);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
      {/* File System Explorer */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col shadow-sm overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-indigo-600" /> Virtual File System
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
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 transition ${isSelected ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col shadow-sm overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-2">
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
            className="flex-1 w-full bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-800 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Virtual Terminal */}
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col shadow-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
            <span className="flex items-center gap-2 text-indigo-400">
              <Terminal className="w-4 h-4" /> NexusCore Virtual Shell (Bash Sandbox)
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
                onClick={async () => {
                  setCmdInput(cmd);
                  try {
                    const res = await fetch("/api/terminal/exec", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ command: cmd })
                    });
                    const data = await res.json();
                    if (data.success) {
                      setLogs(data.logs);
                      fetchFs();
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
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
              placeholder="Type command ('help', 'mcp list', 'webhook test', 'compile')..."
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
  );
}
