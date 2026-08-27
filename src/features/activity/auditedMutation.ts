export async function runAuditedMutation<T>({
  mutate,
  audit,
  rollback,
}: {
  mutate: () => Promise<T>;
  audit: (result: T) => Promise<unknown>;
  rollback: (result: T) => Promise<unknown>;
}): Promise<T> {
  const result = await mutate();
  try {
    await audit(result);
    return result;
  } catch (cause) {
    await rollback(result);
    throw cause;
  }
}
