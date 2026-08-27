import { ACTIVITY_STORAGE_KEY, createActivityService, seedActivities } from './activityService';

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; }, clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null, key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => { values.delete(key); }, setItem: (key, value) => { values.set(key, value); },
  };
}

test('records a new immutable activity at the start of the feed', async () => {
  const storage = memoryStorage();
  const service = createActivityService(storage, () => '2026-08-26T20:00:00.000Z', () => 'ACT-100');

  const created = await service.recordActivity({ actor: 'Admin', action: 'Published review', subject: 'Noah Smith · 2026 H1' });

  expect(created).toEqual({ id: 'ACT-100', occurredAt: '2026-08-26T20:00:00.000Z', actor: 'Admin', action: 'Published review', subject: 'Noah Smith · 2026 H1' });
  expect((await service.listActivities())[0]).toEqual(created);
  expect(JSON.parse(storage.getItem(ACTIVITY_STORAGE_KEY) ?? '[]')).toHaveLength(seedActivities.length + 1);
});

test('returns defensive copies so callers cannot mutate feed history', async () => {
  const service = createActivityService(memoryStorage(), () => '2026-08-26T20:00:00.000Z', () => 'ACT-100');
  const first = await service.listActivities();
  first[0].action = 'Changed outside service';

  expect((await service.listActivities())[0].action).not.toBe('Changed outside service');
});

test('rejects persisted activity histories with duplicate ids', async () => {
  const storage = memoryStorage();
  storage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([seedActivities[0], { ...seedActivities[1], id: seedActivities[0].id }]));

  await expect(createActivityService(storage).listActivities()).rejects.toThrow('Stored activity data is malformed.');
});

test('retries generated ids that collide with immutable history', async () => {
  const storage = memoryStorage();
  const ids = jest.fn().mockReturnValueOnce('ACT-001').mockReturnValueOnce('ACT-NEW');
  const service = createActivityService(storage, () => '2026-08-26T20:00:00.000Z', ids);
  await service.listActivities();

  const created = await service.recordActivity({ actor: 'Admin', action: 'Updated employee', subject: 'Maya Patel' });

  expect(created.id).toBe('ACT-NEW');
  expect(ids).toHaveBeenCalledTimes(2);
});
