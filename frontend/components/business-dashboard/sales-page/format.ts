// One place for how money and dates look across the app.

// TODO: set your currency code (e.g. "USD", "NGN", "GBP")
const CURRENCY_CODE = "USD";

const priceFormatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: CURRENCY_CODE,
});

export const formatPrice = (amount: number) => priceFormatter.format(amount);

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });