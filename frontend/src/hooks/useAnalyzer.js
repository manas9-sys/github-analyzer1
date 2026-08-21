import { useState, useCallback, useRef } from 'react';
import { fetchAnalysis } from '../services/api.js';

export const ANALYSIS_STEPS = [
  { id: 'profile', label: 'Fetching GitHub profile & metadata', duration: 400 },
  { id: 'repos', label: 'Fetching public repositories & branch history', duration: 700 },
  { id: 'tech', label: 'Inspecting manifests & detecting technologies', duration: 800 },
  { id: 'metrics', label: 'Calculating quality indicators & language stats', duration: 500 },
  { id: 'ai', label: 'Synthesizing AI engineering evaluation & archetype', duration: 900 },
  { id: 'report', label: 'Finalizing developer score & report', duration: 300 }
];

export function useAnalyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const timerRef = useRef(null);

  const clearStepTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startStepAnimation = () => {
    setCurrentStepIndex(0);
    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_STEPS.length - 1) {
        setCurrentStepIndex(step);
      }
    }, 650);
  };

  const analyze = useCallback(async (targetUsername, forceRefresh = false) => {
    if (!targetUsername || !targetUsername.trim()) return;

    setLoading(true);
    setError(null);
    startStepAnimation();

    try {
      const response = await fetchAnalysis(targetUsername.trim(), forceRefresh);
      
      // Step to final step smoothly
      setCurrentStepIndex(ANALYSIS_STEPS.length - 1);
      setTimeout(() => {
        setData(response.data);
        setFromCache(Boolean(response.fromCache));
        setLoading(false);
        clearStepTimers();
      }, 350);
    } catch (err) {
      clearStepTimers();
      setLoading(false);
      setError({
        message: err.message || 'Failed to analyze profile.',
        status: err.status,
        code: err.code
      });
    }
  }, []);

  const reset = useCallback(() => {
    clearStepTimers();
    setData(null);
    setError(null);
    setLoading(false);
    setCurrentStepIndex(0);
    setFromCache(false);
  }, []);

  return {
    data,
    loading,
    currentStepIndex,
    error,
    fromCache,
    analyze,
    reset
  };
}
