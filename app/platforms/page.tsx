'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Code,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link2,
  X
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface ConnectedPlatform {
  id: string;
  platformName: string;
  username: string;
  lastSync: string;
}

const SUPPORTED_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: Github, color: 'text-white' },
  { id: 'leetcode', name: 'LeetCode', icon: Code, color: 'text-yellow-500' },
  { id: 'codechef', name: 'CodeChef', icon: Code, color: 'text-orange-500' },
  { id: 'hackerrank', name: 'HackerRank', icon: Code, color: 'text-green-500' },
];

export default function PlatformsPage() {
  const { user } = useAuth();
  const [connected, setConnected] = useState<ConnectedPlatform[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPlatforms();
    }
  }, [user]);

  const fetchPlatforms = async () => {
    try {
      const res = await fetch(`/api/data?userId=${user?.id}`, {
        headers: { 'x-user-id': user?.id || '' }
      });
      const data = await res.json();
      setConnected(data.platforms || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !username || !user) return;

    setLoading(true);
    try {
      const res = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          userId: user.id,
          platformName: selectedPlatform,
          username,
          profileUrl: `https://${selectedPlatform}.com/${username}`
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setUsername('');
        setSelectedPlatform('');
        fetchPlatforms();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this platform?')) return;

    try {
      await fetch(`/api/platforms?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || '' }
      });
      fetchPlatforms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Platforms</h1>
          <p className="text-gray-400">Connect your real coding profiles for live tracking.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Platform
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connected.map((platform) => {
          const config = SUPPORTED_PLATFORMS.find(p => p.id === platform.platformName);
          const Icon = config?.icon || Code;

          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={platform.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemove(platform.id)}
                  className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-white/5 ${config?.color || 'text-white'}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">{platform.platformName}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <span>@{platform.username}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Last Synced</span>
                  <span className="text-gray-300">
                    {platform.lastSync ? new Date(platform.lastSync).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Connected</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1a1c] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Connect Platform</h2>
              <p className="text-gray-400 mb-8">Select a coding platform and enter your real username.</p>

              <form onSubmit={handleAddPlatform} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Platform</label>
                  <div className="grid grid-cols-2 gap-3">
                    {SUPPORTED_PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlatform(p.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          selectedPlatform === p.id
                            ? 'bg-white/10 border-cyan-500/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        <p.icon className={`w-5 h-5 ${selectedPlatform === p.id ? p.color : ''}`} />
                        <span className="font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. octocat"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required
                  />
                </div>

                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 text-sm text-yellow-200/80">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>We fetch data strictly from public profiles. No credentials required.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedPlatform || !username}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Link Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
