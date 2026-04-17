/**
 * Lightweight SM-2 inspired spaced repetition.
 * Returns the next review interval (in days) and updated ease factor.
 */
export interface SrsState {
  ease_factor: number;
  interval_days: number;
}

export interface SrsResult {
  ease_factor: number;
  interval_days: number;
  next_review_at: string; // ISO
}

export function nextReview(prev: SrsState | null, isCorrect: boolean): SrsResult {
  let ef = prev?.ease_factor ?? 2.5;
  let interval = prev?.interval_days ?? 0;

  if (!isCorrect) {
    ef = Math.max(1.3, ef - 0.2);
    interval = 1;
  } else {
    if (interval === 0) interval = 1;
    else if (interval === 1) interval = 3;
    else interval = Math.round(interval * ef);
    ef = Math.min(2.8, ef + 0.05);
  }

  const next = new Date();
  next.setDate(next.getDate() + interval);
  return { ease_factor: ef, interval_days: interval, next_review_at: next.toISOString() };
}
