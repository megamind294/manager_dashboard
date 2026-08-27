import { runAuditedMutation } from './auditedMutation';

test('returns the mutation result after its audit record succeeds', async () => {
  const result = await runAuditedMutation({
    mutate: async () => 'updated',
    audit: async () => undefined,
    rollback: async () => undefined,
  });

  expect(result).toBe('updated');
});

test('rolls back the domain mutation when the audit write fails', async () => {
  const rollback = jest.fn(async () => undefined);

  await expect(runAuditedMutation({
    mutate: async () => 'updated',
    audit: async () => { throw new Error('audit unavailable'); },
    rollback,
  })).rejects.toThrow('audit unavailable');
  expect(rollback).toHaveBeenCalledWith('updated');
});
