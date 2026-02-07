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
      message: "Legendary Momentum. You've maintained a 7+ day streak, putting you in the top 5% of consistent learners."
    });
  }

  if (totalSolved > 100 && totalContribs < 20) {
    insights.push({
      type: 'suggestion',
      category: 'technical',
      message: "Algorithm Heavy. Your LeetCode profile is strong, but recruiters want to see build-activity. Try pushing more projects to GitHub."
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
      message: "Vulnerability Detected. Your activity frequency is dipping. A 15-minute daily commit can stabilize your growth curve."
    });
  }

  if (totalSolved > 300) {
    insights.push({
      type: 'achievement',
      category: 'technical',
      message: "Elite Problem Solver. 300+ problems solved signals advanced data structure mastery."
    });
  }

  return insights;
}
