import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { activityService, ActivityRecord, ActivityService, NewActivity } from './activityService';

interface ActivityContextValue {
  activities: ActivityRecord[];
  loading: boolean;
  error: string | null;
  recordActivity: (activity: NewActivity) => Promise<ActivityRecord>;
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

export function ActivityProvider({ children, service = activityService }: { children: ReactNode; service?: ActivityService }) {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setActivities(await service.listActivities()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Activity history is unavailable.'); }
    finally { setLoading(false); }
  }, [service]);

  useEffect(() => { void load(); }, [load]);

  const value = useMemo<ActivityContextValue>(() => ({
    activities, loading, error,
    async recordActivity(activity) {
      try {
        const created = await service.recordActivity(activity);
        setActivities((current) => [created, ...current]);
        return created;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Activity history could not be updated.');
        throw cause;
      }
    },
  }), [activities, error, loading, service]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider.');
  return context;
}
