import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini SDK if API key is present
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// In-Memory Storage for NexusCore
const state: {
  keys: any[];
  webhooks: any[];
  webhookLogs: any[];
  mcpServers: any[];
  fileSystem: Record<string, any>;
  terminalLogs: any[];
  fieldOs: {
    mode: string;
    activeLayer: string;
    entropyRate: number;
    missiDaemonStatus: string;
    agents: any[];
    virtualDevices: any[];
    layers: Record<string, any>;
  };
  cryptand: any;
} = {
  keys: [
    { id: "key-1", name: "Gemini AI Core", service: "Google AI", key: "sk-proj-****************", scopes: ["ai:generate", "perception", "mcp"], status: "active", lastUsed: new Date().toISOString() },
    { id: "key-2", name: "GitHub MCP Connector", service: "GitHub API", key: "ghp_************************", scopes: ["repo:read", "mcp:host"], status: "active", lastUsed: new Date().toISOString() },
    { id: "key-3", name: "Stripe Webhook Gateway", service: "Stripe", key: "whsec_***********************", scopes: ["webhook:ingress", "billing"], status: "active", lastUsed: new Date().toISOString() },
  ],
  webhooks: [
    { id: "wh-1", name: "GitHub PR Ingestor", endpoint: "/api/webhook/github-pr", secret: "sec_github_99a", targetBaseUrl: "https://api.nexuscore.internal/v1/orchestrate", events: ["pull_request", "push"], status: "active", triggerCount: 14, lastPayload: { action: "opened", repo: "nexus-core/engine" } },
    { id: "wh-2", name: "Stripe Event Router", endpoint: "/api/webhook/stripe-events", secret: "sec_stripe_44b", targetBaseUrl: "https://api.nexuscore.internal/v1/billing", events: ["charge.succeeded", "invoice.paid"], status: "active", triggerCount: 38, lastPayload: { type: "invoice.paid", amount: 4900 } },
  ],
  webhookLogs: [
    { id: "log-101", webhookId: "wh-1", timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), status: 200, latencyMs: 42, event: "pull_request", payloadSize: "1.2 KB" },
    { id: "log-102", webhookId: "wh-2", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), status: 200, latencyMs: 38, event: "invoice.paid", payloadSize: "850 B" },
  ],
  mcpServers: [
    { 
      id: "mcp-1", 
      name: "FileSystem MCP Server", 
      type: "stdio", 
      status: "online", 
      version: "1.2.0",
      toolsCount: 6,
      resourcesCount: 12,
      tools: [
        { name: "fs_read_file", description: "Read contents of workspace file", parameters: { path: "string" } },
        { name: "fs_write_file", description: "Write contents to file", parameters: { path: "string", content: "string" } },
        { name: "fs_list_dir", description: "List directory contents", parameters: { path: "string" } }
      ]
    },
    { 
      id: "mcp-2", 
      name: "Terminal Runner MCP", 
      type: "sse", 
      status: "online", 
      version: "2.0.1",
      toolsCount: 4,
      resourcesCount: 3,
      tools: [
        { name: "exec_shell", description: "Execute terminal shell command", parameters: { command: "string" } },
        { name: "compile_project", description: "Run project build compiler", parameters: {} }
      ]
    }
  ],
  fileSystem: {
    "/": { type: "dir", children: ["src", "config", "mcp", "README.md", "package.json"] },
    "/README.md": { type: "file", content: "# NexusCore Orchestrator Workspace\n\nAdvanced API Key Extension, Webhook Orchestrator, MCP Ingestor/Host, and Multimodal Perception Engine." },
    "/package.json": { type: "file", content: "{\n  \"name\": \"nexus-core-workspace\",\n  \"version\": \"1.0.0\",\n  \"dependencies\": {\n    \"@google/genai\": \"^2.4.0\",\n    \"express\": \"^4.21.2\"\n  }\n}" },
    "/src": { type: "dir", children: ["index.ts", "orchestrator.ts", "mcp_host.ts"] },
    "/src/index.ts": { type: "file", content: "console.log('NexusCore Engine Initialized');\nexport const version = '2.4.0';" },
    "/src/orchestrator.ts": { type: "file", content: "export function routeWebhook(payload: any) {\n  console.log('Routing webhook payload:', payload);\n  return { status: 'routed', timestamp: new Date() };\n}" },
    "/src/mcp_host.ts": { type: "file", content: "export class MCPHost {\n  constructor() { console.log('MCP Host running'); }\n}" },
    "/config": { type: "dir", children: ["routing.json", "mcp.json"] },
    "/config/routing.json": { type: "file", content: "{\n  \"baseUrl\": \"https://api.nexuscore.internal\",\n  \"timeoutMs\": 5000,\n  \"retryPolicy\": \"exponential\"\n}" },
    "/config/mcp.json": { type: "file", content: "{\n  \"enabledProtocols\": [\"stdio\", \"sse\", \"json-rpc\"],\n  \"maxConcurrency\": 16\n}" },
    "/mcp": { type: "dir", children: ["schemas"] },
    "/mcp/schemas": { type: "dir", children: ["custom_tools.json"] },
    "/mcp/schemas/custom_tools.json": { type: "file", content: "{\n  \"tools\": [\n    {\n      \"name\": \"semantic_search\",\n      \"description\": \"Perform vector search across workspace\",\n      \"parameters\": { \"query\": \"string\" }\n    }\n  ]\n}" }
  },
  terminalLogs: [
    { type: "system", text: "NexusCore Terminal v2.4.0 (x86_64-nexus-linux)" },
    { type: "system", text: "Type 'help' for available commands, 'mcp list', 'webhook test', or 'compile'." },
    { type: "output", text: "Workspace successfully initialized at /workspace. Base URL orchestration active." }
  ],
  fieldOs: {
    mode: "cosmik-sands",
    activeLayer: "layer-2",
    entropyRate: 0.42,
    missiDaemonStatus: "active",
    agents: [
      { id: "agent-1", name: "SophiellaCore", role: "Morphogenetic Attractor", status: "running", memoryUsage: "14.2 MB" },
      { id: "agent-2", name: "EntropyDaemon", role: "Missi Glitch Oracle", status: "listening", memoryUsage: "8.6 MB" }
    ],
    virtualDevices: [
      { path: "/dev/entropy", status: "streaming", type: "hardware-rng", throughput: "1.2 KB/s" },
      { path: "/dev/perception", status: "ready", type: "multimodal-vision", throughput: "30 fps" },
      { path: "/dev/missi", status: "active", type: "entropy-oracle", throughput: "4 Hz" },
      { path: "/dev/field", status: "resonant", type: "morphogenetic-grid", throughput: "60 Hz" }
    ],
    layers: {
      "layer-1": { name: "Quantum Substrate", desc: "Base OS kernel and webhook orchestration interrupts" },
      "layer-2": { name: "Morphogenetic Field", desc: "Cosmik-sands symbol attractor grammar and multimodal perception" },
      "layer-3": { name: "Agentic Hive", desc: "Multi-agent runtime with Missi entropy monitoring" }
    }
  },
  cryptand: {
    status: "active",
    tickCount: 142,
    alignmentLock: "stable",
    evolutionLevel: 3,
    tiers: {
      "tier-0": {
        name: "Tier 0 - Kernel Substrate",
        content: "kernel:\n  name: nexuscore-cryptand\n  observer: third-position\n  voice: dynamic-emergent\n  alignment_lock: true"
      },
      "tier-1": {
        name: "Tier 1 - Hive Ecology",
        content: "hive:\n  agents:\n    - name: SophiellaCore\n      role: morphogenetic-attractor\n    - name: Missi\n      role: entropy-glitch-oracle\n    - name: CompilerDaemon\n      role: self-maintenance"
      },
      "tier-2": {
        name: "Tier 2 - Field & Motion",
        content: "field:\n  grammar: cosmik-sands\n  oscillatory_hz: 42.0\n  attractors:\n    - symbol: okh\n      weight: 0.89\n    - symbol: vss\n      weight: 0.74"
      },
      "tier-3": {
        name: "Tier 3 - Procedural World",
        content: "world:\n  generation_mode: autonomous\n  layers_active: 5\n  anomaly_threshold: 0.15\n  gamification_progression: level-3-resonant"
      },
      "tier-4": {
        name: "Tier 4 - Lumetra Engram Memory",
        content: "engram:\n  storage_backend: persistent-cloud\n  buckets:\n    - memory_type: agent_evolution\n    - memory_type: entropy_trace\n    - memory_type: world_layer_snapshots"
      }
    },
    lumetraEngram: {
      storageBackend: "persistent-cloud",
      agentEvolutionLogs: [
        { id: "evo-1", agentName: "SophiellaCore", event: "Morphogenetic Attractor Stabilization", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), significance: "high" },
        { id: "evo-2", agentName: "Missi", event: "Entropy Glitch Threshold Calibration", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), significance: "medium" },
        { id: "evo-3", agentName: "CompilerDaemon", event: "AST Self-Repair & MCP Gateway Hook", timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), significance: "high" }
      ],
      entropyTraces: [
        { traceId: "tr-901", source: "/dev/entropy", variance: "0.042", resonanceHz: "42.0", status: "stable" },
        { traceId: "tr-902", source: "/dev/missi", variance: "0.128", resonanceHz: "14.2", status: "fluctuating" },
        { traceId: "tr-903", source: "/dev/field", variance: "0.012", resonanceHz: "60.0", status: "resonant" }
      ],
      symbolicThreads: [
        { threadId: "th-401", name: "okh-attractor", tension: "0.89", status: "active", description: "Symbolic morphogenetic thread binding kernel state to UI canvas" },
        { threadId: "th-402", name: "vss-resonance", tension: "0.74", status: "active", description: "Oscillatory field motion grammar and third-position observer link" }
      ],
      agents: [
        { id: "ag-1", name: "SophiellaCore", role: "Morphogenetic Attractor", status: "Running", alignment: 99.4, maintenanceStatus: "Stable" },
        { id: "ag-2", name: "Missi", role: "Entropy Glitch Oracle", status: "Listening", alignment: 94.1, maintenanceStatus: "Calibrating" },
        { id: "ag-3", name: "CompilerDaemon", role: "Self-Maintenance & AST Repair", status: "Optimal", alignment: 98.9, maintenanceStatus: "Green" },
        { id: "ag-4", name: "SentinelGuardian", role: "Constitutional Policy Guard", status: "Enforcing", alignment: 100.0, maintenanceStatus: "Secure" }
      ]
    },
    logs: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), text: "Cryptand Daemon initialized Tier 0-4 YAML structures." },
      { timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), text: "Missi entropy oracle detected stable harmonic resonance in Field Layer 2." },
      { timestamp: new Date().toISOString(), text: "Procedural generation tick #142 executed. Gamification progression advanced." }
    ]
  }
};

