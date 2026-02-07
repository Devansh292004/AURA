# AURA | Developer Intelligence Dashboard

A centralized developer analytics platform that connects coding websites and transforms activity data into meaningful insights, streak tracking, and growth analytics.

## ✨ Features

- **Unified Dashboard**: View your global summary, current streaks, and weekly activity across all platforms.
- **Real-Time Integration**:
  - **GitHub**: Fetches real profile data, repository counts, and recent contributions via REST API.
  - **LeetCode**: GraphQL integration to fetch solved problem counts, ranking, and reputation.
  - **CodeChef & HackerRank**: Community API and public profile tracking for competitive programming stats.
- **Dynamic Syncing**: A centralized engine that ingests real-time data and computes consistency scores.
- **Detailed Analytics**: Growth trends, platform distribution, and difficulty breakdowns visualized with Recharts.
- **Streak Tracking**: Duolingo-style streak mechanics with a real-time activity heatmap.
- **Premium UI**: Polished dark-themed dashboard built with **Tailwind CSS 4**, **Next.js 15**, and **Framer Motion**.
- **Secure Authentication**: Built-in signup and login with password verification.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, TypeScript
- **Animations**: Framer Motion (Page transitions, Count-up stats)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **Persistence**: Local JSON Database (Safe-guarded for development)

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📊 Ingestion Strategy

AURA strictly uses **real-time data**. No mock statistics are used in the synchronization logic:
- GitHub data is pulled from the `api.github.com` public event stream.
- LeetCode data is pulled from their official GraphQL endpoint.
- Competitive programming stats use public mirrors of profile data.

## 📝 Project Structure

- `app/`: Next.js App Router (Pages & API)
- `components/`: UI Components (Sidebar, CountUp, LayoutWrapper)
- `lib/`: Core logic (API services, Database management, Streak calculation)
- `data/`: Local storage for the JSON database

---
*Built for the Developer Intelligence PRD V1.*
