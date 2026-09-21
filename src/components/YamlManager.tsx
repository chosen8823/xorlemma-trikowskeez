import React, { useState, useEffect } from "react";
import { Code, Check, Sparkles, RefreshCw, Layers, ShieldCheck, Database } from "lucide-react";

interface YamlManagerProps {
  tiers: Record<string, { name: string; content: string }>;
  onUpdateTier: (tierId: string, newContent: string) => Promise<void>;
}

export const YamlManager: React.FC<YamlManagerProps> = ({ tiers, onUpdateTier }) => {
  const [activeTier, setActiveTier] = useState<string>("tier-0");
  const [content, setContent] = useState<string>(tiers[activeTier]?.content || "");
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [autoSaveEngram, setAutoSaveEngram] = useState<boolean>(true);
  const [lastCheckpoint, setLastCheckpoint] = useState<string | null>(null);

  useEffect(() => {
    if (tiers[activeTier]) {
      setContent(tiers[activeTier].content);
      setValidationError(null);
    }
  }, [activeTier, tiers]);

  // Auto-Save to Engram effect
  useEffect(() => {
    if (!autoSaveEngram) return;
    const timer = setTimeout(async () => {
      if (content && content !== tiers[activeTier]?.content) {
        try {
          await onUpdateTier(activeTier, content);
          setLastCheckpoint(new Date().toLocaleTimeString());
        } catch (err) {
          console.error("Auto-save engram error:", err);
        }
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [content, autoSaveEngram, activeTier, tiers, onUpdateTier]);

  const handleSave = async () => {
    if (!content.includes(":")) {
      setValidationError("YAML structure warning: missing key-value colon separators.");
    } else {
      setValidationError(null);
    }

    setSaving(true);
    try {
      await onUpdateTier(activeTier, content);
      setSuccess(true);
      setLastCheckpoint(new Date().toLocaleTimeString());
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Tiered YAML Manager & Engram Substrate
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visually inspect, mutate, and auto-checkpoint Tier 0-4 YAML structures into Lumetra Engram.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900">
            <Database className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Auto-Save to Engram</span>
            <input
              type="checkbox"
              checked={autoSaveEngram}
              onChange={(e) => setAutoSaveEngram(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1">
            {Object.keys(tiers).map((tierKey) => (
              <button
                key={tierKey}
                onClick={() => setActiveTier(tierKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                  activeTier === tierKey
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tierKey.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Architecture & External Anchor Layer Matrix */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-purple-600" /> System Layers & External Anchors Matrix
            </span>
            <span className="text-[10px] text-slate-400 font-mono">8 Tiers & Anchor Gateways Active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/60 dark:bg-slate-800/40 text-slate-500 text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Layer</th>
                  <th className="py-2.5 px-3 font-semibold">Function</th>
                  <th className="py-2.5 px-3 font-semibold">External Anchor</th>
                  <th className="py-2.5 px-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { id: "tier-0", layer: "Tier 0 Kernel YAML", func: "foundational self‑observation and alignment rules", anchor: "xorlemma trikowskeez root manifest", status: "ANCHORED" },
                  { id: "tier-1", layer: "Tier 1 Hive YAML", func: "agent ecology and gamification logic", anchor: "device registry in Desktop Commander MCP", status: "SYNCED" },
                  { id: "tier-2", layer: "Tier 2 Field YAML", func: "symbolic motion grammar and attractor physics", anchor: "NexusCore perception engine", status: "RESONANT" },
                  { id: "tier-3", layer: "Tier 3 World YAML", func: "procedural generation and narrative layers", anchor: "AI Studio orchestration workspace", status: "AUTONOMOUS" },
                  { id: "tier-4", layer: "Tier 4 Engram YAML", func: "persistent memory substrate", anchor: "Lumetra Engram schema", status: "PERSISTENT" },
                  { id: "mcp-tools", layer: "MCP Tools", func: "JSON‑RPC interfaces and syscalls", anchor: "mcp.desktopcommander.app", status: "14 TOOLS" },
                  { id: "cryptand-exp", layer: "Cryptand Expansion Rules", func: "bounded infinite extension logic", anchor: "xorlemma trikowskeez cryptand module", status: "EXPANDED" },
                  { id: "agent-evo", layer: "Agent Evolution Mechanics", func: "self‑maintenance and upgrade cycles", anchor: "hive daemons in NexusCore", status: "OPTIMAL" },
                ].map((row) => (
                  <tr
                    key={row.layer}
                    onClick={() => {
                      if (tiers[row.id]) setActiveTier(row.id);
                    }}
                    className={`cursor-pointer transition hover:bg-purple-50/50 dark:hover:bg-purple-950/30 ${
                      activeTier === row.id ? "bg-purple-50/80 dark:bg-purple-950/50 font-semibold" : ""
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-purple-700 dark:text-purple-300 whitespace-nowrap">
                      {row.layer}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                      {row.func}
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                      <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-300">{row.anchor}</code>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Editing: {tiers[activeTier]?.name || activeTier}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            {lastCheckpoint && <span>Last Engram Checkpoint: {lastCheckpoint}</span>}
            <span>• YAML Schema Active</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full font-mono text-xs bg-slate-950 text-purple-200 p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/40 leading-relaxed"
            placeholder="Enter valid tier YAML structure..."
          />
        </div>

        {validationError && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-xs">
            {validationError}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{autoSaveEngram ? "Lumetra Engram auto-checkpointing active" : "Manual commit mode"}</span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {saving ? "Synchronizing..." : success ? "YAML Config Synced!" : "Commit YAML Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
