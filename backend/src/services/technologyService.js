/**
 * Technology Detection Service
 * Analyzes repository languages, manifest files, topics, and descriptions
 * to detect technologies with verifiable evidence.
 */

// Keyword & Dependency rules mapped to standard technology definitions
const TECH_DEFINITIONS = [
  // Frontend
  { name: 'React', category: 'Frontend', deps: ['react', 'react-dom'], topics: ['react', 'reactjs'], keywords: ['react.js', 'reactjs', 'react'] },
  { name: 'Next.js', category: 'Frontend', deps: ['next'], topics: ['nextjs', 'next-js'], keywords: ['next.js', 'nextjs'] },
  { name: 'Vue.js', category: 'Frontend', deps: ['vue'], topics: ['vue', 'vuejs', 'vue3'], keywords: ['vue.js', 'vuejs'] },
  { name: 'Nuxt.js', category: 'Frontend', deps: ['nuxt', 'nuxt3'], topics: ['nuxt', 'nuxtjs'], keywords: ['nuxt.js', 'nuxtjs'] },
  { name: 'Svelte', category: 'Frontend', deps: ['svelte', '@sveltejs/kit'], topics: ['svelte', 'sveltekit'], keywords: ['svelte', 'sveltekit'] },
  { name: 'Angular', category: 'Frontend', deps: ['@angular/core'], topics: ['angular', 'angularjs'], keywords: ['angular'] },
  { name: 'Tailwind CSS', category: 'Frontend', deps: ['tailwindcss'], topics: ['tailwind', 'tailwindcss'], keywords: ['tailwind css', 'tailwindcss'] },
  { name: 'TypeScript', category: 'Languages', deps: ['typescript'], topics: ['typescript', 'ts'], languages: ['TypeScript'], keywords: ['typescript'] },
  { name: 'JavaScript', category: 'Languages', topics: ['javascript', 'js'], languages: ['JavaScript'], keywords: ['javascript', 'es6'] },
  { name: 'HTML/CSS', category: 'Frontend', languages: ['HTML', 'CSS', 'SCSS', 'Less'], topics: ['html', 'css', 'sass'], keywords: ['html5', 'css3'] },
  { name: 'Astro', category: 'Frontend', deps: ['astro'], topics: ['astro'], keywords: ['astro'] },
  { name: 'Redux', category: 'Frontend', deps: ['redux', '@reduxjs/toolkit', 'react-redux'], topics: ['redux'], keywords: ['redux toolkit', 'redux'] },
  { name: 'Zustand', category: 'Frontend', deps: ['zustand'], topics: ['zustand'], keywords: ['zustand'] },
  { name: 'Vite', category: 'Tooling', deps: ['vite'], topics: ['vite'], keywords: ['vite'] },
  { name: 'Webpack', category: 'Tooling', deps: ['webpack'], topics: ['webpack'], keywords: ['webpack'] },

  // Backend
  { name: 'Node.js', category: 'Backend', deps: ['express', 'koa', 'fastify', 'nestjs'], topics: ['nodejs', 'node'], languages: ['JavaScript', 'TypeScript'], keywords: ['node.js', 'nodejs'] },
  { name: 'Express.js', category: 'Backend', deps: ['express'], topics: ['express', 'expressjs'], keywords: ['express.js', 'expressjs'] },
  { name: 'NestJS', category: 'Backend', deps: ['@nestjs/core'], topics: ['nestjs'], keywords: ['nestjs'] },
  { name: 'Fastify', category: 'Backend', deps: ['fastify'], topics: ['fastify'], keywords: ['fastify'] },
  { name: 'Python', category: 'Languages', topics: ['python', 'py'], languages: ['Python'], keywords: ['python 3', 'python'] },
  { name: 'Django', category: 'Backend', deps: ['django'], topics: ['django'], keywords: ['django'] },
  { name: 'Flask', category: 'Backend', deps: ['flask'], topics: ['flask'], keywords: ['flask'] },
  { name: 'FastAPI', category: 'Backend', deps: ['fastapi'], topics: ['fastapi'], keywords: ['fastapi'] },
  { name: 'Java', category: 'Languages', topics: ['java'], languages: ['Java'], keywords: ['java'] },
  { name: 'Spring Boot', category: 'Backend', deps: ['spring-boot'], topics: ['spring', 'springboot', 'spring-boot'], keywords: ['spring boot', 'spring framework'] },
  { name: 'Go', category: 'Languages', topics: ['golang', 'go'], languages: ['Go'], keywords: ['golang', 'go lang'] },
  { name: 'Gin', category: 'Backend', deps: ['github.com/gin-gonic/gin'], topics: ['gin'], keywords: ['gin-gonic'] },
  { name: 'Rust', category: 'Languages', topics: ['rust', 'rustlang'], languages: ['Rust'], keywords: ['rust'] },
  { name: 'Actix / Axum', category: 'Backend', deps: ['actix-web', 'axum'], topics: ['actix', 'axum'], keywords: ['actix-web', 'axum'] },
  { name: 'C++', category: 'Languages', topics: ['cpp', 'cplusplus'], languages: ['C++'], keywords: ['c++'] },
  { name: 'C# / .NET', category: 'Backend', topics: ['csharp', 'dotnet', 'aspnet'], languages: ['C#'], keywords: ['.net', 'asp.net', 'c#'] },
  { name: 'PHP', category: 'Languages', topics: ['php'], languages: ['PHP'], keywords: ['php'] },
  { name: 'Laravel', category: 'Backend', deps: ['laravel/framework'], topics: ['laravel'], keywords: ['laravel'] },
  { name: 'Ruby on Rails', category: 'Backend', deps: ['rails'], topics: ['rails', 'rubyonrails'], languages: ['Ruby'], keywords: ['ruby on rails', 'rails'] },
  { name: 'GraphQL', category: 'Backend', deps: ['graphql', '@apollo/client', 'apollo-server', 'apollo-server-express'], topics: ['graphql', 'apollo'], keywords: ['graphql', 'apollo server'] },
  { name: 'REST API', category: 'Backend', topics: ['rest', 'rest-api', 'api'], keywords: ['rest api', 'restful'] },
  { name: 'gRPC', category: 'Backend', deps: ['@grpc/grpc-js', 'grpc'], topics: ['grpc', 'protobuf'], keywords: ['grpc', 'protocol buffers'] },

  // Database & Storage
  { name: 'PostgreSQL', category: 'Database', deps: ['pg', 'pg-promise', 'psycopg2', 'asyncpg'], topics: ['postgres', 'postgresql'], keywords: ['postgresql', 'postgres'] },
  { name: 'MySQL', category: 'Database', deps: ['mysql', 'mysql2', 'pymysql'], topics: ['mysql'], keywords: ['mysql'] },
  { name: 'MongoDB', category: 'Database', deps: ['mongodb', 'mongoose', 'pymongo'], topics: ['mongodb', 'mongo'], keywords: ['mongodb', 'mongoose'] },
  { name: 'Redis', category: 'Database', deps: ['redis', 'ioredis'], topics: ['redis'], keywords: ['redis', 'caching'] },
  { name: 'SQLite', category: 'Database', deps: ['sqlite3', 'better-sqlite3'], topics: ['sqlite'], keywords: ['sqlite'] },
  { name: 'Prisma', category: 'Database', deps: ['@prisma/client', 'prisma'], topics: ['prisma'], keywords: ['prisma orm', 'prisma'] },
  { name: 'TypeORM / Drizzle', category: 'Database', deps: ['typeorm', 'drizzle-orm'], topics: ['typeorm', 'drizzle'], keywords: ['typeorm', 'drizzle orm'] },
  { name: 'Supabase', category: 'Database', deps: ['@supabase/supabase-js'], topics: ['supabase'], keywords: ['supabase'] },
  { name: 'Firebase', category: 'Database', deps: ['firebase', 'firebase-admin'], topics: ['firebase', 'firestore'], keywords: ['firebase', 'firestore'] },

  // DevOps & Cloud
  { name: 'Docker', category: 'DevOps', topics: ['docker', 'docker-compose', 'containerization'], keywords: ['dockerfile', 'docker-compose', 'docker'] },
  { name: 'Kubernetes', category: 'DevOps', topics: ['k8s', 'kubernetes'], keywords: ['kubernetes', 'k8s', 'helm'] },
  { name: 'GitHub Actions', category: 'DevOps', topics: ['github-actions', 'ci-cd'], keywords: ['github actions', '.github/workflows', 'ci/cd'] },
  { name: 'AWS', category: 'DevOps', deps: ['aws-sdk', '@aws-sdk/client-s3'], topics: ['aws', 'amazon-web-services', 's3', 'lambda'], keywords: ['aws', 'amazon web services', 's3', 'ec2', 'lambda'] },
  { name: 'Google Cloud (GCP)', category: 'DevOps', deps: ['@google-cloud/storage'], topics: ['gcp', 'google-cloud'], keywords: ['google cloud', 'gcp'] },
  { name: 'Terraform', category: 'DevOps', topics: ['terraform', 'iac'], languages: ['HCL'], keywords: ['terraform'] },
  { name: 'Nginx', category: 'DevOps', topics: ['nginx'], keywords: ['nginx'] },
  { name: 'Vercel', category: 'DevOps', topics: ['vercel'], keywords: ['vercel deployment', 'vercel'] },

  // AI & Machine Learning
  { name: 'PyTorch', category: 'AI/ML', deps: ['torch', 'torchvision'], topics: ['pytorch', 'deep-learning'], keywords: ['pytorch'] },
  { name: 'TensorFlow / Keras', category: 'AI/ML', deps: ['tensorflow', 'keras'], topics: ['tensorflow', 'keras'], keywords: ['tensorflow', 'keras'] },
  { name: 'Scikit-learn', category: 'AI/ML', deps: ['scikit-learn', 'sklearn'], topics: ['scikit-learn', 'machine-learning'], keywords: ['scikit-learn', 'sklearn'] },
  { name: 'OpenAI API / LLMs', category: 'AI/ML', deps: ['openai', '@google/genai', '@google/generative-ai', 'langchain', '@langchain/core', 'anthropic'], topics: ['llm', 'openai', 'gpt', 'genai', 'langchain', 'rag'], keywords: ['llm', 'langchain', 'openai', 'gpt-4', 'rag', 'gemini'] },
  { name: 'Hugging Face', category: 'AI/ML', deps: ['transformers', 'datasets'], topics: ['huggingface', 'transformers'], keywords: ['hugging face', 'transformers'] },
  { name: 'Pandas & NumPy', category: 'AI/ML', deps: ['pandas', 'numpy'], topics: ['pandas', 'numpy', 'data-science'], keywords: ['pandas', 'numpy', 'data analysis'] },

  // Testing & Quality
  { name: 'Jest / Vitest', category: 'Testing', deps: ['jest', 'vitest'], topics: ['jest', 'vitest', 'unit-testing'], keywords: ['jest', 'vitest'] },
  { name: 'Cypress / Playwright', category: 'Testing', deps: ['cypress', '@playwright/test', 'playwright'], topics: ['cypress', 'playwright', 'e2e-testing'], keywords: ['cypress', 'playwright'] },
  { name: 'Pytest', category: 'Testing', deps: ['pytest'], topics: ['pytest'], keywords: ['pytest'] },
  { name: 'ESLint / Prettier', category: 'Tooling', deps: ['eslint', 'prettier'], topics: ['eslint', 'prettier'], keywords: ['eslint', 'prettier'] }
];