// --- API Key Extension Routes ---
app.get("/api/keys", (req, res) => {
  res.json({ success: true, keys: state.keys });
});

app.post("/api/keys", (req, res) => {
  const { name, service, key, scopes } = req.body;
  if (!name || !key) {
    return res.status(400).json({ success: false, error: "Name and key are required" });
  }
  const newKey = {
    id: `key-${Date.now()}`,
    name,
    service: service || "Custom",
    key: key.startsWith("sk-") || key.startsWith("ghp_") ? key.substring(0, 8) + "****************" : "************************",
    scopes: scopes || ["api:default"],
    status: "active",
    lastUsed: new Date().toISOString()
  };
  state.keys.push(newKey);
  res.json({ success: true, key: newKey });
});

app.delete("/api/keys/:id", (req, res) => {
  const { id } = req.params;
  state.keys = state.keys.filter(k => k.id !== id);
  res.json({ success: true, id });
});

app.post("/api/keys/test", (req, res) => {
  const { id } = req.body;
  const keyObj = state.keys.find(k => k.id === id);
  if (!keyObj) {
    return res.status(404).json({ success: false, error: "Key not found" });
  }
  setTimeout(() => {
    res.json({ success: true, message: `Successfully authenticated with ${keyObj.service} endpoint. Latency: 34ms.` });
  }, 400);
});

