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
    <div className="p-12 max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-5xl font-black text-white mb-4 tracking-tightest">Momentum <span className="text-orange-500">.</span></h1>
        <p className="text-gray-500 text-lg">Strict real-time tracking of your digital consistency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatBox icon={<Flame className="text-orange-500" />} label="Current Streak" value={currentStreak} suffix=" Days" />
        <StatBox icon={<Trophy className="text-yellow-500" />} label="Longest Streak" value={longestStreak} suffix=" Days" />
        <StatBox icon={<Calendar className="text-blue-500" />} label="Active Days" value={activeDates.length} />
      </div>

      <div className="glass rounded-[3rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20" />
        <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Neural Heatmap
        </h3>
        <div className="flex flex-wrap gap-3">
          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isActive = activeDates.includes(dateStr);
            return (
              <div
                key={i}
                className={cn(
                  "w-10 h-10 rounded-xl transition-all duration-500 border border-white/5",
                  isActive
                    ? "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] border-cyan-400/50 scale-105"
                    : "bg-white/[0.02] hover:bg-white/[0.05]"
                )}
                title={dateStr}
              />
            );
          })}
        </div>
        <div className="mt-12 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-white/[0.02] rounded-sm" />
             <span>DORMANT</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-cyan-500 rounded-sm" />
             <span>ACTIVE</span>
           </div>
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
