import React, { useState, useEffect } from 'react';
import { analyticsApi, agentApi } from '../services/api';
import { AnalyticsSummary, EcoActionAdvisory } from '../types/app';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  BarChart3, Download, Calendar, AlertTriangle, CheckCircle2, Edit3, XCircle, FileText, Check, ShieldAlert, Sparkles, Filter, Printer
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('weekly');
  const [summaryData, setSummaryData] = useState<AnalyticsSummary | null>(null);
  const [advisory, setAdvisory] = useState<EcoActionAdvisory | null>(null);

  // Workflow State
  const [showModifyModal, setShowModifyModal] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [modifiedKpiText, setModifiedKpiText] = useState<string>('Target contamination < 1.0%, recovery +160kg PET');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const summary = await analyticsApi.getSummary(dateRange);
      const adv = await agentApi.getAdvisory();
      setSummaryData(summary);
      setAdvisory(adv);
    };
    loadData();
  }, [dateRange]);

  // Download CSV Report Function
  const handleDownloadCSV = () => {
    if (!summaryData) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Building,Electricity (kWh),Water Usage (Liters)\n';
    summaryData.building_usage.forEach((b) => {
      csvContent += `"${b.building}",${b.electricity_kwh},${b.water_liters}\n`;
    });
    csvContent += '\nMaterial,Purity Rate (%)\n';
    summaryData.material_purity.forEach((m) => {
      csvContent += `"${m.name}",${m.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EcoWise_Resource_Report_${dateRange}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccessMsg('CSV Resource Analytics Report generated and downloaded successfully!');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Workflow Decision Handler
  const handleDecision = async (status: 'approved' | 'modified' | 'rejected') => {
    if (!advisory) return;
    const res = await agentApi.submitDecision(
      advisory.action_id,
      status,
      status === 'modified' ? modifiedKpiText : undefined
    );
    setAdvisory((prev) => (prev ? { ...prev, status } : prev));
    setShowModifyModal(false);
    setActionSuccessMsg(`Workflow updated: Action Plan successfully marked as '${status.toUpperCase()}'.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  if (!summaryData || !advisory) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-emerald-400 font-medium">Loading Resource Analytics & Agent Plan...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Action Success Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Campus Resource Analytics & EcoAction Agent</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Building-wise energy consumption, material purity tracking, and Human-in-the-Loop decision support.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Date Range Selector */}
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-200 py-1 px-2 focus:outline-none cursor-pointer"
            >
              <option value="last_3_hours" className="bg-zinc-900 text-white">Last 3 Hours</option>
              <option value="weekly" className="bg-zinc-900 text-white">Weekly Overview</option>
              <option value="monthly" className="bg-zinc-900 text-white">Monthly Aggregate</option>
            </select>
          </div>

          {/* Export Report Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Report</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF Executive Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Multi-bar Historical Comparison Chart (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Building-Wise Resource Consumption</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Historical comparison for Electricity (kWh) & Water Usage (Liters)</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              5 Primary Campus Sectors
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData.building_usage} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="building" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '0.75rem', color: '#FFF' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="electricity_kwh" fill="#10B981" radius={[4, 4, 0, 0]} name="Electricity (kWh)" />
                <Bar dataKey="water_liters" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Water Usage (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Material Purity Donut / Pie Chart (1 col) */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="border-b border-zinc-800 pb-3 mb-2">
            <h3 className="text-base font-bold text-white tracking-tight">Material Purity Rate</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Recyclable stream composition purity (%)</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData.material_purity}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {summaryData.material_purity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '0.75rem', color: '#FFF' }}
                  itemStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-white font-mono">98.7%</span>
              <p className="text-[10px] text-zinc-400 font-semibold uppercase">Avg Purity</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-zinc-800">
            {summaryData.material_purity.map((m) => (
              <div key={m.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                <span className="text-zinc-300 truncate">{m.name}: <strong className="text-white">{m.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* EcoAction Agent Decision Support Panel */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">EcoAction Agent Decision Support Panel</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Ref: {advisory.action_id}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Human-in-the-Loop autonomous agent intervention protocol for campus resource anomalies.
              </p>
            </div>
          </div>

          {/* Current Action Status Badge */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            <span className="text-xs text-zinc-400 font-semibold">Workflow State:</span>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold uppercase border ${
                advisory.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : advisory.status === 'modified'
                  ? 'bg-sky-950 text-sky-300 border-sky-700'
                  : advisory.status === 'rejected'
                  ? 'bg-rose-950 text-rose-300 border-rose-700'
                  : 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
              }`}
            >
              {advisory.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Anomaly Alert Card */}
        <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-200">{advisory.anomaly.title}</h4>
            <p className="text-xs text-amber-300/80 mt-1 font-mono">
              Location: <strong>{advisory.anomaly.location}</strong> • Detected at: <strong>{advisory.anomaly.detected_at}</strong> • Variance: <strong className="text-rose-400">{advisory.anomaly.variance}</strong>
            </p>
          </div>
        </div>

        {/* Decision Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Section 1: Root Cause Analysis */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Root Cause Analysis</h5>
            <p className="text-xs text-zinc-200 leading-relaxed font-mono">
              "{advisory.root_cause_analysis}"
            </p>
          </div>

          {/* Section 2: Recommended Interventions */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Recommended Interventions</h5>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {advisory.interventions.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Target KPIs */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
            <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target Operational KPIs</h5>
            <div className="space-y-1 text-xs font-mono text-emerald-400">
              <p>Contamination: <strong className="text-white">{advisory.target_kpis.contamination_reduction}</strong></p>
              <p>PET Recovery: <strong className="text-white">{advisory.target_kpis.pet_recovery}</strong></p>
              <p>Efficiency: <strong className="text-white">{advisory.target_kpis.energy_efficiency}</strong></p>
              {advisory.target_kpis.custom_note && (
                <p className="text-sky-300 text-[11px] pt-1 border-t border-zinc-800">
                  Custom Parameter: {advisory.target_kpis.custom_note}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Human-in-the-Loop Action Buttons */}
        <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-end gap-3">
          <span className="text-xs text-zinc-400 font-medium mr-auto">
            Human Operator Authorization Required:
          </span>

          <button
            type="button"
            onClick={() => handleDecision('rejected')}
            disabled={advisory.status === 'rejected'}
            className="px-4 py-2 bg-zinc-950 hover:bg-rose-950 text-rose-300 border border-rose-800/80 hover:border-rose-600 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModifyModal(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-sky-300 border border-sky-800/80 hover:border-sky-600 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Modify Plan</span>
          </button>

          <button
            type="button"
            onClick={() => handleDecision('approved')}
            disabled={advisory.status === 'approved'}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Approve Action</span>
          </button>
        </div>

      </div>

      {/* Modify Plan Parameter Modal */}
      {showModifyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Modify EcoAction Intervention Plan</h3>
            </div>

            <p className="text-xs text-zinc-400">
              Tweak target operational parameters or override actuator rules prior to dispatch.
            </p>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase">
                Custom Target KPI / Override Note
              </label>
              <textarea
                rows={3}
                value={modifiedKpiText}
                onChange={(e) => setModifiedKpiText(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModifyModal(false)}
                className="w-1/2 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecision('modified')}
                className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition"
              >
                Save & Approve Modified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Executive Report Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Executive Resource Report (PDF Preview)</h3>
                  <p className="text-xs text-zinc-400">Campus Sustainability Operations • {dateRange.toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setShowPdfModal(false)} className="text-zinc-400 hover:text-white text-lg">✕</button>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl font-mono text-xs space-y-4 text-zinc-300 max-h-[60vh] overflow-y-auto">
              <div className="text-center border-b border-zinc-800 pb-3">
                <h4 className="text-sm font-bold text-emerald-400 uppercase">EcoWise AI Executive Telemetry Summary</h4>
                <p className="text-[11px] text-zinc-500 mt-1">Generated: {new Date().toLocaleString()}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">Building Consumption Telemetry:</strong>
                {summaryData.building_usage.map((b) => (
                  <div key={b.building} className="flex justify-between border-b border-zinc-900 py-1">
                    <span>{b.building}:</span>
                    <span>{b.electricity_kwh} kWh | {b.water_liters} L</span>
                  </div>
                ))}
              </div>

              <div>
                <strong className="text-white block mb-1">Material Stream Purity:</strong>
                {summaryData.material_purity.map((m) => (
                  <div key={m.name} className="flex justify-between border-b border-zinc-900 py-1">
                    <span>{m.name}:</span>
                    <span>{m.value}%</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-zinc-400 text-[11px]">
                Report Certified by EcoWise AI Autonomous Engine v2.4 • Campus Sustainability Compliance standard ISO 14001:2024.
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
