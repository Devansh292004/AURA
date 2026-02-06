import {
  Trophy,
  Flame,
  Calendar,
  Layers,
  ExternalLink,
  Github
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Developer</h1>
        <p className="text-slate-400">Here's your coding activity overview.</p>
      </div>

      {/* Global Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Problems"
          value="452"
          icon={<Trophy className="text-yellow-500" />}
          trend="+12 this week"
        />
        <SummaryCard
          title="Current Streak"
          value="15 Days"
          icon={<Flame className="text-orange-500" />}
          trend="Personal best: 24"
        />
        <SummaryCard
          title="Weekly Activity"
          value="24.5 hrs"
          icon={<Calendar className="text-blue-500" />}
          trend="+5% from last week"
        />
        <SummaryCard
          title="Platforms"
          value="4"
          icon={<Layers className="text-purple-500" />}
          trend="2 more suggested"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connected Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlatformMiniCard
              name="GitHub"
              username="johndoe"
              stats="1,240 contributions"
              color="bg-slate-800"
            />
            <PlatformMiniCard
              name="LeetCode"
              username="jdoe_code"
              stats="342 solved"
              color="bg-orange-500/10 text-orange-500"
            />
            <PlatformMiniCard
              name="CodeChef"
              username="john_chef"
              stats="1850 rating"
              color="bg-amber-900/20 text-amber-600"
            />
            <PlatformMiniCard
              name="HackerRank"
              username="jdoe_hr"
              stats="5 star in Python"
              color="bg-green-500/10 text-green-500"
            />
          </div>
        </div>

        {/* Activity Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <Github size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Merged 3 PRs in <span className="text-primary">aura-dashboard</span></p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
                <ExternalLink size={16} className="text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs text-slate-500 font-medium">{trend}</span>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
}

function PlatformMiniCard({ name, username, stats, color }: { name: string, username: string, stats: string, color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center font-bold", color)}>
          {name[0]}
        </div>
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <p className="text-xs text-slate-500">@{username}</p>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-300">{stats}</p>
    </div>
  );
}
