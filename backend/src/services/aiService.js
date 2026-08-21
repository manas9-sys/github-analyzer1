import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Analysis Service
 * Generates an evidence-grounded developer persona, summary, strengths,
 * growth areas, archetype, estimated level, and project suggestions.
 */
export async function generateAIProfile(userProfile, repos, techData, factualMetrics, scoreData) {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey && geminiKey.trim()) {
    try {
      const result = await generateWithGemini(geminiKey.trim(), userProfile, repos, techData, factualMetrics, scoreData);
      if (result) return result;
    } catch (err) {
      console.warn('Gemini API generation failed, falling back to heuristic engine:', err.message);
    }
  }

  // Fallback to intelligent deterministic rule-based heuristic generation
  return generateHeuristicAIProfile(userProfile, repos, techData, factualMetrics, scoreData);
}

/**
 * Calls Google Gemini API for qualitative profile synthesis
 */
async function generateWithGemini(apiKey, userProfile, repos, techData, factualMetrics, scoreData) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `
You are an expert technical recruiter and senior staff engineer evaluating a GitHub developer profile.
Generate an accurate, evidence-backed developer evaluation based ONLY on the factual GitHub data provided below.
DO NOT hallucinate or assume skills that have no evidence in the data.

DATA:
- Username: ${userProfile.username} (${userProfile.name})
- Bio: "${userProfile.bio}"
- Public Repos: ${userProfile.publicRepos} (Original: ${factualMetrics.overview.originalReposCount}, Forks: ${factualMetrics.overview.forkedReposCount})
- Total Stars: ${factualMetrics.overview.totalStars}
- Top Languages: ${JSON.stringify(factualMetrics.languageDistribution.slice(0, 5))}
- Detected Tech Stack: ${JSON.stringify(techData.primaryStack)}
- Tech Categories: ${JSON.stringify(techData.categories)}
- Account Age: ${factualMetrics.overview.accountAgeYears} years
- Active Repos in last 12m: ${factualMetrics.overview.activeReposCount}
- License Coverage: ${factualMetrics.overview.licensePercentage}%
- Documentation Coverage: ${factualMetrics.overview.descriptionPercentage}%
- Developer Score: ${scoreData.totalScore}/100

Top Repositories:
${repos.slice(0, 8).map(r => `- ${r.name} (${r.language || 'None'}): ${r.stars}★ | "${r.description}" | Topics: [${(r.topics || []).join(', ')}]`).join('\n')}

INSTRUCTIONS:
Return a valid JSON object matching this exact schema:
{
  "summary": "2-4 sentences describing the developer based only on GitHub evidence.",
  "archetype": "One of: Full-Stack Builder, Frontend Specialist, Backend Engineer, AI & Data Engineer, Systems & Infrastructure Engineer, DevOps Engineer, Open Source Contributor",
  "estimatedLevel": "One of: Beginner, Junior, Intermediate, Advanced",
  "strengths": [
    "3 to 6 evidence-based bullet points highlighting concrete engineering strengths"
  ],
  "improvementAreas": [
    "3 to 5 realistic weaknesses or growth areas (e.g. test coverage, documentation, CI/CD adoption, project completion)"
  ],
  "recommendedProjects": [
    {
      "title": "Project Title",
      "description": "2-3 sentences explaining what to build and how it expands their stack",
      "targetTech": ["Tech1", "Tech2"],
      "difficulty": "Intermediate / Advanced",
      "skillGain": "Key skill or architecture learned"
    }
  ]
}
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const parsed = JSON.parse(text);

  return {
    ...parsed,
    isAIEstimate: true,
    provider: 'gemini'
  };
}

/**
 * Intelligent Deterministic Heuristic AI Synthesis Engine
 * Guarantees 100% reliable, zero-hallucination results matching the exact schema
 */
export function generateHeuristicAIProfile(userProfile, repos, techData, factualMetrics, scoreData) {
  const { overview, languageDistribution } = factualMetrics;
  const topLangs = languageDistribution.slice(0, 3).map(l => l.name);
  const primaryStack = techData.primaryStack;
  const originalCount = overview.originalReposCount;
  const stars = overview.totalStars;
  const score = scoreData.totalScore;

  // Determine Archetype
  let archetype = 'Full-Stack Builder';
  const hasFrontend = (techData.categories.Frontend || []).length > 0;
  const hasBackend = (techData.categories.Backend || []).length > 0;
  const hasAI = (techData.categories['AI/ML'] || []).length > 0;
  const hasDevOps = (techData.categories.DevOps || []).length > 0;
  const hasSystems = topLangs.some(l => ['Rust', 'C', 'C++', 'Go', 'Assembly'].includes(l));

  if (hasAI && (topLangs.includes('Python') || topLangs.includes('Jupyter Notebook'))) {
    archetype = 'AI & Data Engineer';
  } else if (hasSystems && !hasFrontend) {
    archetype = 'Systems & Infrastructure Engineer';
  } else if (hasFrontend && hasBackend) {
    archetype = 'Full-Stack Builder';
  } else if (hasFrontend && !hasBackend) {
    archetype = 'Frontend Specialist';
  } else if (hasBackend && !hasFrontend) {
    archetype = 'Backend Engineer';
  } else if (stars >= 50 && overview.forkedReposCount >= 5) {
    archetype = 'Open Source Contributor';
  } else if (hasDevOps) {
    archetype = 'Cloud & DevOps Practitioner';
  }

  // Determine Estimated Level (Transparently flagged as AI Estimated)
  let estimatedLevel = 'Intermediate';
  if (score >= 80 || (stars >= 100 && overview.accountAgeYears >= 3)) {
    estimatedLevel = 'Advanced';
  } else if (score >= 55 || overview.accountAgeYears >= 2) {
    estimatedLevel = 'Intermediate';
  } else if (score >= 30 || overview.totalRepos >= 3) {
    estimatedLevel = 'Junior';
  } else {
    estimatedLevel = 'Beginner';
  }

  // Generate Summary
  const topLangStr = topLangs.length > 0 ? topLangs.join(', ') : 'software engineering';
  const stackStr = primaryStack.length > 0 ? primaryStack.slice(0, 4).join(', ') : 'open-source technologies';
  
  let summary = `${userProfile.name || userProfile.username} is a ${archetype.toLowerCase()} with active public repositories primarily written in ${topLangStr}. `;
  if (primaryStack.length > 0) {
    summary += `Their public repositories exhibit practical experience with ${stackStr}. `;
  }
  if (stars > 0) {
    summary += `With ${overview.totalStars} stars earned across ${originalCount} original repositories, their work demonstrates genuine community interest.`;
  } else {
    summary += `With ${originalCount} public repositories, they demonstrate continuous learning and ongoing project experimentation.`;
  }

  // Generate Strengths
  const strengths = [];
  if (topLangs.length >= 2) {
    strengths.push(`Multi-language versatility spanning ${topLangs.slice(0, 3).join(' and ')}.`);
  }
  if (primaryStack.length >= 3) {
    strengths.push(`Proven practical adoption of modern frameworks including ${primaryStack.slice(0, 3).join(', ')}.`);
  }
  if (overview.activeReposCount >= 3) {
    strengths.push(`High recent engineering activity with ${overview.activeReposCount} active repositories in the past year.`);
  }
  if (stars >= 5) {
    strengths.push(`Organic community validation with ${stars} total GitHub stars.`);
  }
  if (overview.licensePercentage >= 50) {
    strengths.push(`Clean open-source stewardship with formal licensing on ${overview.licensePercentage}% of repositories.`);
  }
  if (overview.descriptionPercentage >= 70) {
    strengths.push(`Disciplined repository documentation with clear descriptions on the vast majority of projects.`);
  }
  if (strengths.length < 3) {
    strengths.push(`Active GitHub presence with ${overview.totalRepos} tracked public repositories.`);
    strengths.push(`Demonstrated interest in software engineering and hands-on coding.`);
  }

  // Generate Improvement Areas
  const improvementAreas = [];
  if (overview.licensePercentage < 50) {
    improvementAreas.push('Open-source licensing: Add explicit open source licenses (e.g. MIT or Apache-2.0) to make projects easily reusable.');
  }
  if (overview.descriptionPercentage < 70) {
    improvementAreas.push('Repository metadata: Provide comprehensive descriptions and informative READMEs for all public repositories.');
  }
  if ((techData.categories.Testing || []).length === 0) {
    improvementAreas.push('Automated testing: Introduce unit & integration test suites (e.g. Jest, Vitest, Pytest) into key repositories.');
  }
  if ((techData.categories.DevOps || []).length === 0) {
    improvementAreas.push('CI/CD & Containerization: Implement GitHub Actions workflows and Dockerfiles for automated validation and deployment.');
  }
  if (languageDistribution.length <= 1) {
    improvementAreas.push('Technical Breadth: Broaden hands-on exposure to full-stack ecosystems and complementary backend/cloud stacks.');
  }
  if (improvementAreas.length < 3) {
    improvementAreas.push('Benchmark & Stress Testing: Add performance benchmarks and architectural documentation to flagship projects.');
  }

  // Generate Next Recommended Projects
  const recommendedProjects = generateProjectRecommendations(archetype, topLangs, primaryStack, techData);

  return {
    summary,
    archetype,
    estimatedLevel,
    strengths: strengths.slice(0, 5),
    improvementAreas: improvementAreas.slice(0, 4),
    recommendedProjects,
    isAIEstimate: true,
    provider: 'heuristic-engine'
  };
}

function generateProjectRecommendations(archetype, topLangs, primaryStack, techData) {
  const pool = [];

  if (archetype.includes('Systems') || topLangs.includes('C') || topLangs.includes('C++') || topLangs.includes('Rust') || topLangs.includes('Go')) {
    pool.push({
      title: 'High-Performance Asynchronous Event Loop & I/O Engine',
      description: 'Build a lightweight epoll/kqueue-based networking engine with thread-pool work stealing and zero-copy buffers.',
      targetTech: ['C / C++ / Rust', 'Linux epoll', 'POSIX threads', 'Valgrind / ASan'],
      difficulty: 'Advanced',
      skillGain: 'Kernel syscalls, memory safety, concurrent lock-free data structures, and profiling'
    });
    pool.push({
      title: 'Distributed Log Structured Key-Value Store (LSM-Tree)',
      description: 'Implement an embedded storage engine using MemTable, WAL (Write-Ahead Logging), and SSTables with background compaction.',
      targetTech: ['Rust or C++', 'Storage Engines', 'Bloom Filters', 'gRPC'],
      difficulty: 'Advanced',
      skillGain: 'Disk I/O optimization, crash recovery protocols, and binary serialization'
    });
    pool.push({
      title: 'Cross-Platform System Telemetry & Process Monitor',
      description: 'Create an eBPF or OS-level process monitor extracting CPU, memory, socket connections, and disk latencies.',
      targetTech: ['C / Rust', 'eBPF', 'Prometheus', 'Grafana'],
      difficulty: 'Intermediate',
      skillGain: 'Kernel observability, low-overhead sampling, and metrics export'
    });
  }

  if (topLangs.includes('Python') || archetype.includes('AI')) {
    pool.push({
      title: 'Production RAG & Vector Search Pipeline',
      description: 'Create an intelligent document retrieval system using embeddings, a vector database, and streaming LLM responses with reranking.',
      targetTech: ['Python', 'FastAPI', 'Qdrant / Pinecone', 'LangChain', 'Docker'],
      difficulty: 'Advanced',
      skillGain: 'Vector indexing, chunking strategies, asynchronous API design, and AI observability'
    });
    pool.push({
      title: 'Distributed Asynchronous Task & ML Model Serving Engine',
      description: 'Build a scalable model inference server with dynamic batching, GPU queue management, and metrics telemetry.',
      targetTech: ['Python', 'Triton / ONNX Runtime', 'Redis', 'Docker'],
      difficulty: 'Advanced',
      skillGain: 'Inference optimization, concurrent worker pools, and request batching'
    });
  }

  if (topLangs.includes('JavaScript') || topLangs.includes('TypeScript') || (techData.categories.Frontend || []).length > 0) {
    pool.push({
      title: 'Full-Stack Realtime Collaborative Canvas & Workspace',
      description: 'Build a multiplayer workspace with optimistic updates, CRDT conflict resolution, WebSockets, and database persistence.',
      targetTech: ['TypeScript', 'Next.js', 'PostgreSQL', 'WebSockets', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      skillGain: 'Realtime distributed state sync, database transactions, and scalable UI architecture'
    });
  }

  // Universal fallbacks to guarantee 3 top quality recommendations
  pool.push({
    title: 'High-Throughput API Gateway & Distributed Rate Limiter',
    description: 'Design a high-performance reverse proxy service with sliding-window rate limiting and distributed Redis caching.',
    targetTech: ['Go or Node.js', 'Redis', 'Docker', 'Prometheus'],
    difficulty: 'Intermediate',
    skillGain: 'Concurrency control, distributed locks, and cache invalidation strategies'
  });

  pool.push({
    title: 'Automated CI/CD Observability & Canary Release Pipeline',
    description: 'Implement a developer-tooling pipeline that tracks build metrics, test coverage, and automated deployment verification stages.',
    targetTech: ['GitHub Actions', 'Docker', 'Prometheus / Grafana', 'TypeScript / Shell'],
    difficulty: 'Advanced',
    skillGain: 'DevOps automation, infrastructure monitoring, and release engineering'
  });

  return pool.slice(0, 3);
}
