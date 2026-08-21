import React, { useState, useEffect } from 'react';
import { useAnalyzer } from './hooks/useAnalyzer.js';
import { Navbar } from './components/Navbar.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { LoadingState } from './components/LoadingState.jsx';
import { ErrorState } from './components/ErrorState.jsx';
import { DashboardHeader } from './components/DashboardHeader.jsx';
import { QuickStatsBar } from './components/QuickStatsBar.jsx';
import { DeveloperScoreCard } from './components/DeveloperScoreCard.jsx';
import { DeveloperArchetypeCard } from './components/DeveloperArchetypeCard.jsx';
import { TechStackSection } from './components/TechStackSection.jsx';
import { LanguageDistributionChart } from './components/LanguageDistributionChart.jsx';
import { ActivityTimelineChart } from './components/ActivityTimelineChart.jsx';
import { RepoQualityRadarChart } from './components/RepoQualityRadarChart.jsx';
import { AIInsightsSection } from './components/AIInsightsSection.jsx';
import { RecommendedProjectsSection } from './components/RecommendedProjectsSection.jsx';
import { RepoExplorer } from './components/RepoExplorer.jsx';
import { RepoDetailModal } from './components/RepoDetailModal.jsx';
import { ShareExportModal } from './components/ShareExportModal.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  const { data, loading, currentStepIndex, error, fromCache, analyze, reset } = useAnalyzer();
  const [currentUsername, setCurrentUsername] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Check URL on initial load for /u/:username
  useEffect(() => {
    const parseUrlUsername = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/u\/([^/?#]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        setCurrentUsername(decoded);
        analyze(decoded, false);
      }
    };

    parseUrlUsername();

    const handlePopState = () => {
      parseUrlUsername();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [analyze]);

  const handleSearch = (username, forceRefresh = false) => {
    const clean = username.trim();
    if (!clean) return;

    setCurrentUsername(clean);
    window.history.pushState({}, '', `/u/${encodeURIComponent(clean)}`);
    analyze(clean, forceRefresh);
  };

  const handleRefresh = () => {
    if (currentUsername) {
      handleSearch(currentUsername, true);
    }
  };

  const handleHome = () => {
    reset();
    setCurrentUsername('');
    setSelectedRepo(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-github-darkest text-github-textPrimary font-sans">
      {/* Navigation */}
      <Navbar
        onSearch={(u) => handleSearch(u)}
        currentUsername={data ? data.username : null}
        onRefresh={handleRefresh}
        onShare={() => setShowShareModal(true)}
        onHome={handleHome}
        isSearching={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        {/* Loading State */}
        {loading && (
          <LoadingState
            currentStepIndex={currentStepIndex}
            targetUsername={currentUsername}
          />
        )}

        {/* Error State */}
        {!loading && error && (
          <ErrorState
            error={error}
            username={currentUsername}
            onRetry={() => handleSearch(currentUsername, true)}
            onHome={handleHome}
          />
        )}

        {/* Landing Hero (when no data, not loading, no error) */}
        {!loading && !error && !data && (
          <HeroSection
            onSearch={(u) => handleSearch(u)}
            loading={loading}
          />
        )}

        {/* Full Dashboard View */}
        {!loading && !error && data && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Header Profile Banner */}
            <DashboardHeader
              userProfile={data.userProfile}
              analyzedAt={data.analyzedAt}
              fromCache={fromCache}
              onShare={() => setShowShareModal(true)}
            />

            {/* 2. Quick Key Stats Bar */}
            <QuickStatsBar
              overview={data.overview}
              languageDistribution={data.languageDistribution}
            />

            {/* 3. Developer Score & Archetype Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <DeveloperScoreCard scoreData={data.score} />
              </div>
              <div className="lg:col-span-6">
                <DeveloperArchetypeCard
                  aiAnalysis={data.aiAnalysis}
                  username={data.username}
                />
              </div>
            </div>

            {/* 4. Tech Stack Section */}
            <TechStackSection techStack={data.techStack} />

            {/* 5. Charts Grid: Languages, Activity Timeline, Radar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <LanguageDistributionChart
                  languageDistribution={data.languageDistribution}
                />
              </div>
              <div>
                <ActivityTimelineChart
                  activityTimeline={data.activityTimeline}
                />
              </div>
              <div>
                <RepoQualityRadarChart
                  radarMetrics={data.score.radarMetrics}
                />
              </div>
            </div>

            {/* 6. AI Insights: Strengths & Growth Areas */}
            <AIInsightsSection aiAnalysis={data.aiAnalysis} />

            {/* 7. Recommended Projects Roadmap */}
            <RecommendedProjectsSection
              recommendedProjects={data.aiAnalysis.recommendedProjects}
            />

            {/* 8. Repository Explorer */}
            <RepoExplorer
              repos={data.repos}
              onSelectRepo={(repo) => setSelectedRepo(repo)}
            />
          </div>
        )}
      </main>

      {/* Drilldown Repository Modal */}
      {selectedRepo && (
        <RepoDetailModal
          repo={selectedRepo}
          username={data?.username}
          onClose={() => setSelectedRepo(null)}
        />
      )}

      {/* Share & Export Modal */}
      {showShareModal && data && (
        <ShareExportModal
          data={data}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
