import {
  REVIEW_STORAGE_KEY,
  ReviewDataError,
  createReviewService,
  seedReviews,
} from './reviewService';
import type { PerformanceReview } from './reviewService';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const review: PerformanceReview = {
  id: 'REV-900',
  employeeId: 'EMP-001',
  period: '2026 H2',
  rating: 4,
  goals: 'Lead the design-system rollout.',
  feedback: 'Strong delivery and collaboration.',
  status: 'Draft',
  updatedAt: '2026-08-26',
};

test('initializes missing review storage from seed data', async () => {
  const storage = new MemoryStorage();
  const service = createReviewService(storage);

  await expect(service.listReviews()).resolves.toEqual(seedReviews);
  expect(JSON.parse(storage.getItem(REVIEW_STORAGE_KEY) as string)).toEqual(seedReviews);
});

test('treats saved review data as authoritative', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([review]));

  await expect(createReviewService(storage).listReviews()).resolves.toEqual([review]);
});

test('lists reviews for one employee', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([review, { ...review, id: 'REV-901', employeeId: 'EMP-002' }]));

  await expect(createReviewService(storage).listReviewsByEmployee('EMP-001')).resolves.toEqual([review]);
});

test('persists create and update while preserving review identity', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([]));
  const service = createReviewService(storage);

  await expect(service.createReview(review)).resolves.toEqual(review);
  await expect(service.updateReview(review.id, {
    rating: 5,
    status: 'Published',
    id: 'REPLACED',
    employeeId: 'EMP-999',
  } as Parameters<typeof service.updateReview>[1] & { id: string; employeeId: string })).resolves.toEqual({
    ...review,
    rating: 5,
    status: 'Published',
  });
});

test('rejects duplicate employee and review-period combinations', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([review]));

  await expect(createReviewService(storage).createReview({ ...review, id: 'REV-901' }))
    .rejects.toThrow('A review already exists for this employee and period.');
});

test('rejects invalid ratings and unknown review updates', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([]));
  const service = createReviewService(storage);

  await expect(service.createReview({ ...review, rating: 6 })).rejects.toBeInstanceOf(ReviewDataError);
  await expect(service.updateReview('missing', { rating: 3 })).rejects.toBeInstanceOf(ReviewDataError);
});

test('reports malformed storage without replacing it', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, '{broken');

  await expect(createReviewService(storage).listReviews()).rejects.toBeInstanceOf(ReviewDataError);
  expect(storage.getItem(REVIEW_STORAGE_KEY)).toBe('{broken');
});

test('explicit reset replaces malformed data with seed reviews', async () => {
  const storage = new MemoryStorage();
  storage.setItem(REVIEW_STORAGE_KEY, 'invalid');
  const service = createReviewService(storage);

  await expect(service.resetReviews()).resolves.toEqual(seedReviews);
  await expect(service.listReviews()).resolves.toEqual(seedReviews);
});
