import React, { useState } from 'react';
import { Bot, Sparkles, ShieldAlert, CheckCircle2, ArrowRight, Play, Terminal } from 'lucide-react';

export const AgentPage: React.FC = () => {
  const [agentMode, setAgentMode] = useState<'autonomous' | 'hitl'>('hitl');
  const [logs] = useState([
    '[14:20:00] [AGENT] Executing routine scan across 5 campus material streams...',
    '[14:22:15] [ANOMALY] Detected +32.9% plastic surge at Science Block SB-04.',
    '[14:22:18] [GRANITE_RAG] Retrieved ISO 14001:2024 compliance guideline #GR-883.',
    '[14:22:20] [PROPOSAL] Generated advisory action plan #ACT-8842.',
    '[14:22:22] [HITL] Waiting for operator sign-off on pneumatic arm rerouting...'
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">EcoAction Autonomous Agent Hub</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Configure agentic loop parameters, Human-in-the-Loop thresholds, and automated actuation rules.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setAgentMode('hitl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              agentMode === 'hitl' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Human-in-the-Loop (HITL)
          </button>
          <button
            onClick={() => setAgentMode('autonomous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              agentMode === 'autonomous' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Full Autonomous Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Agent Policy & Intervention Strategy</span>
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed font-mono">
            EcoAction Agent continuously monitors real-time conveyor throughput and building resource usage. When an anomaly exceeds variance thresholds (&gt;15%), the agent formulates multi-step corrective operational plans.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Agent Mode:</span>
              <span className="text-emerald-400 font-bold uppercase">{agentMode}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>RAG Citation Engine:</span>
              <span className="text-white font-bold">IBM Granite 3.0 8B Instruct</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Response SLA:</span>
              <span className="text-white font-bold">&lt; 450 ms</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 font-mono">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Agent Action Execution Log</span>
          </h3>
          <div className="space-y-2 text-xs text-zinc-300">
            {logs.map((log, idx) => (
              <p key={idx} className="leading-relaxed bg-zinc-900/50 p-2 rounded border border-zinc-800/80">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
