export const SHIPPING_RATES: Record<string, number> = {
  'Metro Manila': 150,
  'Luzon': 200,
  'Visayas': 250,
  'Mindanao': 250,
};

export const REGIONS = Object.keys(SHIPPING_RATES);

export function getShippingFee(region: string): number {
  return SHIPPING_RATES[region] ?? 250;
}
