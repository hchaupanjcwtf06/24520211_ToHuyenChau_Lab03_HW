const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const gCoinFormatter = new Intl.NumberFormat('vi-VN');

export function formatVnd(amount: number): string {
  return vndFormatter.format(amount);
}

export function formatGCoin(amount: number): string {
  return `${gCoinFormatter.format(amount)} G-Coin`;
}