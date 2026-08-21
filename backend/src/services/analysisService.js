/**
 * Repository Quality & Factual Metrics Analysis Service
 */

export function calculateFactualMetrics(userProfile, repos) {
  const originalRepos = repos.filter(r => !r.isFork);
  const forkedRepos = repos.filter(r => r.isFork);
  const archivedRepos = repos.filter(r => r.isArchived);

  // Active repos: updated or pushed in the last 12 months
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const activeRepos = repos.filter(r => {
    const lastDate = new Date(r.pushedAt || r.updatedAt);
    return lastDate >= oneYearAgo;
  });

  // Total stars and forks across original (own) repos
  const totalStars = originalRepos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const totalForks = originalRepos.reduce((acc, r) => acc + (r.forks || 0), 0);
  const totalWatchers = originalRepos.reduce((acc, r) => acc + (r.watchers || 0), 0);
  const totalOpenIssues = originalRepos.reduce((acc, r) => acc + (r.openIssues || 0), 0);

  // Repos with license
  const licensedRepos = originalRepos.filter(r => Boolean(r.license));
  const licensePercentage = originalRepos.length > 0 
    ? Math.round((licensedRepos.length / originalRepos.length) * 100)
    : 0;

  // Repos with description
  const describedRepos = originalRepos.filter(r => r.description && r.description.trim().length > 5);
  const descriptionPercentage = originalRepos.length > 0
    ? Math.round((describedRepos.length / originalRepos.length) * 100)
    : 0;

  // Repos with topics
  const categorizedRepos = originalRepos.filter(r => Array.isArray(r.topics) && r.topics.length > 0);

  // Language Breakdown
  const languageCounts = {};
  for (const repo of originalRepos) {
    if (repo.language && repo.language !== 'Other') {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
  const languageDistribution = Object.entries(languageCounts)
    .map(([lang, count]) => ({
      name: lang,
      count,
      percentage: Number(((count / totalLangRepos) * 100).toFixed(1))
    }))
    .sort((a, b) => b.count - a.count);

  const topLanguage = languageDistribution.length > 0 ? languageDistribution[0].name : 'N/A';

  // Calculate per-repository quality score
  const analyzedRepos = repos.map(repo => {
    const qualityScore = calculateIndividualRepoQuality(repo);
    return {
      ...repo,
      qualityScore
    };
  });

  // Calculate average repo quality
  const avgQualityScore = originalRepos.length > 0
    ? Math.round(
        originalRepos.reduce((acc, r) => {
          const item = analyzedRepos.find(ar => ar.id === r.id);
          return acc + (item ? item.qualityScore : 50);
        }, 0) / originalRepos.length
      )
    : 0;

  // Timeline of creation and updates
  const activityTimeline = generateActivityTimeline(repos);

  // Account age in years
  const createdDate = new Date(userProfile.createdAt);
  const now = new Date();
  const accountAgeYears = Math.max(0.1, Number(((now - createdDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)));

  return {
    overview: {
      totalRepos: repos.length,
      originalReposCount: originalRepos.length,
      forkedReposCount: forkedRepos.length,
      archivedReposCount: archivedRepos.length,
      activeReposCount: activeRepos.length,
      totalStars,
      totalForks,
      totalWatchers,
      totalOpenIssues,
      topLanguage,
      licensePercentage,
      descriptionPercentage,
      avgQualityScore,
      accountAgeYears,
      publicGists: userProfile.publicGists,
      followers: userProfile.followers,
      following: userProfile.following
    },
    languageDistribution,
    activityTimeline,
    analyzedRepos
  };
}

/**
 * Calculates a 0-100 quality score for an individual repository
 */
export function calculateIndividualRepoQuality(repo) {
  let score = 0;

  // 1. Has description (max 20)
  if (repo.description && repo.description.trim().length > 10) {
    score += 20;
  } else if (repo.description && repo.description.trim().length > 0) {
    score += 10;
  }

  // 2. License presence (max 15)
  if (repo.license) {
    score += 15;
  }

  // 3. Topics / Tags (max 15)
  if (repo.topics && repo.topics.length >= 3) {
    score += 15;
  } else if (repo.topics && repo.topics.length > 0) {
    score += 8;
  }

  // 4. Originality (Not a fork) (max 15)
  if (!repo.isFork) {
    score += 15;
  }

  // 5. Popularity / Engagement (stars & forks) (max 20)
  const engagement = (repo.stars || 0) * 2 + (repo.forks || 0) * 3;
  if (engagement >= 50) score += 20;
  else if (engagement >= 10) score += 15;
  else if (engagement >= 1) score += 10;
  else score += 3;

  // 6. Recent maintenance (pushed within 12 months) (max 15)
  const lastPush = new Date(repo.pushedAt || repo.updatedAt);
  const monthsAgo = (new Date() - lastPush) / (1000 * 60 * 60 * 24 * 30.5);
  if (monthsAgo <= 3) score += 15;
  else if (monthsAgo <= 12) score += 10;
  else if (monthsAgo <= 24) score += 5;

  return Math.min(100, Math.max(10, score));
}

/**
 * Generates yearly/monthly repository activity timeline
 */
function generateActivityTimeline(repos) {
  const yearlyData = {};
  const currentYear = new Date().getFullYear();

  for (const repo of repos) {
    const createdYear = new Date(repo.createdAt).getFullYear();
    const updatedYear = new Date(repo.updatedAt).getFullYear();

    if (createdYear >= currentYear - 6) {
      if (!yearlyData[createdYear]) {
        yearlyData[createdYear] = { year: createdYear.toString(), created: 0, updated: 0, stars: 0 };
      }
      yearlyData[createdYear].created += 1;
      yearlyData[createdYear].stars += repo.stars || 0;
    }

    if (updatedYear >= currentYear - 6) {
      if (!yearlyData[updatedYear]) {
        yearlyData[updatedYear] = { year: updatedYear.toString(), created: 0, updated: 0, stars: 0 };
      }
      yearlyData[updatedYear].updated += 1;
    }
  }

  // Convert to sorted array
  const timeline = Object.values(yearlyData).sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10));

  // If sparse, ensure at least last 4 years exist
  for (let y = currentYear - 3; y <= currentYear; y++) {
    const strY = y.toString();
    if (!timeline.find(t => t.year === strY)) {
      timeline.push({ year: strY, created: 0, updated: 0, stars: 0 });
    }
  }

  return timeline.sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10));
}
