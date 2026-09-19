import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [docs] = useState([
    { id: 'GR-883', title: 'Campus Circular Economy Guideline Sec 4.2', category: 'Polymer Sorting', summary: 'Defines optical NIR reflectance thresholds for food-grade PET #1 and mechanical pelletizing standards.', date: '2026-01-15' },
    { id: 'GR-419', title: 'Zero-Waste Campus Operations Standard ISO 14001:2024', category: 'Metallic Processing', summary: 'Guidelines for 3004-alloy aluminum melt extrusion streams and 95% energy recovery requirements.', date: '2025-11-20' },
    { id: 'GR-905', title: 'Campus Hazardous Waste Protocols & EPA Compliance Framework', category: 'Hazardous E-Waste', summary: 'Mandatory quarantine rules for copper, solder, and PCB component reclamation.', date: '2026-03-02' },
    { id: 'GR-112', title: 'Sustainable Packaging & Paper Fiber Policy v3.1', category: 'Cellulose Hydropulping', summary: 'Cardboard moisture limits (max 8%) and pulp slurry consistency ratios.', date: '2025-09-10' },
  ]);

  const filteredDocs = docs.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>IBM Granite Grounded Knowledge Base</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Search campus sustainability regulations, circular economy standards, and EPA compliance documents.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search regulations or citations..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                Ref #{doc.id}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">{doc.date}</span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">{doc.title}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{doc.summary}</p>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
              <span className="font-mono text-emerald-400 text-[11px]">{doc.category}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold cursor-pointer hover:underline">
                View Citation <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
