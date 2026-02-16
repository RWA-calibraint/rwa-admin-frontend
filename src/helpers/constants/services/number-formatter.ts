export const formatNumber = (num: number) =>
  num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' : num >= 1e3 ? (num / 1e3).toFixed(1) + 'K' : num.toString();

export const calculateTokenPrice = (price: number, tokens: number, toFixed: number) => {
  if (!tokens) {
    return 0;
  }

  return (price / tokens).toFixed(toFixed);
};
