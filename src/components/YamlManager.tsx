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
