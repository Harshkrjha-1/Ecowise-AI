import React, { useState, useEffect, useRef } from 'react';
import { scannerApi } from '../services/api';
import { ScannerResult, TerminalLog } from '../types/app';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { 
  Scan, Upload, Sliders, Terminal, CheckCircle2, ShieldCheck, Sparkles, BookOpen, ChevronDown, ChevronUp, Play, Pause, Trash2, Cpu
} from 'lucide-react';

interface DiagnosticDataPoint {
  time: string;
  vibration: number;
  power: number;
}

export const ScannerPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('pet_bottle');
  const [scannerResult, setScannerResult] = useState<ScannerResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGraniteRagOpen, setIsGraniteRagOpen] = useState<boolean>(true);
  
  // Interactive Sliders State
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [conveyorSpeed, setConveyorSpeed] = useState<number>(45); // m/min
  
  // Terminal log stream state
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isLogPaused, setIsLogPaused] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Diagnostic Chart State
  const [chartData, setChartData] = useState<DiagnosticDataPoint[]>([]);

  // Load preset scanner details
  useEffect(() => {
    const fetchPreset = async () => {
      const res = await scannerApi.analyzePreset(selectedPreset);
      setScannerResult(res);
      addTerminalLog('DETECT', `Scanned item: ${res.item_name} with confidence ${(res.confidence * 100).toFixed(1)}%.`);
    };
    fetchPreset();
  }, [selectedPreset]);

  // Initial diagnostic chart population
  useEffect(() => {
    const initialSeries: DiagnosticDataPoint[] = [];
    const now = new Date();
    for (let i = 10; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 2000);
      initialSeries.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        vibration: parseFloat((1.2 + Math.random() * 0.8).toFixed(2)),
        power: parseFloat((320 + Math.random() * 40).toFixed(1)),
      });
    }
    setChartData(initialSeries);
  }, []);

  // Oscillation telemetry updates affected by Conveyor Speed slider
  useEffect(() => {
    const intervalMs = Math.max(500, 3000 - conveyorSpeed * 25);
    const interval = setInterval(() => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const vibVal = parseFloat((1.0 + Math.random() * (conveyorSpeed / 30)).toFixed(2));
      const powerVal = parseFloat((300 + (conveyorSpeed * 2.5) + Math.random() * 20).toFixed(1));

      setChartData((prev) => {
        const next = [...prev.slice(1), { time: nowStr, vibration: vibVal, power: powerVal }];
        return next;
      });

      if (!isLogPaused) {
        if (Math.random() > 0.4) {
          const events = [
            `Optical sensor NIR scan completed on belt section B-${Math.floor(Math.random() * 4) + 1}`,
            `Actuator arm speed set to ${conveyorSpeed} m/min`,
            `Telemetry sync: Vibration ${vibVal} mm/s, Power ${powerVal} W`,
            `Granite RAG grounding check confirmed rule #GR-${Math.floor(Math.random() * 500) + 100}`
          ];
          const randomEv = events[Math.floor(Math.random() * events.length)];
          addTerminalLog('INFO', randomEv);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [conveyorSpeed, isLogPaused]);

  const addTerminalLog = (level: 'INFO' | 'WARN' | 'DETECT' | 'SYSTEM', message: string) => {
    const newLog: TerminalLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level,
      message,
    };
    setLogs((prev) => [...prev.slice(-40), newLog]);
  };

  useEffect(() => {
    if (!isLogPaused) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLogPaused]);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        addTerminalLog('SYSTEM', `Uploaded custom image: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Demo Presets Definition
  const presets = [
    { key: 'pet_bottle', label: 'PET Plastic Bottle', image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80' },
    { key: 'aluminum_can', label: 'Aluminum Can', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80' },
    { key: 'ewaste', label: 'E-Waste PCB', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80' },
    { key: 'cardboard', label: 'Cardboard Box', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80' },
    { key: 'organic', label: 'Organic Food Waste', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80' },
  ];

  const currentPresetData = presets.find((p) => p.key === selectedPreset) || presets[0];
  const displayImage = uploadedImage || currentPresetData.image;
  const isConfidenceVisible = scannerResult ? (scannerResult.confidence * 100) >= confidenceThreshold : true;

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Scan className="w-5 h-5 text-emerald-400" />
            <span>Smart Waste Scanner & Visual Diagnostics Module</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time multimodal classification backed by IBM Granite RAG grounding & actuator telemetry.
          </p>
        </div>

        {/* Demo Preset Quick Selector Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider shrink-0">Demo Presets:</span>
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => {
                setUploadedImage(null);
                setSelectedPreset(p.key);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                selectedPreset === p.key && !uploadedImage
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Visual Recognition (2 cols) + Diagnostics Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2: Live Visual Recognition Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-base font-bold text-white tracking-tight">Live Vision Overlay & Bounding Detection</h3>
              </div>
              
              {/* File Uploader Button */}
              <label className="cursor-pointer px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 border border-zinc-700">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Custom Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Canvas / Bounding Box Display Box */}
            <div className="relative w-full h-[360px] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center group">
              <img
                src={displayImage}
                alt="Scanner Feed"
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
              />

              {/* Grid scanning effect overlays */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-lg shadow-emerald-500/50" />

              {/* Dynamic Canvas Bounding Box */}
              {scannerResult && isConfidenceVisible && (
                <div
                  className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500 flex flex-col justify-between p-2 pointer-events-none"
                  style={{
                    left: `${scannerResult.bounding_box.x}%`,
                    top: `${scannerResult.bounding_box.y}%`,
                    width: `${scannerResult.bounding_box.width}%`,
                    height: `${scannerResult.bounding_box.height}%`,
                  }}
                >
                  {/* Neon Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-300" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-300" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-300" />

                  {/* Bounding Box Label Badge */}
                  <div className="self-start px-2.5 py-1 bg-zinc-950/90 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold rounded shadow-md backdrop-blur-md flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{scannerResult.item_name} [Conf: {(scannerResult.confidence * 100).toFixed(0)}%]</span>
                  </div>

                  <div className="self-end text-[10px] font-mono text-emerald-300 bg-zinc-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    NIR Spectrum Match: Active
                  </div>
                </div>
              )}

              {!isConfidenceVisible && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="text-center text-amber-400 bg-zinc-900 border border-amber-500/30 p-4 rounded-xl max-w-xs">
                    <Sliders className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Classification Below AI Threshold</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Lower the threshold slider to view this item bounding box.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Categorization & Disposal Advisory Cards */}
            {scannerResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Classification Badge</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-bold font-mono">
                      {scannerResult.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">Confidence: {(scannerResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Disposal Destination Advice</span>
                  <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                    {scannerResult.destination}
                  </p>
                </div>
              </div>
            )}

            {/* IBM Granite RAG Grounding Explanation Box */}
            {scannerResult && (
              <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-xl overflow-hidden shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsGraniteRagOpen(!isGraniteRagOpen)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/40">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        IBM Granite RAG Grounding Citation
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                          Ref: #{scannerResult.ibm_granite_rag.ref_id}
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate">
                        {scannerResult.ibm_granite_rag.citation}
                      </p>
                    </div>
                  </div>
                  {isGraniteRagOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </button>

                {isGraniteRagOpen && (
                  <div className="px-4 pb-4 border-t border-zinc-800/80 pt-3 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Granite Retrieval Confidence Score:
                      </span>
                      <span className="text-white font-bold">{(scannerResult.ibm_granite_rag.confidence_score * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 font-mono leading-relaxed">
                      "{scannerResult.ibm_granite_rag.explanation}"
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Column 3: Real-time Diagnostics Side Panel */}
        <div className="space-y-6">
          
          {/* Diagnostic Oscillation Telemetry Chart */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Sensor Oscillation & Telemetry</span>
              </h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-800">
                Vibration / Power
              </span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#27272A" />
                  <XAxis dataKey="time" stroke="#71717A" fontSize={9} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={9} domain={['auto', 'auto']} tickLine={false} />
                  <Line type="monotone" dataKey="vibration" stroke="#06B6D4" strokeWidth={2} dot={false} name="Vibration (mm/s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Motor Vibration: <strong className="text-cyan-400">{chartData[chartData.length - 1]?.vibration || 1.4} mm/s</strong></span>
              <span>Power Load: <strong className="text-emerald-400">{chartData[chartData.length - 1]?.power || 340} W</strong></span>
            </div>
          </div>

          {/* Interactive Sliders Panel */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Interactive Operational Sliders</span>
            </h3>

            {/* Slider 1: AI Classification Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-zinc-300 font-semibold">AI Classification Threshold</label>
                <span className="font-mono text-emerald-400 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500">Filter out low-confidence detection boxes in real time.</p>
            </div>

            {/* Slider 2: Arm Speed / Conveyor Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-zinc-300 font-semibold">Arm Speed / Conveyor Rate</label>
                <span className="font-mono text-cyan-400 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {conveyorSpeed} m/min
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={conveyorSpeed}
                onChange={(e) => setConveyorSpeed(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500">Dynamically alters telemetry update frequency and throughput rate.</p>
            </div>
          </div>

          {/* Live Terminal Log Stream Window */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Live Diagnostics Terminal Log</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsLogPaused(!isLogPaused)}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition"
                  title={isLogPaused ? 'Resume Scroll' : 'Pause Scroll'}
                >
                  {isLogPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition"
                  title="Clear Terminal Logs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-44 overflow-y-auto space-y-1.5 pr-2 text-[11px] leading-relaxed">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2">
                  <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-bold shrink-0 ${
                      log.level === 'DETECT'
                        ? 'text-emerald-400'
                        : log.level === 'WARN'
                        ? 'text-amber-400'
                        : log.level === 'SYSTEM'
                        ? 'text-sky-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-zinc-300 break-words">{log.message}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
