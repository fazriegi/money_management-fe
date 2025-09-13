/**
 * Calculate total value (default: 0)
 * @param {array} listData - array of object with 'value' key
 * @param {string} multiplierField - field in the listData whose value will be the multiplier
 */
export const Calculate = (listData = [], multiplierField = "") => {
  return listData.reduce((sum, row) => {
    let val = row.value;
    let multiplier = 1;

    if (multiplierField !== "") {
      multiplier = row[multiplierField];
    }

    // if it’s already a number, use it directly
    if (typeof val === "number") {
      return sum + val * multiplier;
    }

    // otherwise coerce to string and strip non‑numeric chars
    const numeric = Number(String(val).replace(/[^\d.-]/g, "")) || 0;
    return sum + numeric * multiplier;
  }, 0);
};

/**
 * Get the start and end date of a period based on a given start day of the month.
 *
 * @param {Date} selectedDate - The reference date used to calculate the period.
 * @param {number} startDayOfMonth - The day of the month that marks the start of each period.
 * @returns {{ periodStart: Date, periodEnd: Date }} The calculated period start and end dates.
 */
export function getPeriodRange(selectedDate, startDayOfMonth) {
  if (startDayOfMonth === 1) {
    return [selectedDate.startOf("month"), selectedDate.endOf("month")];
  }

  const periodStart = selectedDate.set("date", startDayOfMonth);

  // if selectedDate < periodStart, still in the previous range
  // so periodStart must be moved back 1 month
  let finalStart = periodStart;
  if (selectedDate.isBefore(periodStart)) {
    finalStart = periodStart.subtract(1, "month");
  }

  const periodEnd = finalStart.add(1, "month").set("date", startDayOfMonth - 1);

  return [finalStart, periodEnd];
}