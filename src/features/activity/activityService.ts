export interface ActivityRecord {
  id: string;
  actor: 'Admin';
  action: string;
  subject: string;
  occurredAt: string;
}

export type NewActivity = Pick<ActivityRecord, 'actor' | 'action' | 'subject'>;

export interface ActivityService {
  listActivities(): Promise<ActivityRecord[]>;
  recordActivity(activity: NewActivity): Promise<ActivityRecord>;
}

export const ACTIVITY_STORAGE_KEY = 'northstar-hr-activity';
export const seedActivities: ActivityRecord[] = [
  { id: 'ACT-001', actor: 'Admin', action: 'Completed onboarding', subject: 'Maya Patel', occurredAt: '2026-08-24T09:30:00.000Z' },
  { id: 'ACT-002', actor: 'Admin', action: 'Scheduled payroll', subject: 'Noah Smith · 2026-08', occurredAt: '2026-08-23T14:15:00.000Z' },
];

type StorageSource = Storage | (() => Storage);

function clone(records: ActivityRecord[]) {
  return records.map((record) => ({ ...record }));
}

function isActivity(value: unknown): value is ActivityRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && record.actor === 'Admin' &&
    typeof record.action === 'string' && typeof record.subject === 'string' &&
    typeof record.occurredAt === 'string';
}

export function createActivityService(
  storageSource: StorageSource,
  now = () => new Date().toISOString(),
  createId = () => `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
): ActivityService {
  const storage = () => typeof storageSource === 'function' ? storageSource() : storageSource;
  const write = (records: ActivityRecord[]) => {
    storage().setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(records));
    return clone(records);
  };
  const read = () => {
    const stored = storage().getItem(ACTIVITY_STORAGE_KEY);
    if (stored === null) return write(seedActivities);
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isActivity) || new Set(parsed.map((record) => record.id)).size !== parsed.length) {
      throw new Error('Stored activity data is malformed.');
    }
    return clone(parsed);
  };

  return {
    async listActivities() { return read(); },
    async recordActivity(activity) {
      const history = read();
      const existingIds = new Set(history.map((record) => record.id));
      let id = createId();
      let attempts = 1;
      while (existingIds.has(id) && attempts < 10) {
        id = createId();
        attempts += 1;
      }
      if (existingIds.has(id)) throw new Error('A unique activity identity could not be generated.');
      const created: ActivityRecord = { ...activity, id, occurredAt: now() };
      write([created, ...history]);
      return { ...created };
    },
  };
}

export const activityService = createActivityService(() => window.localStorage);
