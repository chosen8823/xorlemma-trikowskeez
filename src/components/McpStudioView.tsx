import React, { useState } from "react";
import { Cpu, Plus, Play, CheckCircle2, RefreshCw, Terminal, FileCode, Layers } from "lucide-react";
import { McpServerItem } from "../types";

interface McpProps {
  servers: McpServerItem[];
  onRefresh: () => void;
}

export function McpStudioView({ servers, onRefresh }: McpProps) {
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("stdio");
  const [rawSchema, setRawSchema] = useState(`{\n  \"tools\": [\n    {\n      \"name\": \"custom_query\",\n      \"description\": \"Run high speed query\",\n      \"parameters\": { \"sql\": \"string\" }\n    }\n  ]\n}`);
  
  const [compilingId, setCompilingId] = useState<string | null>(null);
  const [compileResult, setCompileResult] = useState<any>(null);

  const [activeTool, setActiveTool] = useState<string>("fs_read_file");
  const [toolArgs, setToolArgs] = useState<string>('{\n  "path": "/README.md"\n}');
  const [toolExecutionResult, setToolExecutionResult] = useState<any>(null);
  const [executingTool, setExecutingTool] = useState(false);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/mcp/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: serverName, type: serverType, rawSchema })
      });
      const data = await res.json();
      if (data.success) {
        setServerName("");
        setShowIngestModal(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompile = async (serverId: string) => {
    setCompilingId(serverId);
    setCompileResult(null);
    try {
      const res = await fetch("/api/mcp/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId })
      });
      const data = await res.json();
      if (data.success) {
        setCompileResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompilingId(null);
    }
  };

  const handleRunTool = async () => {
    setExecutingTool(true);
    setToolExecutionResult(null);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgs);
      } catch {
        parsedArgs = {};
      }

      const res = await fetch("/api/mcp/host/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName: activeTool, arguments: parsedArgs })
      });
      const data = await res.json();
      setToolExecutionResult(data.result);
    } catch (err: any) {
      setToolExecutionResult({ error: err.message });
    } finally {
      setExecutingTool(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">MCP Ingestor, Compiler & Host</h2>
          <p className="text-slate-500 text-sm mt-1">Ingest Model Context Protocol servers, validate schemas, compile bytecode manifests, and host tools.</p>
        </div>
        <button
          onClick={() => setShowIngestModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Ingest MCP Server
        </button>
      </div>

      {/* Servers Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servers.map((server) => (
          <div key={server.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{server.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">v{server.version} • {server.type.toUpperCase()}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {server.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="font-semibold text-slate-700">Registered Tools ({server.toolsCount}):</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {server.tools.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white text-purple-700 border border-purple-200 font-mono text-[11px]">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleCompile(server.id)}
                disabled={compilingId === server.id}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1.5"
              >
                {compilingId === server.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCode className="w-3.5 h-3.5" />}
                Compile MCP Manifest
              </button>
              <span className="text-xs text-slate-400 font-mono">{server.resourcesCount} resources</span>
            </div>
          </div>
        ))}
      </div>

      {/* Compile Result Banner */}
      {compileResult && (
        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl font-mono text-xs shadow-xl space-y-3 border border-slate-800">
          <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-2">
            <span>[MCP COMPILER & MANIFEST SUITE]</span>
            <button onClick={() => setCompileResult(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
            <div><span className="text-slate-500">Server:</span> {compileResult.serverName}</div>
            <div><span className="text-slate-500">Hash:</span> {compileResult.hash || compileResult.manifestHash}</div>
            <div><span className="text-slate-500">Bytecode:</span> {compileResult.bytecodeSize}</div>
            <div><span className="text-slate-500">Status:</span> <span className="text-emerald-400">{compileResult.validationStatus}</span></div>
          </div>
        </div>
      )}

      {/* Live MCP Client Host & Tool Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" /> Interactive MCP Host & JSON-RPC Gateway
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Select Tool</label>
              <select
                value={activeTool}
                onChange={(e) => setActiveTool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="fs_read_file">fs_read_file (File System)</option>
                <option value="exec_shell">exec_shell (Terminal Runner)</option>
                <option value="semantic_search">semantic_search (Vector Ingestor)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Arguments (JSON)</label>
              <textarea
                rows={5}
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            <button
              onClick={handleRunTool}
              disabled={executingTool}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition shadow-sm flex items-center justify-center gap-2"
            >
              {executingTool ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Execute Tool via MCP Gateway
            </button>
          </div>

          <div className="md:col-span-2 bg-slate-900 text-slate-200 p-6 rounded-2xl font-mono text-xs flex flex-col justify-between border border-slate-800">
            <div>
              <div className="text-slate-500 mb-2 uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>[JSON-RPC HOST RESPONSE]</span>
                <span className="text-emerald-400">Status: 200 OK</span>
              </div>
              <pre className="overflow-x-auto text-emerald-400 whitespace-pre-wrap">
                {toolExecutionResult ? JSON.stringify(toolExecutionResult, null, 2) : "// Execute a tool to inspect JSON-RPC response payload..."}
              </pre>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Protocol: MCP v1.0 over JSON-RPC 2.0</span>
              <span>Host: localhost:3000/api/mcp/host/call</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ingest Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Ingest MCP Server Schema</h3>
              <button onClick={() => setShowIngestModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleIngest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Server Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Postgres MCP Connector"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Protocol Type</label>
                <select
                  value={serverType}
                  onChange={(e) => setServerType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                >
                  <option value="stdio">stdio (Standard I/O)</option>
                  <option value="sse">sse (Server-Sent Events)</option>
                  <option value="json-rpc">json-rpc (Direct Gateway)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Raw MCP JSON Schema</label>
                <textarea
                  rows={8}
                  value={rawSchema}
                  onChange={(e) => setRawSchema(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition shadow-sm"
                >
                  Ingest & Compile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
