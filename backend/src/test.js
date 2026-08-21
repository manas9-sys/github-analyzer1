import { isValidGitHubUsername } from './utils/validator.js';
import { detectTechnologies } from './services/technologyService.js';
import { calculateFactualMetrics } from './services/analysisService.js';
import { calculateDeveloperScore } from './services/scoringService.js';
import { generateHeuristicAIProfile } from './services/aiService.js';

console.log('--- Starting Backend Unit Tests ---');

// 1. Validator tests
console.assert(isValidGitHubUsername('torvalds') === true, 'torvalds should be valid');
console.assert(isValidGitHubUsername('gaearon') === true, 'gaearon should be valid');
console.assert(isValidGitHubUsername('-invalid') === false, '-invalid should be invalid');
console.assert(isValidGitHubUsername('') === false, 'empty string should be invalid');
console.log('✓ Validator tests passed');

// 2. Mock Analysis & Scoring test
const mockProfile = {
  avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  name: 'Linus Torvalds',
  username: 'torvalds',
  bio: 'Creator of Linux and Git',
  location: 'Portland, OR',
  followers: 210000,
  following: 0,
  publicRepos: 7,
  publicGists: 0,
  profileUrl: 'https://github.com/torvalds',
  createdAt: '2011-09-03T15:26:22Z',
  updatedAt: '2025-01-01T00:00:00Z'
};

const mockRepos = [
  {
    id: 1,
    name: 'linux',
    description: 'Linux kernel source tree',
    url: 'https://github.com/torvalds/linux',
    language: 'C',
    stars: 180000,
    forks: 54000,
    openIssues: 300,
    topics: ['kernel', 'linux', 'operating-system'],
    isFork: false,
    isArchived: false,
    license: 'GPL-2.0',
    createdAt: '2011-09-04T22:48:12Z',
    updatedAt: '2025-01-10T10:00:00Z',
    pushedAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 2,
    name: 'subsurface-for-dirk',
    description: 'Divelog software',
    url: 'https://github.com/torvalds/subsurface-for-dirk',
    language: 'C++',
    stars: 1200,
    forks: 300,
    openIssues: 10,
    topics: ['diving', 'qt'],
    isFork: false,
    isArchived: false,
    license: 'GPL-2.0',
    createdAt: '2011-10-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
    pushedAt: '2024-05-01T00:00:00Z'
  }
];

const mockManifests = {};
const techData = detectTechnologies(mockRepos, mockManifests);
console.assert(techData.all.some(t => t.name === 'C++'), 'C++ should be detected');
console.log('✓ Technology detection test passed');

const factual = calculateFactualMetrics(mockProfile, mockRepos);
console.assert(factual.overview.totalStars === 181200, 'Total stars calculation check');
console.assert(factual.overview.originalReposCount === 2, 'Original repos count check');
console.log('✓ Factual metrics test passed');

const score = calculateDeveloperScore(mockProfile, mockRepos, techData, factual);
console.assert(score.totalScore > 50, 'Developer score should be > 50');
console.assert(score.breakdown.length === 6, 'Score should have 6 categories');
console.log('✓ Scoring test passed, Score:', score.totalScore, 'Tier:', score.tier);

const aiProfile = generateHeuristicAIProfile(mockProfile, mockRepos, techData, factual, score);
console.assert(Boolean(aiProfile.summary), 'AI summary should exist');
console.assert(aiProfile.strengths.length >= 3, 'AI strengths should have >= 3 items');
console.assert(aiProfile.improvementAreas.length >= 2, 'AI improvement areas should have >= 2 items');
console.assert(aiProfile.recommendedProjects.length === 3, 'AI should recommend 3 projects');
console.log('✓ Heuristic AI profile test passed, Archetype:', aiProfile.archetype, 'Level:', aiProfile.estimatedLevel);

console.log('--- ALL BACKEND TESTS PASSED ---');
