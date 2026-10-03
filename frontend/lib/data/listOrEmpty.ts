// Some APIs answer 404 when a business has no records yet.
// That is not an error, it just means an empty list.

function isNotFoundError(error: unknown): boolean {
  const { status, response } = (error ?? {}) as {
    status?: number;
    response?: { status?: number };
  };
  return status === 404 || response?.status === 404;
}

/**
 * Runs a list request and returns [] for "nothing found".
 * Real failures are re-thrown so error.tsx can show them.
 *
 *   const sales = await listOrEmpty(() => getSalesByBusinessId(api, id));
 */
export async function listOrEmpty<T>(
  request: () => Promise<T[] | null | undefined>,
): Promise<T[]> {
  try {
    return (await request()) ?? [];
  } catch (error) {
    if (isNotFoundError(error)) return [];
    throw error;
  }
}