export const CURRENCY = "IDR";

export const FORMATNUMBER = (value) =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
