export type DiscountCode = {
  code: string;
  percentage: number;
  label: string;
};

export const DISCOUNT_CODES: DiscountCode[] = [
  { code: "autoparts10", percentage: 10, label: '10% descuento' },
  { code: "taller15", percentage: 15, label: "15% para talleres" },
  { code: "nuevo20", percentage: 20, label: "20% nuevos usuarios" },
];

export function getDiscountPercentage(rawCode: string): number | null {
  const code = rawCode.trim().toLowerCase();
  if (!code) return null;
  const found = DISCOUNT_CODES.find((x) => x.code === code);
  return found ? found.percentage : null;
}
