export function calculateSkipDatabase(page: number, per_page: number) {
  page = Math.max(1, page);

  per_page = Math.max(1, per_page);

  const skip = (page - 1) * per_page;

  return skip;
}
