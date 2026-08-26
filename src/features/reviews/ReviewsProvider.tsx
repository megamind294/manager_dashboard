import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { reviewService } from './reviewService';
import type { PerformanceReview, ReviewService, ReviewUpdates } from './reviewService';

interface ReviewsContextValue {
  reviews: PerformanceReview[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  resetReviews: () => Promise<void>;
  createReview: (review: PerformanceReview) => Promise<PerformanceReview>;
  updateReview: (id: string, updates: ReviewUpdates) => Promise<PerformanceReview>;
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Performance reviews are unavailable.';
}

export function ReviewsProvider({
  children,
  service = reviewService,
}: {
  children: ReactNode;
  service?: ReviewService;
}) {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReviews(await service.listReviews());
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ReviewsContextValue>(() => ({
    reviews,
    loading,
    error,
    refresh,
    async resetReviews() {
      setLoading(true);
      setError(null);
      try {
        setReviews(await service.resetReviews());
      } catch (cause) {
        setError(errorMessage(cause));
      } finally {
        setLoading(false);
      }
    },
    async createReview(review) {
      try {
        const created = await service.createReview(review);
        setReviews((current) => [created, ...current]);
        return created;
      } catch (cause) {
        setError(errorMessage(cause));
        throw cause;
      }
    },
    async updateReview(id, updates) {
      try {
        const updated = await service.updateReview(id, updates);
        setReviews((current) => current.map((item) => (item.id === id ? updated : item)));
        return updated;
      } catch (cause) {
        setError(errorMessage(cause));
        throw cause;
      }
    },
  }), [error, loading, refresh, reviews, service]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewsProvider.');
  }
  return context;
}
