export interface GitHubStats {
  totalContributions: number;
  repoCount: number;
  followers: number;
  following: number;
  publicGists: number;
  recentRepos: { name: string, stars: number, language: string }[];
  contributions: { date: string, count: number }[];
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  console.log(`Fetching real GitHub stats for ${username}...`);

  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });

  if (!userRes.ok) throw new Error(`GitHub user not found: ${username}`);
  const userData = await userRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });
  const reposData = await reposRes.json();

  // Fetch events to estimate contributions (limited but real-time)
  const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  });
  const eventsData = await eventsRes.json();

  const dailyActivity: Record<string, number> = {};
  let totalContribs = 0;

  if (Array.isArray(eventsData)) {
    eventsData.forEach(event => {
      if (['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(event.type)) {
        const date = event.created_at.split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
        totalContribs++;
      }
    });
  }

  const contributions = Object.entries(dailyActivity).map(([date, count]) => ({
    date,
    count
  })).sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalContributions: totalContribs,
    repoCount: userData.public_repos,
    followers: userData.followers,
    following: userData.following,
    publicGists: userData.public_gists,
    recentRepos: Array.isArray(reposData) ? reposData.map((repo: any) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      language: repo.language || 'Unknown'
    })) : [],
    contributions
  };
}
