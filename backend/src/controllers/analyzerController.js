import { isValidGitHubUsername, sanitizeUsername } from '../utils/validator.js';
import { cacheService } from '../utils/cache.js';
import {
  fetchUserProfile,
  fetchUserRepositories,
  fetchRepoConfigManifests,
  fetchFileContent,
  fetchRepoReadme
} from '../services/githubService.js';
import { detectTechnologies } from '../services/technologyService.js';
import { calculateFactualMetrics } from '../services/analysisService.js';
import { calculateDeveloperScore } from '../services/scoringService.js';
import { generateAIProfile } from '../services/aiService.js';

export async function analyzeUserProfile(req, res) {
  try {
    const rawUsername = req.params.username;
    if (!isValidGitHubUsername(rawUsername)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid GitHub username. Username must be 1-39 alphanumeric characters or single hyphens.'
      });
    }

    const username = sanitizeUsername(rawUsername);
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const cacheKey = `analysis_${username}`;

    if (!forceRefresh) {
      const cached = cacheService.get(cacheKey);
      if (cached) {
        return res.json({
          success: true,
          fromCache: true,
          data: cached
        });
      }
    }

    // 1. Fetch Profile
    const userProfile = await fetchUserProfile(username);

    // 2. Fetch Repositories
    const repos = await fetchUserRepositories(username);

    // 3. Inspect top non-fork repositories for manifest configs
    const topRepos = repos
      .filter(r => !r.isFork)
      .slice(0, 10); // Take top 10 recent non-fork repos for deep inspection

    const manifestsByRepo = {};
    const manifestPromises = topRepos.map(async (repo) => {
      try {
        const manifests = await fetchRepoConfigManifests(username, repo.name);
        // Fetch content for package.json, requirements.txt, etc.
        const manifestsWithContent = await Promise.all(
          manifests.slice(0, 3).map(async (m) => {
            const content = await fetchFileContent(m.downloadUrl);
            return { ...m, content };
          })
        );
        manifestsByRepo[repo.name] = manifestsWithContent;
      } catch (err) {
        manifestsByRepo[repo.name] = [];
      }
    });

    await Promise.all(manifestPromises);

    // 4. Technology Detection
    const techData = detectTechnologies(repos, manifestsByRepo);

    // 5. Factual Metrics & Repository Quality
    const factualMetrics = calculateFactualMetrics(userProfile, repos);

    // 6. Developer Scoring /100
    const scoreData = calculateDeveloperScore(userProfile, repos, techData, factualMetrics);

    // 7. AI Profile Synthesis
    const aiProfile = await generateAIProfile(userProfile, repos, techData, factualMetrics, scoreData);

    const fullResult = {
      username,
      userProfile,
      overview: factualMetrics.overview,
      languageDistribution: factualMetrics.languageDistribution,
      activityTimeline: factualMetrics.activityTimeline,
      repos: factualMetrics.analyzedRepos,
      techStack: techData,
      score: scoreData,
      aiAnalysis: aiProfile,
      analyzedAt: new Date().toISOString()
    };

    // Cache result
    cacheService.set(cacheKey, fullResult);

    return res.json({
      success: true,
      fromCache: false,
      data: fullResult
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      code: error.code || 'ANALYSIS_ERROR',
      error: error.message || 'An unexpected error occurred while analyzing the profile.'
    });
  }
}

export async function getRepoDetail(req, res) {
  try {
    const { username, repo } = req.params;
    if (!isValidGitHubUsername(username) || !repo) {
      return res.status(400).json({ success: false, error: 'Invalid parameters.' });
    }

    const [readme, manifests] = await Promise.all([
      fetchRepoReadme(username, repo),
      fetchRepoConfigManifests(username, repo)
    ]);

    return res.json({
      success: true,
      data: {
        username,
        repo,
        readme,
        manifests: manifests.map(m => m.name)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export function getHealth(req, res) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cacheStats: cacheService.getStats(),
    hasGithubToken: Boolean(process.env.GITHUB_TOKEN),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
}
