"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Flame,
  BarChart3,
  Compass,
  Settings,
  Github
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/" },
  { name: "Platforms", icon: Layers, href: "/platforms" },
  { name: "Streaks", icon: Flame, href: "/streaks" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Discover", icon: Compass, href: "/discover" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          <Github className="text-cyan-400" />
          <span>AURA</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
