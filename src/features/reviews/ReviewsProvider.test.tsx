import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { ReviewsProvider, useReviews } from './ReviewsProvider';
import { createReviewService } from './reviewService';
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

let actions: ReturnType<typeof useReviews>;

function Probe() {
  actions = useReviews();
  if (actions.loading) return <p>Loading reviews</p>;
  if (actions.error) return <p>{actions.error}</p>;
  return <p>{actions.reviews.map((item) => `${item.id}:${item.status}`).join(',')}</p>;
}

describe('ReviewsProvider', () => {
  test('loads reviews and keeps context in sync after persisted mutations', async () => {
    const service = createReviewService(new MemoryStorage());
    render(<ReviewsProvider service={service}><Probe /></ReviewsProvider>);

    expect(screen.getByText('Loading reviews')).toBeInTheDocument();
    await screen.findByText(/REV-001:Published/);

    await act(async () => { await actions.createReview(review); });
    expect(screen.getByText(/REV-900:Draft/)).toBeInTheDocument();

    await act(async () => { await actions.updateReview(review.id, { status: 'Published' }); });
    expect(screen.getByText(/REV-900:Published/)).toBeInTheDocument();
  });

  test('reports malformed storage and recovers after explicit reset', async () => {
    const storage = new MemoryStorage();
    storage.setItem('northstar-hr-performance-reviews', '{broken');
    const service = createReviewService(storage);
    render(<ReviewsProvider service={service}><Probe /></ReviewsProvider>);

    await screen.findByText('Stored performance review data is malformed.');
    await act(async () => { await actions.resetReviews(); });
    expect(await screen.findByText(/REV-001:Published/)).toBeInTheDocument();
  });

  test('requires useReviews to be rendered inside its provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Probe />)).toThrow('useReviews must be used within ReviewsProvider.');
    consoleError.mockRestore();
  });
});
