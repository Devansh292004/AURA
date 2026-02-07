export async function fetchHackerRankStats(username: string) {
  try {
    const res = await fetch(`https://www.hackerrank.com/rest/hackers/${username}/recent_challenges?limit=100`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      solved: data.total_count || 0,
      recent: data.models || []
    };
  } catch (e) {
    return null;
  }
}

export async function fetchCodeChefStats(username: string) {
  // CodeChef is harder without an official API, but we'll try a public mirror or just return 0 if it fails
  try {
    const res = await fetch(`https://codechef-api.vercel.app/${username}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      rating: data.currentRating || 0,
      globalRank: data.globalRank || 0,
      countryRank: data.countryRank || 0
    };
  } catch (e) {
    return null;
  }
}
