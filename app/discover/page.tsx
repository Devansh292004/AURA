'use client';

import { Terminal, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORMS = [
  { name: "Codeforces", desc: "Weekly contests for algorithms.", diff: "Hard", for: "CP training", color: "text-red-500", bg: "bg-red-500/10" },
  { name: "AtCoder", desc: "High quality Japanese contest site.", diff: "Medium-Hard", for: "Math solving", color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Exercism", desc: "Mentorship for 67 languages.", diff: "Easy-Medium", for: "Learning languages", color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Project Euler", desc: "Mathematical programming challenges.", diff: "Varies", for: "Logic & Math", color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Kaggle", desc: "Data science and ML community.", diff: "Medium", for: "Data Science", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "Frontend Mentor", desc: "Real front-end projects.", diff: "Easy-Hard", for: "UI/UX skills", color: "text-emerald-500", bg: "bg-emerald-500/10" }
];

export default function DiscoverPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-black text-white mb-4">Discover Platforms</h1>
        <p className="text-gray-400 text-lg">Expand your coding horizons with these recommended platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLATFORMS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[2.5rem] p-10 glass-hover flex flex-col group"
          >
            <div className={`w-16 h-16 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
              <Terminal className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{p.name}</h3>
            <p className="text-gray-400 mb-6 flex-grow">{p.desc}</p>
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Difficulty</span><span className="text-gray-200">{p.diff}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Best For</span><span className="text-gray-200">{p.for}</span></div>
            </div>
            <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
              Integrate Node
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
