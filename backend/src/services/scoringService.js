/**
 * Transparent Developer Scoring Service
 * Computes a transparent, reproducible 0-100 GitHub Developer Score
 * with a clear breakdown across 6 core engineering pillars.
 */

export function calculateDeveloperScore(userProfile, repos, techData, factualMetrics) {
  const { overview, languageDistribution } = factualMetrics;

  // 1. Technical Breadth (Max: 20 pts)
  let breadthScore = 0;
  const langCount = languageDistribution.length;
  if (langCount >= 6) breadthScore += 10;
  else if (langCount >= 4) breadthScore += 8;
  else if (langCount >= 2) breadthScore += 6;
  else if (langCount >= 1) breadthScore += 3;

  const techCategoryCount = Object.values(techData.categories).filter(arr => arr.length > 0).length;
  if (techCategoryCount >= 5) breadthScore += 10;
  else if (techCategoryCount >= 3) breadthScore += 7;
  else if (techCategoryCount >= 2) breadthScore += 5;
  else if (techCategoryCount >= 1) breadthScore += 3;

  breadthScore = Math.min(20, Math.max(0, breadthScore));

  // 2. Project Quality (Max: 20 pts)
  let qualityScore = 0;
  const avgQuality = overview.avgQualityScore || 0; // 0-100
  qualityScore += Math.round((avgQuality / 100) * 10); // up to 10

  const stars = overview.totalStars || 0;
  if (stars >= 500) qualityScore += 10;
  else if (stars >= 100) qualityScore += 8;
  else if (stars >= 25) qualityScore += 6;
  else if (stars >= 5) qualityScore += 4;
  else if (stars >= 1) qualityScore += 2;

  qualityScore = Math.min(20, Math.max(0, qualityScore));

  // 3. Activity & Consistency (Max: 20 pts)
  let activityScore = 0;
  const activeCount = overview.activeReposCount || 0;
  if (activeCount >= 10) activityScore += 10;
  else if (activeCount >= 5) activityScore += 8;
  else if (activeCount >= 2) activityScore += 5;
  else if (activeCount >= 1) activityScore += 3;

  const ageYears = overview.accountAgeYears || 0;
  if (ageYears >= 4) activityScore += 10;
  else if (ageYears >= 2) activityScore += 7;
  else if (ageYears >= 1) activityScore += 5;
  else activityScore += 3;

  activityScore = Math.min(20, Math.max(0, activityScore));

  // 4. Documentation (Max: 15 pts)
  let docScore = 0;
  const descPct = overview.descriptionPercentage || 0; // 0-100
  docScore += Math.round((descPct / 100) * 8);

  const licPct = overview.licensePercentage || 0; // 0-100
  docScore += Math.round((licPct / 100) * 7);

  docScore = Math.min(15, Math.max(0, docScore));

  // 5. Engineering Practices (Max: 15 pts)
  let engScore = 0;
  const hasDevOps = (techData.categories.DevOps || []).length > 0;
  const hasTesting = (techData.categories.Testing || []).length > 0;
  const hasTooling = (techData.categories.Tooling || []).length > 0;
  const hasDB = (techData.categories.Database || []).length > 0;

  if (hasDevOps) engScore += 5;
  if (hasTesting) engScore += 4;
  if (hasTooling) engScore += 3;
  if (hasDB) engScore += 3;

  engScore = Math.min(15, Math.max(0, engScore));

  // 6. Open Source & Community (Max: 10 pts)
  let communityScore = 0;
  const followers = overview.followers || 0;
  const forks = overview.totalForks || 0;

  if (followers >= 100 || forks >= 50) communityScore += 10;
  else if (followers >= 30 || forks >= 15) communityScore += 7;
  else if (followers >= 10 || forks >= 5) communityScore += 5;
  else if (followers >= 2 || forks >= 1) communityScore += 3;
  else communityScore += 1;

  communityScore = Math.min(10, Math.max(0, communityScore));

  // Overall Score / 100
  const totalScore = breadthScore + qualityScore + activityScore + docScore + engScore + communityScore;

  // Grade / Tier
  let tier = 'Developing';
  let tierColor = 'text-amber-400';
  if (totalScore >= 85) {
    tier = 'Exceptional';
    tierColor = 'text-emerald-400';
  } else if (totalScore >= 70) {
    tier = 'Proficient';
    tierColor = 'text-cyan-400';
  } else if (totalScore >= 50) {
    tier = 'Competent';
    tierColor = 'text-blue-400';
  }

  return {
    totalScore,
    tier,
    tierColor,
    breakdown: [
      {
        category: 'Technical Breadth',
        score: breadthScore,
        maxScore: 20,
        description: 'Diversity of languages, frameworks and technology domains'
      },
      {
        category: 'Project Quality',
        score: qualityScore,
        maxScore: 20,
        description: 'Originality, star ratings, and repo health factors'
      },
      {
        category: 'Activity & Consistency',
        score: activityScore,
        maxScore: 20,
        description: 'Recent repository updates and account longevity'
      },
      {
        category: 'Documentation',
        score: docScore,
        maxScore: 15,
        description: 'Repository descriptions, license clarity, and README coverage'
      },
      {
        category: 'Engineering Practices',
        score: engScore,
        maxScore: 15,
        description: 'Adoption of CI/CD, testing, build tools, and containerization'
      },
      {
        category: 'Open Source',
        score: communityScore,
        maxScore: 10,
        description: 'Community reach, followers, forks, and public engagement'
      }
    ],
    radarMetrics: [
      { subject: 'Breadth', value: Math.round((breadthScore / 20) * 100), fullMark: 100 },
      { subject: 'Quality', value: Math.round((qualityScore / 20) * 100), fullMark: 100 },
      { subject: 'Activity', value: Math.round((activityScore / 20) * 100), fullMark: 100 },
      { subject: 'Docs', value: Math.round((docScore / 15) * 100), fullMark: 100 },
      { subject: 'Engineering', value: Math.round((engScore / 15) * 100), fullMark: 100 },
      { subject: 'Community', value: Math.round((communityScore / 10) * 100), fullMark: 100 }
    ]
  };
}
