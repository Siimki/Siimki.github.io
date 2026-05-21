export const companyStartDate = "2005-10-19";

export function fullYearsSince(startDate: string, now = new Date()) {
  const start = new Date(`${startDate}T00:00:00`);
  let years = now.getFullYear() - start.getFullYear();
  const anniversaryThisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate());

  if (now < anniversaryThisYear) {
    years -= 1;
  }

  return Math.max(0, years);
}
