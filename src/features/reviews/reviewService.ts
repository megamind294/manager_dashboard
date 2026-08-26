export type ReviewStatus = 'Draft' | 'Published';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  period: string;
  rating: number;
  goals: string;
  feedback: string;
  status: ReviewStatus;
  updatedAt: string;
}

export type ReviewUpdates = Partial<Omit<PerformanceReview, 'id' | 'employeeId'>>;

export interface ReviewService {
  listReviews(): Promise<PerformanceReview[]>;
  listReviewsByEmployee(employeeId: string): Promise<PerformanceReview[]>;
  createReview(review: PerformanceReview): Promise<PerformanceReview>;
  updateReview(id: string, updates: ReviewUpdates): Promise<PerformanceReview>;
  resetReviews(): Promise<PerformanceReview[]>;
}

export const REVIEW_STORAGE_KEY = 'northstar-hr-performance-reviews';

export const seedReviews: PerformanceReview[] = [
  {
    id: 'REV-001',
    employeeId: 'EMP-001',
    period: '2026 H1',
    rating: 4,
    goals: 'Own two accessibility improvements across the employee workspace.',
    feedback: 'Consistently delivers reliable UI work and supports the wider team.',
    status: 'Published',
    updatedAt: '2026-07-03',
  },
  {
    id: 'REV-002',
    employeeId: 'EMP-002',
    period: '2026 H1',
    rating: 5,
    goals: 'Lead the shared component migration.',
    feedback: 'Excellent technical leadership and delivery quality.',
    status: 'Published',
    updatedAt: '2026-07-05',
  },
  {
    id: 'REV-003',
    employeeId: 'EMP-003',
    period: '2026 H1',
    rating: 3,
    goals: 'Complete research and validation for the onboarding redesign.',
    feedback: 'Strong research; delivery planning needs more predictable milestones.',
    status: 'Draft',
    updatedAt: '2026-07-07',
  },
];

export class ReviewDataError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'ReviewDataError';
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

type StorageSource = Storage | (() => Storage);

function cloneReviews(reviews: PerformanceReview[]) {
  return reviews.map((review) => ({ ...review }));
}

function isReview(value: unknown): value is PerformanceReview {
  if (!value || typeof value !== 'object') return false;
  const review = value as Record<string, unknown>;
  return (
    typeof review.id === 'string' && review.id.length > 0 &&
    typeof review.employeeId === 'string' && review.employeeId.length > 0 &&
    typeof review.period === 'string' && review.period.length > 0 &&
    Number.isInteger(review.rating) && Number(review.rating) >= 1 && Number(review.rating) <= 5 &&
    typeof review.goals === 'string' &&
    typeof review.feedback === 'string' &&
    (review.status === 'Draft' || review.status === 'Published') &&
    typeof review.updatedAt === 'string' && review.updatedAt.length > 0
  );
}

function reviewPeriodKey(review: Pick<PerformanceReview, 'employeeId' | 'period'>) {
  return `${review.employeeId}\u0000${review.period.trim().toLowerCase()}`;
}

export function createReviewService(storageSource: StorageSource): ReviewService {
  function storage() {
    try {
      return typeof storageSource === 'function' ? storageSource() : storageSource;
    } catch (cause) {
      throw new ReviewDataError('Performance review storage is not available.', { cause });
    }
  }

  function write(reviews: PerformanceReview[]) {
    try {
      storage().setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
      return cloneReviews(reviews);
    } catch (cause) {
      throw new ReviewDataError('Performance reviews could not be saved.', { cause });
    }
  }

  function read() {
    let stored: string | null;
    try {
      stored = storage().getItem(REVIEW_STORAGE_KEY);
    } catch (cause) {
      throw new ReviewDataError('Performance reviews could not be read.', { cause });
    }

    if (stored === null) return write(seedReviews);

    try {
      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed) || !parsed.every(isReview)) {
        throw new Error('Stored value is not a performance-review array.');
      }
      const ids = parsed.map((review) => review.id);
      const periods = parsed.map(reviewPeriodKey);
      if (new Set(ids).size !== ids.length || new Set(periods).size !== periods.length) {
        throw new Error('Stored performance reviews contain duplicate identities.');
      }
      return cloneReviews(parsed);
    } catch (cause) {
      throw new ReviewDataError('Stored performance review data is malformed.', { cause });
    }
  }

  return {
    async listReviews() {
      return read();
    },

    async listReviewsByEmployee(employeeId) {
      return read().filter((review) => review.employeeId === employeeId);
    },

    async createReview(review) {
      if (!isReview(review)) {
        throw new ReviewDataError('Performance review data is invalid.');
      }
      const reviews = read();
      if (reviews.some((candidate) => candidate.id === review.id)) {
        throw new ReviewDataError(`Review ${review.id} already exists.`);
      }
      if (reviews.some((candidate) => reviewPeriodKey(candidate) === reviewPeriodKey(review))) {
        throw new ReviewDataError('A review already exists for this employee and period.');
      }
      write([review, ...reviews]);
      return { ...review };
    },

    async updateReview(id, updates) {
      const reviews = read();
      const index = reviews.findIndex((review) => review.id === id);
      if (index === -1) throw new ReviewDataError(`Review ${id} was not found.`);

      const updated = { ...reviews[index], ...updates, id, employeeId: reviews[index].employeeId };
      if (!isReview(updated)) throw new ReviewDataError('Performance review data is invalid.');
      if (reviews.some((candidate, candidateIndex) => (
        candidateIndex !== index && reviewPeriodKey(candidate) === reviewPeriodKey(updated)
      ))) {
        throw new ReviewDataError('A review already exists for this employee and period.');
      }

      const nextReviews = [...reviews];
      nextReviews[index] = updated;
      write(nextReviews);
      return { ...updated };
    },

    async resetReviews() {
      return write(seedReviews);
    },
  };
}

export const reviewService = createReviewService(() => window.localStorage);