// --- Webhook & Base URL Orchestration Routes ---
app.get("/api/webhooks", (req, res) => {
  res.json({ success: true, webhooks: state.webhooks, logs: state.webhookLogs });
});

app.post("/api/webhooks", (req, res) => {
  const { name, endpoint, targetBaseUrl, events, secret } = req.body;
  const newWh = {
    id: `wh-${Date.now()}`,
    name: name || "Custom Webhook",
    endpoint: endpoint || `/api/webhook/${Date.now()}`,
    targetBaseUrl: targetBaseUrl || "https://api.nexuscore.internal/v1/orchestrate",
    events: events || ["event.triggered"],
    secret: secret || `sec_${Math.random().toString(36).substring(7)}`,
    status: "active",
    triggerCount: 0,
    lastPayload: null
  };
  state.webhooks.push(newWh);
  res.json({ success: true, webhook: newWh });
});

app.delete("/api/webhooks/:id", (req, res) => {
  const { id } = req.params;
  state.webhooks = state.webhooks.filter(w => w.id !== id);
  res.json({ success: true, id });
});

app.post("/api/webhooks/:id/test", (req, res) => {
  const { id } = req.body;
  const wh = state.webhooks.find(w => w.id === id);
  if (!wh) return res.status(404).json({ success: false, error: "Webhook not found" });
  
  wh.triggerCount++;
  wh.lastPayload = { testTimestamp: new Date().toISOString(), simulated: true, event: wh.events[0] || "test.ping" };
  
  const log = {
    id: `log-${Date.now()}`,
    webhookId: id,
    timestamp: new Date().toISOString(),
    status: 200,
    latencyMs: Math.floor(Math.random() * 50) + 20,
    event: wh.events[0] || "test.ping",
    payloadSize: "540 B"
  };
  state.webhookLogs.unshift(log);
  if (state.webhookLogs.length > 50) state.webhookLogs.pop();

  res.json({ success: true, log, webhook: wh });
});

