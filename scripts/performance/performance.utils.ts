import { styler } from '@sorg/log';

// Env
export const getSassFile = (lines: number): string =>
  `scripts/performance/test-sass-files/sass-${lines}-lines.sass`;

// Log utils
export const percentageChange = (n: number, n2: number) => ((n2 - n) / n) * 100;
export const num = (n: string | number) => styler(n.toString(), '#1f7');
export const neg = (n: string | number) => styler(n.toString(), '#f25');
/** **ONLY FOR PERFORMANCE CHECK** */
export const grey = (n: string | number) => styler(n.toString(), '#aaa');
export const info = (n: string | number) =>
  styler(n.toString(), { color: '#699', 'font-weight': 'bold' });
export const infoHeader = (n: string | number) =>
  styler(n.toString(), { 'font-weight': 'bold', color: '#aaa' });
const msAndPercentColor = '#09f';
export const ms = styler('ms', msAndPercentColor);
export const p = styler('%', msAndPercentColor);

export function getChange(old: number | BigInt, current: number | BigInt) {
  const change = percentageChange(Number(current), Number(old));
  const sign = Math.sign(change);
  if (sign === 0) return grey('0.00');
  return sign === 1 ? num(change.toFixed(2)) : neg(change.toFixed(2));
}

export function getMedian(values: number[]) {
  if (values.length === 0) return 0;

  values.sort(function(a, b) {
    return a - b;
  });

  const half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}
