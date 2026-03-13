import { useCallback, useMemo } from 'react';
import { useSubscription } from '@/hooks/use-subscription';

/**
 * Free-tier usage limits tracked via localStorage.
 * Premium users bypass all limits.
 */

const KEYS = {
  iaUses: 'lt-free-ia-uses',
  tripEdits: 'lt-free-trip-edits',
  tripsCreated: 'lt-free-trips-created',
  luckyListViews: 'lt-free-lucky-views',
  autoOrganize: 'lt-free-auto-organize',
} as const;

const LIMITS = {
  iaUses: 3,
  tripEdits: 3,
  tripsCreated: 1,
  luckyListViews: 3,
  autoOrganize: 1,
} as const;

function getCount(key: string): number {
  return parseInt(localStorage.getItem(key) || '0', 10);
}

function increment(key: string): number {
  const next = getCount(key) + 1;
  localStorage.setItem(key, String(next));
  return next;
}

export type LimitKey = keyof typeof LIMITS;

export interface FreeLimits {
  /** Current count for a given feature */
  getCount: (key: LimitKey) => number;
  /** Max allowed for free tier */
  getLimit: (key: LimitKey) => number;
  /** Whether the user can still use this feature (always true for premium) */
  canUse: (key: LimitKey) => boolean;
  /** Increment usage counter. Returns true if the action is allowed, false if blocked. */
  recordUse: (key: LimitKey) => boolean;
  /** Whether user is premium (bypasses all limits) */
  isPremium: boolean;
  /** Helper: "X de Y" label */
  usageLabel: (key: LimitKey) => string;
  /** Whether user has hit or exceeded the limit */
  isAtLimit: (key: LimitKey) => boolean;
}

export const useFreeLimits = (): FreeLimits => {
  const { isPremium } = useSubscription();

  const getCountFn = useCallback((key: LimitKey) => getCount(KEYS[key]), []);

  const getLimitFn = useCallback((key: LimitKey) => LIMITS[key], []);

  const canUse = useCallback(
    (key: LimitKey) => {
      if (isPremium) return true;
      return getCount(KEYS[key]) < LIMITS[key];
    },
    [isPremium]
  );

  const isAtLimit = useCallback(
    (key: LimitKey) => {
      if (isPremium) return false;
      return getCount(KEYS[key]) >= LIMITS[key];
    },
    [isPremium]
  );

  const recordUse = useCallback(
    (key: LimitKey): boolean => {
      if (isPremium) return true;
      const current = getCount(KEYS[key]);
      if (current >= LIMITS[key]) return false;
      increment(KEYS[key]);
      return true;
    },
    [isPremium]
  );

  const usageLabel = useCallback(
    (key: LimitKey) => {
      const current = getCount(KEYS[key]);
      const max = LIMITS[key];
      return `${Math.min(current, max)} de ${max}`;
    },
    []
  );

  return useMemo(
    () => ({ getCount: getCountFn, getLimit: getLimitFn, canUse, recordUse, isPremium, usageLabel, isAtLimit }),
    [getCountFn, getLimitFn, canUse, recordUse, isPremium, usageLabel, isAtLimit]
  );
};