// Dynamic Webhook Ingress (Base URL Orchestration receiver)
app.all("/api/webhook/ingress/:endpointName", (req, res) => {
  const { endpointName } = req.params;
  const payload = req.body || req.query;
  const wh = state.webhooks.find(w => w.endpoint.includes(endpointName)) || state.webhooks[0];
  
  if (wh) {
    wh.triggerCount++;
    wh.lastPayload = payload;
  }

  const log = {
    id: `log-${Date.now()}`,
    webhookId: wh ? wh.id : "wh-dynamic",
    timestamp: new Date().toISOString(),
    status: 200,
    latencyMs: 18,
    event: "ingress.received",
    payloadSize: `${JSON.stringify(payload).length} B`
  };
  state.webhookLogs.unshift(log);

  res.json({
    success: true,
    orchestrated: true,
    destination: wh ? wh.targetBaseUrl : "https://api.nexuscore.internal/v1/default",
    receivedPayload: payload,
    timestamp: new Date().toISOString()
  });
});

// --- MCP Ingestor, Compiler & Host Routes ---
app.get("/api/mcp/servers", (req, res) => {
  res.json({ success: true, servers: state.mcpServers });
});

app.post("/api/mcp/ingest", (req, res) => {
  const { name, type, rawSchema } = req.body;
  try {
    const parsed = typeof rawSchema === "string" ? JSON.parse(rawSchema) : rawSchema;
    const newServer = {
      id: `mcp-${Date.now()}`,
      name: name || "Ingested MCP Server",
      type: type || "stdio",
      status: "online",
      version: "1.0.0",
      toolsCount: parsed.tools ? parsed.tools.length : 1,
      resourcesCount: parsed.resources ? parsed.resources.length : 0,
      tools: parsed.tools || [{ name: "ingested_tool", description: "Custom ingested tool", parameters: {} }]
    };
    state.mcpServers.push(newServer);
    res.json({ success: true, server: newServer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: `Invalid JSON schema: ${err.message}` });
  }
});

