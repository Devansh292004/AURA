'use client';

import { useEffect, useState } from 'react';
import {
  Trophy,
  Flame,
  Layers,
  ExternalLink,
  Github,
  Code,
  RefreshCw,
  TrendingUp,
  Activity as ActivityIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from 'next/navigation';
import CountUp from '@/components/CountUp';
import TiltCard from '@/components/TiltCard';
import ReadinessRadar from '@/components/ReadinessRadar';
import { calculateReadiness } from '@/lib/readiness';
import { generateInsights } from '@/lib/insights';
import { Sparkles, BrainCircuit, AlertCircle, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/data?userId=${user?.id}`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <RefreshCw className="w-8 h-8 animate-spin" />
    </div>
  );

  const stats = data?.latestAnalytics || { streak: 0, consistencyScore: 0 };
  const totalSolved = data?.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalSolved || 0), 0) || 0;
  const totalContribs = data?.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalContributions || 0), 0) || 0;
  const readiness = calculateReadiness(data);
  const insights = generateInsights(data);

  return (
    <div className="p-8 space-y-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-600 tracking-tightest leading-none">
            AURA <span className="text-cyan-500">.</span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-lg">
            Elevate your engineering presence. Real-time intelligence from your digital coding footprint.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="group relative flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <RefreshCw className={cn("relative z-10 w-5 h-5", syncing && "animate-spin")} />
          <span className="relative z-10">{syncing ? 'Syncing Mastery...' : 'Sync Activity'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard title="Total Problems" value={totalSolved} icon={<Trophy className="text-yellow-500" />} trend="Across all platforms" />
          <SummaryCard title="Daily Streak" value={stats.streak} suffix=" Days" icon={<Flame className="text-orange-500" />} trend="Momentum tracking" />
          <SummaryCard title="Consistency" value={stats.consistencyScore} suffix="%" icon={<ActivityIcon className="text-cyan-500" />} trend="Last 30 day velocity" />
          <SummaryCard title="Total Contributions" value={totalContribs} icon={<Github className="text-purple-500" />} trend="Verified GitHub events" />
        </div>

        <TiltCard className="lg:col-span-1">
          <div className="glass rounded-[2rem] p-8 h-full relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">Internship Readiness</p>
            <div className="w-64 h-64 relative mb-6">
              <ReadinessRadar score={readiness} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-black text-white"><CountUp value={readiness.overall} />%</p>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase">Ready</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-[200px]">Proprietary score based on industry-standard engineering metrics.</p>
          </div>
        </TiltCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black flex items-center gap-4">
            <Layers className="w-8 h-8 text-blue-500" />
            Active Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.platforms.map((platform: any) => (
              <TiltCard key={platform.id}>
                <PlatformMiniCard
                  name={platform.platformName}
                  username={platform.username}
                  stats={platform.platformName === 'github'
                    ? `${platform.stats?.totalContributions || 0} contributions`
                    : `${platform.stats?.totalSolved || 0} problems solved`}
                  color={platform.platformName === 'github' ? "bg-white/10" : "bg-yellow-500/10 text-yellow-500"}
                  onClick={() => router.push(`/platforms/${platform.platformName}`)}
                />
              </TiltCard>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-black flex items-center gap-4 text-purple-500">
            <BrainCircuit className="w-8 h-8" />
            AURA Intelligence
          </h2>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div key={i} className="glass rounded-2xl p-6 relative overflow-hidden group">
                <div className={cn(
                  "absolute top-0 left-0 w-1 h-full",
                  insight.type === 'achievement' ? "bg-green-500" :
                  insight.type === 'alert' ? "bg-red-500" : "bg-cyan-500"
                )} />
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {insight.type === 'achievement' ? <CheckCircle className="text-green-500 w-5 h-5" /> :
                     insight.type === 'alert' ? <AlertCircle className="text-red-500 w-5 h-5" /> :
                     <Sparkles className="text-cyan-500 w-5 h-5" />}
                  </div>
                  <p className="text-sm font-medium text-gray-300 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
            {insights.length === 0 && (
              <p className="text-center py-8 text-gray-600 italic">Sync more nodes to generate intelligence.</p>
            )}
          </div>

          <h2 className="text-3xl font-black flex items-center gap-4 text-green-500">
            <TrendingUp className="w-8 h-8" />
            Live Pulse
          </h2>
          <div className="glass rounded-[2rem] p-8 space-y-6">
            {data?.activities.slice(0, 4).map((act: any, i: number) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 border border-white/10 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-all">
                  <ActivityIcon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-200">
                    <span className="text-white text-lg">{act.activityValue}</span> units on <span className="text-cyan-400 capitalize">{data.platforms.find((p: any) => p.id === act.platformId)?.platformName}</span>
                  </p>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">{act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, suffix = "", icon, trend }: { title: string, value: number, suffix?: string, icon: React.ReactNode, trend: string }) {
  return (
    <TiltCard>
      <div className="glass rounded-[2rem] p-8 glass-hover group relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-1000" />
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05] group-hover:border-white/20 transition-all duration-500">
            {icon}
          </div>
          <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">{trend}</span>
        </div>
        <div className="relative z-10">
          <p className="text-gray-400 font-medium">{title}</p>
          <h3 className="text-5xl font-black mt-2 tracking-tightest">
            <CountUp value={value} />{suffix}
          </h3>
        </div>
      </div>
    </TiltCard>
  );
}

function PlatformMiniCard({ name, username, stats, color, onClick }: { name: string, username: string, stats: string, color: string, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="glass rounded-[2rem] p-8 glass-hover cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl border border-white/5", color)}>
            {name === 'github' ? <Github size={28} /> : <Code size={28} />}
          </div>
          <div>
            <h4 className="text-2xl font-black text-white capitalize tracking-tight">{name}</h4>
            <p className="text-gray-500 font-medium">@{username}</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
          <ExternalLink size={18} className="text-cyan-400" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors">{stats}</p>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="w-1.5 h-1.5 bg-green-500/30 rounded-full" />
          <div className="w-1.5 h-1.5 bg-green-500/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
