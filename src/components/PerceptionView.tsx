import React, { useState } from "react";
import { Eye, Sparkles, Upload, Camera, RefreshCw, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { PerceptionResult } from "../types";

export function PerceptionView() {
  const [prompt, setPrompt] = useState("Analyze this interface/feed for UI hierarchy, color contrast compliance, accessibility markers, and machine perception objects.");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [perception, setPerception] = useState<PerceptionResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunPerception = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/perception/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageBase64 })
      });
      const data = await res.json();
      if (data.success) {
        setPerception(data.perception);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Multimodal & Machine Experienceable Perception Engine</h2>
        <p className="text-slate-500 text-sm mt-1">Leverage Gemini multimodal AI for machine perception analysis, visual object bounding, telemetry parsing, and semantic anomaly detection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Eye className="w-5 h-5 text-indigo-600" /> Perception Source & Prompt
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Input Image / Visual Frame</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-500 transition bg-slate-50 relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {imageBase64 ? (
                  <div className="space-y-2">
                    <img src={imageBase64} alt="Perception target" className="max-h-36 mx-auto rounded-xl object-cover shadow-sm" />
                    <span className="text-xs text-indigo-600 font-medium">Click or drag to replace image</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-700">Upload screenshot or visual feed</p>
                    <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 20MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Perception Prompt & Directive</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleRunPerception}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Execute Multimodal Perception
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" /> Machine Perception Telemetry & Insights
              </h3>
              {perception && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confidence: {Math.round(perception.confidenceScore * 100)}%
                </span>
              )}
            </div>

            {perception ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perception Summary</h4>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {perception.summary}
                  </p>
                </div>

                {perception.detectedObjects && perception.detectedObjects.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Machine Objects & Bounding</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {perception.detectedObjects.map((obj, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{obj.label}</span>
                          <span className="font-mono text-indigo-600">{Math.round(obj.confidence * 100)}% match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {perception.machineInsights && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Machine Intelligence Analysis</h4>
                    <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-900 text-xs font-mono leading-relaxed">
                      {perception.machineInsights}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">Ready for Cryptand Daemon Ingestion</span>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/cryptand/percept-ingest", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ summary: perception.summary, detectedObjects: perception.detectedObjects })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert(`Successfully ingested perception stream! Procedurally generated symbolic thread: ${data.thread.name}`);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition shadow-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Ingest into Cryptand & Spawn Symbolic Thread
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400 text-sm">
                Upload a visual frame or image and run perception to inspect structured machine telemetry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
