import React, { useState } from "react";
import { Key, Plus, Trash2, CheckCircle, RefreshCw, Shield, AlertCircle } from "lucide-react";
import { ApiKeyItem } from "../types";

interface ApiKeysProps {
  keys: ApiKeyItem[];
  onRefresh: () => void;
}

export function ApiKeysView({ keys, onRefresh }: ApiKeysProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string>("ai:generate,mcp:host");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !keyValue) return;
    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          service: service || "Custom Service",
          key: keyValue,
          scopes: selectedScopes.split(",").map(s => s.trim())
        })
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setService("");
        setKeyValue("");
        setShowModal(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/keys/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestKey = async (id: string) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await fetch("/api/keys/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ id, message: data.message });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">API Key Extension Manager</h2>
          <p className="text-slate-500 text-sm mt-1">Manage secure extension API keys, cryptographic secrets, and service scopes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add API Extension Key
        </button>
      </div>

      {/* Keys List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Registered Extension Keys ({keys.length})</span>
          <button onClick={onRefresh} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {keys.map((k) => (
            <div key={k.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{k.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{k.service}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {k.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 pl-11">
                  <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{k.key}</span>
                  <span>Scopes: {k.scopes.join(", ")}</span>
                  <span>Last used: {new Date(k.lastUsed).toLocaleTimeString()}</span>
                </div>
                {testResult && testResult.id === k.id && (
                  <div className="ml-11 mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {testResult.message}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleTestKey(k.id)}
                  disabled={testingId === k.id}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  {testingId === k.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                  Test Connection
                </button>
                <button
                  onClick={() => handleDelete(k.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Revoke Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {keys.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No API extension keys registered yet. Click above to add one.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Add API Extension Key</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddKey} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Key / Extension Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OpenAI GPT-4 Connector"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Service Provider</label>
                <input
                  type="text"
                  placeholder="e.g. OpenAI, Stripe, GitHub"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">API Secret Key</label>
                <input
                  type="password"
                  required
                  placeholder="sk-..."
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Scopes (comma-separated)</label>
                <input
                  type="text"
                  placeholder="ai:generate, webhook:ingress, mcp:host"
                  value={selectedScopes}
                  onChange={(e) => setSelectedScopes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-sm"
                >
                  {loading ? "Saving..." : "Save Key Extension"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
