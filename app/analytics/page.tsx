'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '@/components/AuthProvider';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import CountUp from '@/components/CountUp';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;

  const platformDistribution = data?.platforms.map((p: any) => ({
    name: p.platformName,
    value: p.platformName === 'github' ? (p.stats?.totalContributions || 0) : (p.stats?.totalSolved || 0)
  })) || [];

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Growth Analytics</h1>
        <p className="text-gray-400">Deep dive into your coding performance and consistency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" /> Activity Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.history.slice().reverse()}>
                <defs>
                  <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="streak" stroke="#8b5cf6" fill="url(#colorStreak)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-cyan-400" /> Platform Contribution
          </h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {platformDistribution.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid #ffffff10' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Consistency Score: <CountUp value={data?.latestAnalytics?.consistencyScore || 0} />%</h2>
          <p className="text-gray-400">Based on your active days and frequency over the last 30 days.</p>
        </div>
      </div>
    </div>
  );
}
