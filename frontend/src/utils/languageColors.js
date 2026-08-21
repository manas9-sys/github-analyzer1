/**
 * Official GitHub Language Color Mapping
 */
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Haskell: '#5e5086',
  Lua: '#000080',
  Perl: '#0298c3',
  Solidity: '#AA6746',
  Zig: '#ec915c',
  Nim: '#ffc200',
  HCL: '#844FBA',
  Dockerfile: '#384d54',
  Other: '#8b949e'
};

export function getLanguageColor(language) {
  if (!language) return LANGUAGE_COLORS.Other;
  return LANGUAGE_COLORS[language] || '#8b949e';
}