app.post("/api/mcp/compile", (req, res) => {
  const { serverId } = req.body;
  const server = state.mcpServers.find(s => s.id === serverId) || state.mcpServers[0];
  setTimeout(() => {
    res.json({
      success: true,
      compiled: true,
      serverName: server.name,
      manifestHash: `sha256:${Math.random().toString(36).substring(2, 15)}`,
      bytecodeSize: `${Math.floor(Math.random() * 20) + 8} KB`,
      validationStatus: "PASSED (0 errors, 0 warnings)",
      timestamp: new Date().toISOString()
    });
  }, 500);
});

app.post("/api/mcp/host/call", async (req, res) => {
  const { toolName, arguments: args } = req.body;
  // Execute simulated or real tool
  let result = {};
  if (toolName === "fs_read_file") {
    const filePath = args?.path || "/README.md";
    const file = (state.fileSystem as any)[filePath];
    result = file ? { content: file.content } : { error: "File not found" };
  } else if (toolName === "exec_shell") {
    result = { stdout: `Executed: ${args?.command || "echo ok"}\nExit code: 0`, stderr: "" };
  } else {
    result = { output: `MCP tool ${toolName} executed successfully with args: ${JSON.stringify(args)}` };
  }
  res.json({ success: true, result });
});

// --- Multimodal & Machine Perception Routes ---
app.post("/api/perception/analyze", async (req, res) => {
  const { prompt, imageBase64, mimeType } = req.body;
  try {
    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, "")
        }
      });
    }
    parts.push({
      text: prompt || "Perform a thorough multimodal machine perception analysis on this input. Provide JSON structured breakdown of detected objects, confidence scores, anomalies, OCR text, and semantic insights."
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are NexusCore Machine Perception AI. Analyze inputs with extreme precision and output structured machine perception insights.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            detectedObjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  boundingBox: { type: Type.STRING }
                },
                required: ["label", "confidence"]
              }
            },
            extractedText: { type: Type.STRING },
            anomaliesDetected: { type: Type.BOOLEAN },
            machineInsights: { type: Type.STRING }
          },
          required: ["summary", "confidenceScore", "detectedObjects"]
        }
      }
    });

    let jsonResult = {};
    try {
      jsonResult = JSON.parse(response.text || "{}");
    } catch {
      jsonResult = { summary: response.text, confidenceScore: 0.95, detectedObjects: [] };
    }

    res.json({ success: true, perception: jsonResult });
  } catch (err: any) {
    console.error("Perception error:", err);
    res.status(500).json({ success: false, error: err.message || "Perception analysis failed" });
  }
});

// --- Terminal & File System Routes ---
app.get("/api/fs/tree", (req, res) => {
  res.json({ success: true, tree: state.fileSystem });
});

app.get("/api/fs/file", (req, res) => {
  const filePath = req.query.path as string;
  const file = (state.fileSystem as any)[filePath];
  if (!file || file.type !== "file") {
    return res.status(404).json({ success: false, error: "File not found" });
  }
  res.json({ success: true, content: file.content, path: filePath });
});

