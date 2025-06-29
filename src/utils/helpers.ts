export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function normalizeValue(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

export function denormalizeValue(normalized: number, min: number, max: number): number {
  return normalized * (max - min) + min;
}

export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

export function linearToDb(linear: number): number {
  return 20 * Math.log10(Math.max(0.0001, linear));
}

export function formatFrequency(freq: number): string {
  if (freq < 1000) {
    return `${Math.round(freq)}Hz`;
  }
  return `${(freq / 1000).toFixed(1)}kHz`;
}