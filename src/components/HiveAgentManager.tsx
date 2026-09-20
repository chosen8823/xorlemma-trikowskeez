import React, { useState } from "react";
import { Shield, RefreshCw, CheckCircle2, Cpu, Sparkles, Plus, Trash2, Edit3, Save } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  alignment: number;
  maintenanceStatus: string;
}

interface HiveAgentManagerProps {
  agents?: Agent[];
  onRealignment: (agentId: string) => Promise<void>;
  onUpdateAgents: (agents: Agent[]) => Promise<void>;
}

export const HiveAgentManager: React.FC<HiveAgentManagerProps> = ({ agents = [], onRealignment, onUpdateAgents }) => {
  const [localAgents, setLocalAgents] = useState<Agent[]>(agents);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  React.useEffect(() => {
    setLocalAgents(agents);
  }, [agents]);

  const handleRealign = async (id: string) => {
    setLoadingId(id);
    try {
      await onRealignment(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleFieldChange = (id: string, field: keyof Agent, value: any) => {
    setLocalAgents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleAddAgent = () => {
    const newAgent: Agent = {
      id: `ag-${Date.now().toString().slice(-4)}`,
      name: "NewAgent",
      role: "Autonomous Sub-routine",
      status: "Idle",
      alignment: 100.0,
      maintenanceStatus: "Pending"
    };
    const updated = [...localAgents, newAgent];
    setLocalAgents(updated);
    setEditingId(newAgent.id);
  };

  const handleDeleteAgent = (id: string) => {
    const updated = localAgents.filter(a => a.id !== id);
    setLocalAgents(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await onUpdateAgents(localAgents);
      setEditingId(null);
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
            <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Active Hive Agent Management & Live Editing Substrate
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Directly edit agent names, roles, alignment scores, or spawn new constitutional agents on the fly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddAgent}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Spawn Agent
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-xs"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save Roster"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localAgents.map((agent) => {
          const isRealigning = loadingId === agent.id;
          const isEditing = editingId === agent.id;

          return (
            <div key={agent.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1 mr-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={agent.name}
                        onChange={(e) => handleFieldChange(agent.id, "name", e.target.value)}
                        className="w-full font-mono text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded"
                        placeholder="Agent Name"
                      />
                      <input
                        type="text"
                        value={agent.role}
                        onChange={(e) => handleFieldChange(agent.id, "role", e.target.value)}
                        className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded"
                        placeholder="Agent Role"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">{agent.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{agent.role}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={agent.alignment}
                        onChange={(e) => handleFieldChange(agent.id, "alignment", parseFloat(e.target.value) || 0)}
                        className="w-16 text-right font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-1 py-0.5 rounded"
                      />
                    ) : (
                      <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                        {agent.alignment}%
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Alignment</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Maintenance: {agent.maintenanceStatus}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(isEditing ? null : agent.id)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs transition"
                    title={isEditing ? "Done Editing" : "Edit Agent"}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs transition"
                    title="Terminate Agent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRealign(agent.id)}
                    disabled={isRealigning}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isRealigning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {isRealigning ? "Re-aligning..." : "Re-align"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