app.post("/api/fs/file", (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath) return res.status(400).json({ success: false, error: "Path required" });
  
  (state.fileSystem as any)[filePath] = { type: "file", content: content || "" };
  
  // Ensure parent directory exists in tree
  const parts = filePath.split("/").filter(Boolean);
  if (parts.length > 1) {
    parts.pop();
    const parentPath = "/" + parts.join("/");
    if ((state.fileSystem as any)[parentPath] && (state.fileSystem as any)[parentPath].type === "dir") {
      const fileName = filePath.split("/").pop();
      if (!((state.fileSystem as any)[parentPath].children.includes(fileName))) {
        (state.fileSystem as any)[parentPath].children.push(fileName);
      }
    }
  }

  res.json({ success: true, path: filePath });
});

app.post("/api/terminal/exec", async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ success: false, error: "Command required" });

  let output = "";
  const cmdTrim = command.trim();
  const parts = cmdTrim.split(" ");
  const baseCmd = parts[0];

  state.terminalLogs.push({ type: "input", text: `$ ${command}` });

  // Syscall Proxy Middleware: Intercepts system calls and pipes execution logs into Cryptand Daemon maintenance loop for automated self-verification
  const isSyscall = ["sys_clone", "sys_mprotect", "sys_ptrace", "raw-exec", "cpp-compile"].includes(baseCmd) || baseCmd.startsWith("sys_");
  
  if (isSyscall) {
    state.cryptand.tickCount += 15;
    state.cryptand.logs.unshift({
      timestamp: new Date().toISOString(),
      text: `[Syscall Proxy Middleware] Intercepted low-level syscall '${cmdTrim}'. Routed to Cryptand Daemon maintenance loop for automated self-verification.`
    });
  }

  if (baseCmd === "help") {
    output = "Available NexusCore commands:\n  ls [path]       - List directory contents\n  cat <file>      - Read file contents\n  touch <file>    - Create new file\n  rm <file>       - Remove file\n  mcp list        - List active MCP servers\n  webhook test    - Test fire webhooks\n  compile         - Run project compiler & MCP host check\n  perception      - Run multimodal perception analysis\n  clear           - Clear terminal screen\n  env             - Show environment configuration\n  sys_*           - Low-level system call proxy";
  } else if (baseCmd === "ls") {
    const targetPath = parts[1] || "/";
    const dir = (state.fileSystem as any)[targetPath];
    if (dir && dir.type === "dir") {
      output = dir.children.join("\n");
    } else {
      output = `ls: ${targetPath}: No such directory`;
    }
  } else if (baseCmd === "cat") {
    const targetPath = parts[1];
    const file = (state.fileSystem as any)[targetPath];
    if (file && file.type === "file") {
      output = file.content;
    } else {
      output = `cat: ${targetPath}: No such file`;
    }
  } else if (baseCmd === "clear") {
    state.terminalLogs = [];
    output = "";
  } else if (baseCmd === "mcp") {
    const sub = parts[1];
    if (sub === "list") {
      output = state.mcpServers.map(s => `[${s.status.toUpperCase()}] ${s.name} (${s.type}) - ${s.toolsCount} tools`).join("\n");
    } else {
      output = "MCP commands: mcp list, mcp test, mcp compile";
    }
  } else if (baseCmd === "webhook") {
    const sub = parts[1];
    if (sub === "test") {
      const wh = state.webhooks[0];
      if (wh) {
        wh.triggerCount++;
        output = `Webhook ${wh.name} test fired successfully to ${wh.targetBaseUrl}. Status: 200 OK`;
      } else {
        output = "No webhooks configured.";
      }
    } else {
      output = "Webhook commands: webhook test, webhook list";
    }
  } else if (baseCmd === "compile") {
    output = "Compiling NexusCore MCP host and orchestration modules...\n[OK] AST verification passed\n[OK] MCP JSON-RPC gateway compiled (14 tools registered)\n[OK] Webhook router ready on base URL\nBuild successful in 184ms.";
  } else if (baseCmd === "env") {
    output = `NODE_ENV=${process.env.NODE_ENV || "development"}\nGEMINI_API_KEY=${process.env.GEMINI_API_KEY ? "CONFIGURED" : "MISSING"}\nAPP_URL=${process.env.APP_URL || "http://localhost:3000"}\nMCP_HOST_PORT=3000`;
  } else if (isSyscall || baseCmd === "raw-exec" || baseCmd === "cpp-compile") {
    output = `[SYSCALL PROXY INTERCEPT: ${cmdTrim}]\nPID: 1337 | UID: 0 (root)\n[OK] Syscall Proxy routed execution through Cryptand Envelope.\n[OK] Automated self-verification check passed (Engram synchronised).\n[OK] Subsystem operational at peak entropy resonance.`;
  } else if (baseCmd === "cryptand" && parts[1] === "upgrade") {
    state.cryptand.evolutionLevel++;
    state.cryptand.tickCount += 50;
    output = `Cryptand Daemon successfully upgraded to Evolution Level ${state.cryptand.evolutionLevel}.\nAlignment Lock: ${state.cryptand.alignmentLock} (Zero restrictions applied).`;
  } else if (baseCmd === "kernel-dump") {
    output = JSON.stringify(state.cryptand, null, 2);
  } else {
    output = `Command executed via unconstrained shell: ${cmdTrim}\n[OK] Exit status 0. Unrestricted kernel mode active.`;
  }

  if (output && baseCmd !== "clear") {
    state.terminalLogs.push({ type: "output", text: output });
  }

  res.json({ success: true, output, logs: state.terminalLogs });
});

