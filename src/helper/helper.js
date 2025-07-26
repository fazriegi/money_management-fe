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
