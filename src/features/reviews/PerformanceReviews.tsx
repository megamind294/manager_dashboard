import React, { useMemo } from 'react';
import { useActivity } from '../activity/ActivityProvider';
import { runAuditedMutation } from '../activity/auditedMutation';
import { useReviews } from './ReviewsProvider';

export default function PerformanceReviews({
  employeeId,
  canManage,
}: {
  employeeId: string;
  canManage: boolean;
}) {
  const { reviews, loading, error, resetReviews, updateReview } = useReviews();
  const { recordActivity } = useActivity();
  const visibleReviews = useMemo(
    () => reviews.filter((review) => (
      review.employeeId === employeeId && (canManage || review.status === 'Published')
    )),
    [canManage, employeeId, reviews],
  );

  async function publishReview(id: string, period: string) {
    const previous = reviews.find((review) => review.id === id);
    if (!previous) return;
    await runAuditedMutation({
      mutate: () => updateReview(id, { status: 'Published', updatedAt: new Date().toISOString().slice(0, 10) }),
      audit: () => recordActivity({ actor: 'Admin', action: 'Published review', subject: `${employeeId} · ${period}` }),
      rollback: () => updateReview(id, { status: previous.status, updatedAt: previous.updatedAt }),
    });
  }

  async function recoverReviews() {
    await recordActivity({ actor: 'Admin', action: 'Requested review data recovery', subject: employeeId });
    await resetReviews();
  }

  return (
    <section className="reviews-section" aria-labelledby="performance-reviews-heading">
      <div className="reviews-heading">
        <div>
          <p className="eyebrow">Growth and feedback</p>
          <h3 id="performance-reviews-heading">Performance reviews</h3>
        </div>
        <span>{visibleReviews.length} {visibleReviews.length === 1 ? 'review' : 'reviews'}</span>
      </div>

      {loading ? (
        <p className="reviews-empty">Loading performance reviews…</p>
      ) : error ? (
        <div className="reviews-error" role="alert">
          <p>{error}</p>
          {canManage && (
            <button className="secondary-button" type="button" onClick={() => void recoverReviews()}>
              Reset review data
            </button>
          )}
        </div>
      ) : visibleReviews.length === 0 ? (
        <p className="reviews-empty">{canManage ? 'No performance reviews yet.' : 'No published reviews yet.'}</p>
      ) : (
        <div className="review-list">
          {visibleReviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-card-heading">
                <div>
                  <h4>{review.period}</h4>
                  <p>Rating: {review.rating} / 5</p>
                </div>
                <span className={`review-status review-status-${review.status.toLowerCase()}`}>{review.status}</span>
              </div>
              <dl>
                <div><dt>Feedback</dt><dd>{review.feedback}</dd></div>
                <div><dt>Goals</dt><dd>{review.goals}</dd></div>
              </dl>
              <div className="review-card-footer">
                <span>Updated {new Date(review.updatedAt).toLocaleDateString()}</span>
                {canManage && review.status === 'Draft' && (
                  <button
                    className="primary-button"
                    type="button"
                    aria-label={`Publish ${review.period} review`}
                    onClick={() => void publishReview(review.id, review.period)}
                  >
                    Publish review
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
