import React from 'react';
import { useActivity } from './ActivityProvider';

export default function ActivityFeed() {
  const { activities, loading, error } = useActivity();
  return (
    <section className="insight-panel" aria-labelledby="activity-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Audit trail</p><h3 id="activity-heading">Recent activity</h3></div>
        <span>{activities.length} events</span>
      </div>
      {loading ? <p className="muted-state">Loading activity…</p> : error ? (
        <div className="reviews-error" role="alert"><p>{error} The original audit log was preserved.</p></div>
      ) : (
        <ol className="activity-list">
          {activities.slice(0, 5).map((activity) => (
            <li key={activity.id}>
              <strong>{activity.action}</strong>
              <span>{activity.subject}</span>
              <time dateTime={activity.occurredAt}>{new Date(activity.occurredAt).toLocaleString()}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
