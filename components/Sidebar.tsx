"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Flame,
  BarChart3,
  Compass,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/" },
  { name: "Platforms", icon: Layers, href: "/platforms" },
  { name: "Streaks", icon: Flame, href: "/streaks" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Discover", icon: Compass, href: "/discover" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-72 border-r border-white/5 bg-[#0a0a0c] flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-xl font-black text-white">A</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">AURA</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              pathname === item.href
                ? "bg-white/5 text-white shadow-inner"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform duration-300 group-hover:scale-110",
              pathname === item.href ? "text-cyan-400" : ""
            )} />
            <span className="font-bold text-sm tracking-tight">{item.name}</span>
            {pathname === item.href && (
              <div className="ml-auto w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-[10px] text-gray-500 truncate">Pro Developer</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all text-xs font-bold"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
