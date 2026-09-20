export interface ApiKeyItem {
  id: string;
  name: string;
  service: string;
  key: string;
  scopes: string[];
  status: string;
  lastUsed: string;
}

export interface WebhookItem {
  id: string;
  name: string;
  endpoint: string;
  targetBaseUrl: string;
  events: string[];
  secret: string;
  status: string;
  triggerCount: number;
  lastPayload: any;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  timestamp: string;
  status: number;
  latencyMs: number;
  event: string;
  payloadSize: string;
}

export interface McpServerItem {
  id: string;
  name: string;
  type: string;
  status: string;
  version: string;
  toolsCount: number;
  resourcesCount: number;
  tools: {
    name: string;
    description: string;
    parameters: Record<string, string>;
  }[];
}

export interface PerceptionResult {
  summary: string;
  confidenceScore: number;
  detectedObjects?: {
    label: string;
    confidence: number;
    boundingBox?: string;
  }[];
  extractedText?: string;
  anomaliesDetected?: boolean;
  machineInsights?: string;
}
