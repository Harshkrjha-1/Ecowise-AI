import React, { useState, useEffect } from 'react';
import { telemetryApi } from '../services/api';
import { DashboardTelemetry } from '../types/app';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';
import { 
  Cpu, Activity, Zap, CheckCircle2, RefreshCw, AlertTriangle, Layers, ArrowUpRight, TrendingUp, ShieldCheck
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const [telemetry, setTelemetry] = useState<DashboardTelemetry | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [liveTickCount, setLiveTickCount] = useState(0);

  useEffect(() => {
    const loadTelemetry = async () => {
      const data = await telemetryApi.getDashboardTelemetry();
      setTelemetry(data);
    };
    loadTelemetry();
  }, []);

  // Periodic live telemetry simulation ticks
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setLiveTickCount((c) => c + 1);
      setTelemetry((prev) => {
        if (!prev) return prev;
        const currentProcessed = Math.min(300, prev.conveyor_throughput.processed + (Math.random() > 0.4 ? 1 : 0));
        const updatedEff = parseFloat((95.0 + Math.sin(Date.now() / 2000) * 2.2).toFixed(1));
        const updatedEnergy = parseFloat((15.5 + Math.cos(Date.now() / 3000) * 1.8).toFixed(2));
        return {
          ...prev,
          efficiency: updatedEff,
          energy_kwh: updatedEnergy,
          conveyor_throughput: {
            ...prev.conveyor_throughput,
            processed: currentProcessed,
            percentage: parseFloat(((currentProcessed / 300) * 100).toFixed(1)),
          },
        };
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  if (!telemetry) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-emerald-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Connecting to Operation Telemetry Stream...</span>
        </div>
      </div>
    );
  }

  const conveyorPercentage = telemetry.conveyor_throughput.percentage;
  const actuatorPercentage = telemetry.actuator_status.health_percentage;
  const purityPercentage = 98.2;

  return (
    <div className="space-y-6">
      {/* Top Banner / Operational Quick Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl relative">
            <Cpu className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Main Campus Material Sorting Hub #1</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                System Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              MQTT Mesh Connected • Latency: 12ms • Live Stream: {isLiveStreaming ? 'ACTIVE' : 'PAUSED'} (Ticks: {liveTickCount})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center space-x-1.5 ${
              isLiveStreaming
                ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isLiveStreaming ? 'Pause Realtime Stream' : 'Resume Telemetry'}</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('scanner')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition flex items-center space-x-1.5"
          >
            <span>Launch Smart Scanner</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI Card 1 */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Task</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold text-white truncate">{telemetry.kpi.current_task}</h3>
            <div className="flex items-center space-x-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-mono font-medium">Pneumatic Arm #2 Engaged</span>
            </div>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Waste Processed</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white font-mono">{telemetry.kpi.total_waste_kg.toLocaleString()} kg</span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">({telemetry.kpi.recyclable_percentage}% Recyclable)</span>
            </div>
            {/* Progress bar mini */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${telemetry.kpi.recyclable_percentage}%` }} />
            </div>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Anomaly Detection</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white font-mono">{telemetry.kpi.anomaly_variance}%</span>
              <span className="text-xs text-zinc-400">Variance from baseline</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nominal AI Standard (Target &lt; 1.0%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section: Top Performance Graph & Status Radial Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Area/Line Chart (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>System Efficiency vs. Energy Consumption</span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                  Telemetry Area
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time telemetric throughput ratio compared against grid draw (kWh)</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">Efficiency (%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-zinc-300">Energy (kWh)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry.performance_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="efficiencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="time" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '0.75rem', color: '#FFF' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#efficiencyGrad)" name="Efficiency (%)" />
                <Area type="monotone" dataKey="energy" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#energyGrad)" name="Energy (kWh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Radial Gauges Side Column */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white tracking-tight">Actuator & Gauge Status</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Circular throughput progress rings</p>
          </div>

          <div className="space-y-6 my-auto">
            {/* Radial Gauge 1: Conveyor Throughput */}
            <div className="flex items-center space-x-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${conveyorPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-emerald-400 font-mono">{conveyorPercentage}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">Conveyor Throughput</h4>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{telemetry.conveyor_throughput.processed} / 300 Processed</p>
                <p className="text-[11px] text-zinc-500 mt-1">Speed: 38 m/min</p>
              </div>
            </div>

            {/* Radial Gauge 2: Sorting Arms / Actuator Status */}
            <div className="flex items-center space-x-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${actuatorPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-cyan-400 font-mono">{actuatorPercentage}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">Sorting Arms Status</h4>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">{telemetry.actuator_status.active_arms} / {telemetry.actuator_status.total_arms} Arms Active</p>
                <p className="text-[11px] text-zinc-500 mt-1">Pneumatic Calibration: Nominal</p>
              </div>
            </div>

            {/* Radial Gauge 3: Material Purity Index */}
            <div className="flex items-center space-x-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${purityPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-amber-400 font-mono">{purityPercentage}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">Material Purity Rate</h4>
                <p className="text-xs text-amber-400 font-mono mt-0.5">High Density Output</p>
                <p className="text-[11px] text-zinc-500 mt-1">Contamination &lt;0.5%</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
