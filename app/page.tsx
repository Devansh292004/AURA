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

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome back. Real-time tracking across all your coding platforms.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium"
        >
          <RefreshCw className={cn("w-4 h-4", syncing && "animate-spin")} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Solved"
          value={totalSolved}
          icon={<Trophy className="text-yellow-500" />}
          trend="Cumulative"
        />
        <SummaryCard
          title="Current Streak"
          value={stats.streak}
          suffix=" Days"
          icon={<Flame className="text-orange-500" />}
          trend="Across all platforms"
        />
        <SummaryCard
          title="Consistency"
          value={stats.consistencyScore}
          suffix="%"
          icon={<ActivityIcon className="text-cyan-500" />}
          trend="Last 30 days"
        />
        <SummaryCard
          title="Total Contribs"
          value={totalContribs}
          icon={<Github className="text-purple-500" />}
          trend="GitHub activity"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Connected Platforms
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data?.platforms.map((platform: any) => (
              <PlatformMiniCard
                key={platform.id}
                name={platform.platformName}
                username={platform.username}
                stats={platform.platformName === 'github'
                  ? `${platform.stats?.totalContributions || 0} contribs`
                  : `${platform.stats?.totalSolved || 0} solved`}
                color={platform.platformName === 'github' ? "bg-white/10" : "bg-yellow-500/10 text-yellow-500"}
                onClick={() => router.push(`/platforms/${platform.platformName}`)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {data?.activities.slice(0, 5).map((act: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                  <ActivityIcon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {act.activityValue} activities on <span className="text-blue-400 capitalize">{data.platforms.find((p: any) => p.id === act.platformId)?.platformName}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">{act.date}</p>
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{trend}</span>
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-black mt-1 tracking-tight">
          <CountUp value={value} />{suffix}
        </h3>
      </div>
    </div>
  );
}

function PlatformMiniCard({ name, username, stats, color, onClick }: { name: string, username: string, stats: string, color: string, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg", color)}>
            {name === 'github' ? <Github size={20} /> : <Code size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-white capitalize">{name}</h4>
            <p className="text-xs text-gray-500">@{username}</p>
          </div>
        </div>
        <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-sm font-bold text-gray-300">{stats}</p>
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
