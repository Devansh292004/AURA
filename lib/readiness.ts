export interface ReadinessScore {
  overall: number;
  technical: number;
  consistency: number;
  versatility: number;
  metrics: {
    label: string;
    value: number;
    color: string;
  }[];
}

export function calculateReadiness(data: any): ReadinessScore {
  if (!data || !data.platforms) return { overall: 0, technical: 0, consistency: 0, versatility: 0, metrics: [] };

  const totalSolved = data.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalSolved || 0), 0);
  const totalContribs = data.platforms.reduce((acc: number, p: any) => acc + (p.stats?.totalContributions || 0), 0);
  const streak = data.latestAnalytics?.streak || 0;
  const consistency = data.latestAnalytics?.consistencyScore || 0;
  const platformsCount = data.platforms.length;

  // Technical Score (0-100)
  // Weighted: Solved problems (60%) + GitHub Contribs (40%)
  // targets: 500 problems, 200 contribs
  const technical = Math.min(100, (totalSolved / 500 * 60) + (totalContribs / 200 * 40));

  // Consistency Score (0-100)
  // Weighted: Streak (40%) + Consistency Metric (60%)
  // target streak: 30 days
  const consistencyScore = Math.min(100, (streak / 30 * 40) + consistency * 0.6);

  // Versatility Score (0-100)
  // Platforms connected (1 platform = 25%)
  const versatility = Math.min(100, platformsCount * 25);

  const overall = Math.round((technical + consistencyScore + versatility) / 3);

  return {
    overall,
    technical: Math.round(technical),
    consistency: Math.round(consistencyScore),
    versatility: Math.round(versatility),
    metrics: [
      { label: 'Technical Depth', value: Math.round(technical), color: '#ef4444' },
      { label: 'Habitual Coding', value: Math.round(consistencyScore), color: '#f59e0b' },
      { label: 'Platform Diversity', value: Math.round(versatility), color: '#3b82f6' }
    ]
  };
}
