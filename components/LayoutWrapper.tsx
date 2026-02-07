'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { AuthProvider } from './AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPublicProfile = pathname?.startsWith('/u/');

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#0a0a0c] text-slate-200">
        {!isAuthPage && !isPublicProfile && <Sidebar />}
        <main className={(isAuthPage || isPublicProfile) ? "w-full" : "flex-1 overflow-y-auto"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AuthProvider>
  );
}
