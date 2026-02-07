export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>; // timestamp: count
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  console.log(`Fetching real LeetCode stats for ${username}...`);

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          reputation
          ranking
        }
        submissionCalendar
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    body: JSON.stringify({
      query,
      variables: { username }
    })
  });

  const result = await response.json();

  if (!result.data || !result.data.matchedUser) {
    throw new Error(`LeetCode user not found: ${username}`);
  }

  const user = result.data.matchedUser;
  const stats = user.submitStats.acSubmissionNum;

  const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
  const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
  const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
  const total = stats.find((s: any) => s.difficulty === 'All')?.count || 0;

  return {
    totalSolved: total,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
    acceptanceRate: 0, // Not easily available in this query
    ranking: user.profile.ranking,
    contributionPoints: 0,
    reputation: user.profile.reputation,
    submissionCalendar: JSON.parse(user.submissionCalendar || '{}')
  };
}
