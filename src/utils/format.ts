export const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: v % 1 === 0 ? 0 : 2 }).format(v);

export const percentageOff = (price: number, orig?: number) =>
  orig && orig > price ? Math.round(((orig - price) / orig) * 100) : null;