/**
 * Detects all technologies from user repos, manifest contents, topics, languages, and READMEs
 */
export function detectTechnologies(repos, manifestsByRepo = {}) {
  const detectedMap = new Map();

  function registerDetection(techDef, repoName, evidenceStr) {
    if (!detectedMap.has(techDef.name)) {
      detectedMap.set(techDef.name, {
        name: techDef.name,
        category: techDef.category,
        count: 0,
        repos: new Set(),
        evidence: new Set()
      });
    }

    const item = detectedMap.get(techDef.name);
    item.count += 1;
    if (repoName) item.repos.add(repoName);
    if (evidenceStr) item.evidence.add(evidenceStr);
  }

  // 1. Scan Repositories (Languages, Topics, Descriptions, Names)
  for (const repo of repos) {
    const repoText = `${repo.name} ${repo.description || ''}`.toLowerCase();
    const topicsLower = (repo.topics || []).map(t => t.toLowerCase());
    const repoLang = repo.language;

    for (const tech of TECH_DEFINITIONS) {
      // Check Language match
      if (tech.languages && repoLang && tech.languages.includes(repoLang)) {
        registerDetection(tech, repo.name, `Language: ${repoLang} in ${repo.name}`);
      }

      // Check Topics match
      if (tech.topics && tech.topics.some(t => topicsLower.includes(t))) {
        const matchedTopic = tech.topics.find(t => topicsLower.includes(t));
        registerDetection(tech, repo.name, `Topic: "${matchedTopic}" in ${repo.name}`);
      }

      // Check keyword in description/name (word boundary check)
      if (tech.keywords) {
        for (const kw of tech.keywords) {
          const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
          if (regex.test(repoText)) {
            registerDetection(tech, repo.name, `Description keyword: "${kw}" in ${repo.name}`);
            break;
          }
        }
      }
    }
  }

  // 2. Scan Manifests & Dependency Files (package.json, requirements.txt, etc.)
  for (const [repoName, manifests] of Object.entries(manifestsByRepo)) {
    for (const manifest of manifests) {
      const fileName = manifest.name.toLowerCase();
      const content = manifest.content;

      if (!content) continue;

      if (fileName === 'package.json') {
        try {
          const parsed = typeof content === 'string' ? JSON.parse(content) : content;
          const allDeps = {
            ...(parsed.dependencies || {}),
            ...(parsed.devDependencies || {}),
            ...(parsed.peerDependencies || {})
          };
          const depKeys = Object.keys(allDeps).map(d => d.toLowerCase());

          for (const tech of TECH_DEFINITIONS) {
            if (tech.deps) {
              for (const dep of tech.deps) {
                if (depKeys.includes(dep.toLowerCase())) {
                  registerDetection(tech, repoName, `package.json dependency: "${dep}" in ${repoName}`);
                }
              }
            }
          }
        } catch {
          // JSON parse failed, continue
        }
      } else if (fileName === 'requirements.txt' || fileName === 'pipfile' || fileName === 'pyproject.toml') {
        const lines = typeof content === 'string' ? content.toLowerCase().split('\n') : [];
        for (const tech of TECH_DEFINITIONS) {
          if (tech.deps) {
            for (const dep of tech.deps) {
              const matched = lines.some(line => {
                const cleanLine = line.trim().split(/==|>=|<=|~=|@/)[0].trim();
                return cleanLine === dep.toLowerCase();
              });
              if (matched) {
                registerDetection(tech, repoName, `${fileName} dependency: "${dep}" in ${repoName}`);
              }
            }
          }
        }
      } else if (fileName === 'dockerfile' || fileName === 'docker-compose.yml' || fileName === 'docker-compose.yaml') {
        const dockerTech = TECH_DEFINITIONS.find(t => t.name === 'Docker');
        if (dockerTech) {
          registerDetection(dockerTech, repoName, `Manifest: ${manifest.name} in ${repoName}`);
        }
      } else if (fileName === 'go.mod') {
        const goTech = TECH_DEFINITIONS.find(t => t.name === 'Go');
        if (goTech) registerDetection(goTech, repoName, `Manifest: go.mod in ${repoName}`);
      } else if (fileName === 'cargo.toml') {
        const rustTech = TECH_DEFINITIONS.find(t => t.name === 'Rust');
        if (rustTech) registerDetection(rustTech, repoName, `Manifest: Cargo.toml in ${repoName}`);
      }
    }
  }

  // Convert map to sorted structured array
  const detectedList = Array.from(detectedMap.values()).map(item => ({
    name: item.name,
    category: item.category,
    occurrences: item.count,
    repoCount: item.repos.size,
    repos: Array.from(item.repos).slice(0, 5),
    evidence: Array.from(item.evidence).slice(0, 4)
  }));

  // Sort by repoCount desc, then occurrences desc
  detectedList.sort((a, b) => b.repoCount - a.repoCount || b.occurrences - a.occurrences);

  // Group by category
  const categories = {
    Frontend: [],
    Backend: [],
    Database: [],
    DevOps: [],
    'AI/ML': [],
    Languages: [],
    Testing: [],
    Tooling: []
  };

  for (const tech of detectedList) {
    if (categories[tech.category]) {
      categories[tech.category].push(tech);
    } else {
      categories.Tooling.push(tech);
    }
  }

  return {
    all: detectedList,
    categories,
    primaryStack: detectedList.slice(0, 8).map(t => t.name)
  };
}
