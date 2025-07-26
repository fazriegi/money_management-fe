/**
 * Calculate total value (default: 0)
 * @param {array} listData - array of object with 'value' key
 */
export const Calculate = (listData = []) => {
    return listData.reduce((sum, row) => {
        let val = row.value;

        // if it’s already a number, use it directly
        if (typeof val === "number") {
        return sum + val;
        }

        // otherwise coerce to string and strip non‑numeric chars
        const numeric = Number(String(val).replace(/[^\d.-]/g, "")) || 0;
        return sum + numeric;
    }, 0);
};