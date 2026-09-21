import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { FieldOsView } from "./components/FieldOsView";
import { CryptandView } from "./components/CryptandView";
import { GoogleDriveView } from "./components/GoogleDriveView";
import { CommandCenterView } from "./components/CommandCenterView";
import { ApiKeysView } from "./components/ApiKeysView";
import { WebhooksView } from "./components/WebhooksView";
import { McpStudioView } from "./components/McpStudioView";
import { PerceptionView } from "./components/PerceptionView";
import { TerminalFsView } from "./components/TerminalFsView";
import { ApiKeyItem, WebhookItem, WebhookLog, McpServerItem } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [mcpServers, setMcpServers] = useState<McpServerItem[]>([]);

  const fetchAllData = async () => {
    try {
      const [keysRes, whRes, mcpRes] = await Promise.all([
        fetch("/api/keys").then(r => r.json()),
        fetch("/api/webhooks").then(r => r.json()),
        fetch("/api/mcp/servers").then(r => r.json()),
      ]);

      if (keysRes.success) setKeys(keysRes.keys);
      if (whRes.success) {
        setWebhooks(whRes.webhooks);
        setWebhookLogs(whRes.logs);
      }
      if (mcpRes.success) setMcpServers(mcpRes.servers);
    } catch (err) {
      console.error("Failed to fetch NexusCore state", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardView
            setActiveTab={setActiveTab}
            keysCount={keys.length}
            webhooksCount={webhooks.length}
            mcpCount={mcpServers.length}
          />
        )}
        {activeTab === "oshub" && (
          <CommandCenterView />
        )}
        {activeTab === "fieldos" && (
          <FieldOsView />
        )}
        {activeTab === "cryptand" && (
          <CryptandView />
        )}
        {activeTab === "drive" && (
          <GoogleDriveView />
        )}
        {activeTab === "keys" && (
          <ApiKeysView keys={keys} onRefresh={fetchAllData} />
        )}
        {activeTab === "webhooks" && (
          <WebhooksView webhooks={webhooks} logs={webhookLogs} onRefresh={fetchAllData} />
        )}
        {activeTab === "mcp" && (
          <McpStudioView servers={mcpServers} onRefresh={fetchAllData} />
        )}
        {activeTab === "perception" && (
          <PerceptionView />
        )}
        {activeTab === "terminal" && (
          <TerminalFsView />
        )}
      </main>
    </div>
  );
}
