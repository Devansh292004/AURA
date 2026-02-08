export interface Insight {
  type: 'achievement' | 'suggestion' | 'alert';
  message: string;
  category: 'technical' | 'consistency' | 'versatility';
}

export function generateInsights(data: any): Insight[] {
  if (!data || !data.platforms) return [];

  const insights: Insight[] = [];
  const totalSolved = data.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalSolved || 0), 0);
  const totalContribs = data.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalContributions || 0), 0);
  const streak = data.latestAnalytics?.streak || 0;
  const consistency = data.latestAnalytics?.consistencyScore || 0;

  const hasGitHub = data.platforms.some((p: any) => p.platformName === 'github');
  const hasLeetCode = data.platforms.some((p: any) => p.platformName === 'leetcode');

  if (streak >= 7) {
    insights.push({
      type: 'achievement',
      category: 'consistency',
      message: "ABSOLUTE UNIT. You're on a 7+ day streak. The consistency is impeccable—you're outperforming 95% of the field. Stay locked in. ⚡️"
    });
  }

  if (totalSolved > 100 && totalContribs < 20) {
    insights.push({
      type: 'suggestion',
      category: 'technical',
      message: "LEETCODE GOAT, PROJECT GHOST. Your logic is elite, but your GitHub is quiet. Start shipping project code to prove you can build real products. 🚀"
    });
  }

  if (!hasGitHub) {
    insights.push({
      type: 'alert',
      category: 'versatility',
      message: "Blind Spot. No GitHub account connected. Your open-source impact is invisible to the AURA engine."
    });
  }

  if (consistency < 30) {
    insights.push({
      type: 'suggestion',
      category: 'consistency',
      message: "VIBE CHECK: SLUMPING. Your activity frequency is dipping. Don't let the momentum die—a small daily commit keeps the AURA high. 📉"
    });
  }

  if (totalSolved > 300) {
    insights.push({
      type: 'achievement',
      category: 'technical',
      message: "MAIN CHARACTER ENERGY. 300+ problems solved. Your technical depth is reaching critical mass. Recruiters are going to love this. 💎"
    });
  }

  return insights;
}
