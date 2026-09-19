import React, { useState } from 'react';
import { Cpu, Activity, Wifi, ShieldCheck, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export const SensorsPage: React.FC = () => {
  const [sensors] = useState([
    { id: 'SN-01', name: 'Science Block Bin Cluster SB-04', type: 'NIR Optical & Weight', status: 'Active', latency: '8ms', battery: '98%' },
    { id: 'SN-02', name: 'Engineering Hub Conveyor Belt #1', type: 'Vibration Telemetry', status: 'Active', latency: '12ms', battery: '100%' },
    { id: 'SN-03', name: 'Library Recycling Depot L-02', type: 'Volumetric Ultrasonic', status: 'Active', latency: '14ms', battery: '92%' },
    { id: 'SN-04', name: 'Dining Hall Organics Digester O1', type: 'Temperature & Methane', status: 'Active', latency: '11ms', battery: '95%' },
    { id: 'SN-05', name: 'Student Union E-Waste Vault E4', type: 'Inductive Metallic', status: 'Active', latency: '9ms', battery: '99%' },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>IoT Sensor Hub & Wireless Mesh Telemetry</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Live monitoring of 12 campus edge sensor nodes and pneumatic actuator valves.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" /> Mesh Status: 100% Online
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((s) => (
          <div key={s.id} className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-4 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-emerald-400 bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-800">
                {s.id}
              </span>
              <span className="flex items-center text-xs font-semibold text-emerald-400 gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {s.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{s.name}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{s.type}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono border-t border-zinc-800 pt-3 text-zinc-400">
              <span>Latency: <strong className="text-white">{s.latency}</strong></span>
              <span>Power: <strong className="text-emerald-400">{s.battery}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
