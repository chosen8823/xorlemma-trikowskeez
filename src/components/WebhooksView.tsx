import React, { useState } from "react";
import { Webhook, Plus, Send, RefreshCw, Trash2, CheckCircle2, Globe, Clock, Terminal } from "lucide-react";
import { WebhookItem, WebhookLog } from "../types";

interface WebhooksProps {
  webhooks: WebhookItem[];
  logs: WebhookLog[];
  onRefresh: () => void;
}

export function WebhooksView({ webhooks, logs, onRefresh }: WebhooksProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [targetBaseUrl, setTargetBaseUrl] = useState("");
  const [events, setEvents] = useState("pull_request, push");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [ingressResponse, setIngressResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          endpoint: endpoint.startsWith("/") ? endpoint : `/api/webhook/${endpoint || "custom"}`,
          targetBaseUrl: targetBaseUrl || "https://api.nexuscore.internal/v1/orchestrate",
          events: events.split(",").map(s => s.trim())
        })
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setEndpoint("");
        setTargetBaseUrl("");
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
      await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestFire = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/webhooks/${id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestingId(null);
    }
  };

  const handleSimulateIngress = async (whEndpoint: string) => {
    try {
      const cleanEp = whEndpoint.replace("/api/webhook/", "");
      const res = await fetch(`/api/webhook/ingress/${cleanEp}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "simulated.payload", action: "trigger", time: new Date().toISOString(), data: { source: "NexusCore Simulator" } })
      });
      const data = await res.json();
      setIngressResponse(data);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Webhook Orchestrator & Base URL Engine</h2>
          <p className="text-slate-500 text-sm mt-1">Configure base URL ingestion, event routing, secret signing, and live test simulators.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Webhook Endpoint
        </button>
      </div>

      {/* Webhooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webhooks.map((wh) => (
          <div key={wh.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Webhook className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{wh.name}</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {wh.triggerCount} triggers
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 bg-slate-50 px-3 py-2 rounded-xl font-mono">
                  <span>Ingress: {wh.endpoint}</span>
                  <span className="text-indigo-600 font-bold">POST</span>
                </div>
                <div className="text-slate-500 truncate">
                  <span className="font-semibold text-slate-700">Target Base URL:</span> {wh.targetBaseUrl}
                </div>
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-700">Events:</span> {wh.events.join(", ")}
                </div>
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-700">Secret:</span> <span className="font-mono">{wh.secret}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestFire(wh.id)}
                  disabled={testingId === wh.id}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  {testingId === wh.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Test Fire
                </button>
                <button
                  onClick={() => handleSimulateIngress(wh.endpoint)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" /> Simulate Ingress
                </button>
              </div>
              <button
                onClick={() => handleDelete(wh.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                title="Delete Webhook"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Response Banner */}
      {ingressResponse && (
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs shadow-lg space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
            <span>[ORCHESTRATOR INGRESS RESPONSE]</span>
            <button onClick={() => setIngressResponse(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <pre className="overflow-x-auto text-emerald-400">{JSON.stringify(ingressResponse, null, 2)}</pre>
        </div>
      )}

      {/* Webhook Activity Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Live Webhook Event & Orchestration Logs
          </h3>
          <button onClick={onRefresh} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold font-mono">
                  {log.status} OK
                </span>
                <div>
                  <span className="font-semibold text-slate-800">{log.event}</span>
                  <span className="text-slate-400 ml-2">({log.payloadSize})</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-mono">
                <span>Latency: {log.latencyMs}ms</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">No webhook logs recorded yet.</div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Create Webhook Endpoint</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddWebhook} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Webhook Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitHub Workflow Ingress"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Ingress Path</label>
                <input
                  type="text"
                  placeholder="/api/webhook/github-events"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Base URL Orchestration</label>
                <input
                  type="text"
                  placeholder="https://api.nexuscore.internal/v1/orchestrate"
                  value={targetBaseUrl}
                  onChange={(e) => setTargetBaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Events (comma-separated)</label>
                <input
                  type="text"
                  placeholder="pull_request, push, issue.opened"
                  value={events}
                  onChange={(e) => setEvents(e.target.value)}
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
                  {loading ? "Creating..." : "Create Webhook"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
