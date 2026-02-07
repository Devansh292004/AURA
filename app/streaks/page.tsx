'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import CountUp from '@/components/CountUp';

export default function StreaksPage() {
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Streaks...</div>;

  const currentStreak = data?.latestAnalytics?.streak || 0;
  const longestStreak = Math.max(...(data?.history.map((h: any) => h.streak) || [0]));
  const activeDates = data?.activities.map((a: any) => a.date) || [];

  const today = new Date();
  const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Streaks</h1>
        <p className="text-gray-400">Your coding momentum, strictly tracked in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox icon={<Flame className="text-orange-500" />} label="Current Streak" value={currentStreak} suffix=" Days" />
        <StatBox icon={<Trophy className="text-yellow-500" />} label="Longest Streak" value={longestStreak} suffix=" Days" />
        <StatBox icon={<Calendar className="text-blue-500" />} label="Active Days" value={activeDates.length} />
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
        <h3 className="text-xl font-bold mb-8">Activity Heatmap</h3>
        <div className="flex flex-wrap gap-2">
          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isActive = activeDates.includes(dateStr);
            return (
              <div key={i} className={cn("w-8 h-8 rounded-md transition-all", isActive ? "bg-cyan-500 shadow-lg shadow-cyan-500/20" : "bg-white/5")} title={dateStr} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, suffix = "" }: { icon: any, label: string, value: number, suffix?: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">{label}</p>
      <p className="text-5xl font-black text-white mt-2"><CountUp value={value} />{suffix}</p>
    </div>
  );
}
