'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Github,
  Code,
  Trophy,
  Activity as ActivityIcon,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Star,
  GitCommit,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import CountUp from '@/components/CountUp';

export default function PlatformDetail() {
  const params = useParams();
  const platformName = params.platform as string;
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [platformData, setPlatformData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, platformName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data?userId=${user?.id}`);
      const data = await res.json();
      const platform = data.platforms.find((p: any) => p.platformName === platformName);
      setPlatformData(platform);
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
    <div className="flex items-center justify-center h-screen bg-[#0a0a0c] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );

  if (!platformData) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0c] text-white p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Platform not connected</h1>
      <button onClick={() => router.push('/platforms')} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
        Connect Platforms
      </button>
    </div>
  );

  const stats = platformData.stats || {};
  const COLORS = ['#22c55e', '#eab308', '#ef4444'];
  const pieData = platformName === 'leetcode' ? [
    { name: 'Easy', value: stats.easySolved || 0 },
    { name: 'Medium', value: stats.mediumSolved || 0 },
    { name: 'Hard', value: stats.hardSolved || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {platformName === 'github' ? <Github className="w-8 h-8" /> : <Code className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold capitalize">{platformName}</h1>
              <p className="text-gray-400">@{platformData.username}</p>
            </div>
          </div>
          <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl transition-all disabled:opacity-50">
            <RefreshCw className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {platformName === 'github' ? (
              <>
                <StatCard label="Contributions" value={stats.totalContributions || 0} icon={<GitCommit className="text-green-500" />} />
                <StatCard label="Repositories" value={stats.repoCount || 0} icon={<Star className="text-yellow-500" />} />
                <StatCard label="Followers" value={stats.followers || 0} icon={<Trophy className="text-purple-500" />} />
              </>
            ) : platformName === 'leetcode' ? (
              <>
                <StatCard label="Solved" value={stats.totalSolved || 0} icon={<Trophy className="text-yellow-500" />} />
                <StatCard label="Global Rank" value={stats.ranking || 0} icon={<ActivityIcon className="text-cyan-500" />} />
                <StatCard label="Reputation" value={stats.reputation || 0} icon={<Star className="text-green-500" />} />
              </>
            ) : (
              <StatCard label="Status" value="Connected" icon={<CheckCircle2 className="text-green-500" />} />
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-cyan-400" /> Activity Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformName === 'github' ? stats.contributions : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickFormatter={d => d.split('-')[2]} />
                  <YAxis stroke="#ffffff40" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid #ffffff10' }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {platformName === 'leetcode' && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-6">Difficulty Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid #ffffff10' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: any, icon: any }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? <CountUp value={value} /> : value}
      </div>
    </div>
  );
}
