'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trophy, Flame, Activity, Github, Code, Globe, User, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { calculateReadiness } from '@/lib/readiness';
import ReadinessRadar from '@/components/ReadinessRadar';
import CountUp from '@/components/CountUp';
import { cn } from '@/lib/utils';

export default function PublicProfile() {
  const params = useParams();
  const emailPrefix = params.username as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a public endpoint /api/profile/[username]
    // For now, we search for the user in our mock DB by email match
    fetchData();
  }, [emailPrefix]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/data?username=${emailPrefix}`);
      const d = await res.json();
      if (d.error) {
         setData(null);
      } else {
         setData(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-cyan-500 font-black animate-pulse text-2xl tracking-[1em]">LOADING...</div>;

  if (!data) return (
    <div className="h-screen flex flex-col items-center justify-center text-white p-4 text-center">
      <AlertCircle size={64} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-black mb-4">PROFILE NOT FOUND</h1>
      <p className="text-gray-500 max-w-md">The developer profile you are looking for does not exist or has not been activated yet.</p>
    </div>
  );

  const readiness = calculateReadiness(data);
  const totalSolved = data?.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalSolved || 0), 0) || 0;
  const totalContribs = data?.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalContributions || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-cyan-500/30 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />

        <div className="relative z-10 text-center px-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 mx-auto mb-8 shadow-2xl shadow-cyan-500/20">
            <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
              <User size={64} className="text-gray-700" />
            </div>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tightest mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {emailPrefix.toUpperCase()} <span className="text-cyan-500 text-glow">.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-black tracking-tightest uppercase italic">The Engineering Aura is Impeccable</p>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {data?.platforms.map((p: any) => (
              <a key={p.id} href={p.profileUrl} target="_blank" rel="noreferrer" className="glass px-6 py-3 rounded-full flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                {p.platformName === 'github' ? <Github size={18} /> : <Code size={18} />}
                <span className="font-bold text-sm">@{p.username}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-20">
        {/* Left Stats */}
        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatItem label="Cumulative Problems" value={totalSolved} icon={<Trophy className="text-yellow-500" />} />
            <StatItem label="Verified Contribs" value={totalContribs} icon={<Github className="text-purple-500" />} />
            <StatItem label="Active Momentum" value={`${data?.latestAnalytics?.streak || 0} Days`} icon={<Flame className="text-orange-500" />} />
          </div>

          <div className="glass rounded-[3rem] p-12 relative overflow-hidden">
            <h2 className="text-3xl font-black text-white mb-12">Engineering DNA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="h-64">
                <ReadinessRadar score={readiness} />
              </div>
              <div className="space-y-8">
                {readiness.metrics.map((m, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black text-gray-500 uppercase tracking-widest">{m.label}</span>
                      <span className="text-xl font-bold text-white">{m.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-12 pt-20 lg:pt-0">
          <div className="glass rounded-[3rem] p-10 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Aura Readiness</h3>
            <div className="text-7xl font-black text-white mb-2 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]"><CountUp value={readiness.overall} />%</div>
            <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-8 text-glow italic">Absolute W</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              AURA has verified this profile against real-time data from 4 major platforms. Metrics confirm top-tier consistency and technical aptitude.
            </p>
            <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              <Download size={18} /> DOWNLOAD ASSET
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-white px-4 flex items-center gap-3">
              <Activity className="text-green-500" /> RECENT PULSE
            </h3>
            <div className="space-y-4">
              {data?.activities.slice(0, 3).map((a: any, i: number) => (
                <div key={i} className="glass px-8 py-6 rounded-[2rem] flex items-center justify-between group cursor-default">
                   <div>
                     <p className="text-white font-bold">{a.activityValue} <span className="text-gray-500 text-sm">Activities</span></p>
                     <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">{a.date}</p>
                   </div>
                   <ExternalLink size={14} className="text-gray-800 group-hover:text-cyan-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-40 text-center">
         <p className="text-gray-700 font-black tracking-[0.5em] text-[10px] uppercase">POWERED BY AURA INTELLIGENCE</p>
      </footer>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string, value: any, icon: any }) {
  return (
    <div className="glass px-8 py-10 rounded-[2.5rem] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
        {icon}
      </div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">{label}</p>
      <p className="text-4xl font-black text-white tracking-tightest">
        {typeof value === 'number' ? <CountUp value={value} /> : value}
      </p>
    </div>
  );
}