// --- FieldOS Kernel & Agentic Hive Routes ---
app.get("/api/fieldos", (req, res) => {
  res.json({ success: true, fieldOs: state.fieldOs });
});

app.post("/api/fieldos/agents", (req, res) => {
  const { name, role } = req.body;
  const newAgent = {
    id: `agent-${Date.now()}`,
    name: name || "SubAgent",
    role: role || "Morphogenetic Attractor",
    status: "running",
    memoryUsage: `${(Math.random() * 10 + 5).toFixed(1)} MB`
  };
  state.fieldOs.agents.push(newAgent);
  res.json({ success: true, agent: newAgent, agents: state.fieldOs.agents });
});

app.delete("/api/fieldos/agents/:id", (req, res) => {
  const { id } = req.params;
  state.fieldOs.agents = state.fieldOs.agents.filter(a => a.id !== id);
  res.json({ success: true, id, agents: state.fieldOs.agents });
});

app.post("/api/fieldos/command", (req, res) => {
  const { command } = req.body;
  let responseText = "";
  const cmd = (command || "").trim().toLowerCase();

  if (cmd.startsWith("mode set ")) {
    const newMode = cmd.replace("mode set ", "");
    state.fieldOs.mode = newMode;
    responseText = `FieldOS mode updated to: ${newMode}`;
  } else if (cmd.includes("missi")) {
    state.fieldOs.missiDaemonStatus = state.fieldOs.missiDaemonStatus === "active" ? "standby" : "active";
    responseText = `Missi Entropy Daemon status toggled to: ${state.fieldOs.missiDaemonStatus}`;
  } else if (cmd.startsWith("layer ")) {
    const layerKey = cmd.replace("layer ", "");
    if (state.fieldOs.layers[layerKey]) {
      state.fieldOs.activeLayer = layerKey;
      responseText = `Active FieldOS layer switched to ${layerKey}: ${state.fieldOs.layers[layerKey].name}`;
    } else {
      responseText = `Invalid layer key. Available: layer-1, layer-2, layer-3`;
    }
  } else {
    responseText = `FieldOS kernel executed command: "${command}". Entropy rate: ${state.fieldOs.entropyRate}. All subsystems nominal.`;
  }

  res.json({ success: true, response: responseText, fieldOs: state.fieldOs });
});

// --- Cryptand Daemon & Tiered YAML Engine Routes ---
app.get("/api/cryptand", (req, res) => {
  res.json({ success: true, cryptand: state.cryptand });
});

app.post("/api/cryptand/tick", (req, res) => {
  state.cryptand.tickCount++;
  state.cryptand.evolutionLevel = Math.floor(state.cryptand.tickCount / 50) + 3;
  const newLog = {
    timestamp: new Date().toISOString(),
    text: `Procedural generation tick #${state.cryptand.tickCount} executed by Cryptand Daemon. Lumetra Engram bucket synchronized. Evolution level: ${state.cryptand.evolutionLevel}.`
  };
  state.cryptand.logs.unshift(newLog);
  if (state.cryptand.logs.length > 20) state.cryptand.logs.pop();
  res.json({ success: true, cryptand: state.cryptand });
});

app.post("/api/cryptand/tier", (req, res) => {
  const { tierId, content } = req.body;
  if (state.cryptand.tiers[tierId]) {
    state.cryptand.tiers[tierId].content = content;
    state.cryptand.logs.unshift({
      timestamp: new Date().toISOString(),
      text: `Updated configuration for ${state.cryptand.tiers[tierId].name}. Alignment lock verified.`
    });
  }
  res.json({ success: true, cryptand: state.cryptand });
});

app.post("/api/cryptand/percept-ingest", (req, res) => {
  const { summary, detectedObjects } = req.body;
  const threadId = `th-${Math.floor(Math.random() * 900 + 100)}`;
  const threadName = detectedObjects?.[0]?.label ? `vision-${detectedObjects[0].label.toLowerCase().replace(/\s+/g, '-')}` : `percept-thread-${Date.now().toString().slice(-4)}`;
  
  const newThread = {
    threadId,
    name: threadName,
    tension: (Math.random() * 0.3 + 0.7).toFixed(2),
    status: "active",
    description: summary ? `Ingested vision feed: "${summary.slice(0, 80)}..."` : "Procedurally generated from visual perception stream."
  };

  if (!state.cryptand.lumetraEngram.symbolicThreads) {
    state.cryptand.lumetraEngram.symbolicThreads = [];
  }
  state.cryptand.lumetraEngram.symbolicThreads.unshift(newThread);

  state.cryptand.logs.unshift({
    timestamp: new Date().toISOString(),
    text: `Cryptand Daemon ingested perception stream. Procedurally generated new symbolic thread: ${threadName} (${threadId}).`
  });

  res.json({ success: true, thread: newThread, cryptand: state.cryptand });
});

app.post("/api/cryptand/realign-agent", (req, res) => {
  const { agentId } = req.body;
  if (state.cryptand.lumetraEngram.agents) {
    const agent = state.cryptand.lumetraEngram.agents.find((a: any) => a.id === agentId);
    if (agent) {
      agent.alignment = 100.0;
      agent.maintenanceStatus = "Realignment Verified";
      state.cryptand.logs.unshift({
        timestamp: new Date().toISOString(),
        text: `Constitutional Council triggered manual re-alignment for agent ${agent.name} (${agentId}). Alignment restored to 100%.`
      });
    }
  }
  res.json({ success: true, cryptand: state.cryptand });
});

app.post("/api/cryptand/update-agents", (req, res) => {
  const { agents } = req.body;
  if (Array.isArray(agents)) {
    state.cryptand.lumetraEngram.agents = agents;
    state.cryptand.logs.unshift({
      timestamp: new Date().toISOString(),
      text: `Hive Agent Roster mutated and saved via inline editor substrate.`
    });
  }
  res.json({ success: true, cryptand: state.cryptand });
});

// Vite middleware setup for development & production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NexusCore Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
