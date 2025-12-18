/**
 * SUBSCRIBER BEHAVIOR LOCK
 * 
 * Behavioral rules for subscribed users in Lucky List.
 * No UI changes, no premium signaling.
 * 
 * Internal label: "Premium behavior — silent execution"
 */

export interface SubscriberState {
  isSubscribed: boolean;
  accessGrantedAt?: Date;
}

/**
 * BEHAVIOR RULES
 * 
 * 1) Direct Access — No gating, confirmations, or unlock transitions
 * 2) Content Exposure — Full content, no truncation or blur
 * 3) Editorial Tone — Guidance, not exclusivity
 * 4) Conditional Fields — Show only if populated
 * 5) Contextual Navigation — Return to original context
 */
export const SUBSCRIBER_BEHAVIOR = {
  directAccess: {
    enabled: true,
    noGatingScreens: true,
    noConfirmations: true,
    noUnlockTransitions: true,
  },
  contentExposure: {
    fullContent: true,
    noTruncation: true,
    noBlur: true,
    noTeasers: true,
    noPartialHiding: true,
  },
  editorialTone: {
    feelsLikeGuidance: true,
    noExclusivityLanguage: true,
    noVIPSignaling: true,
  },
  conditionalFields: {
    hideEmptyPlaceholders: true,
    showOnlyIfPopulated: ['externalLink', 'mediaUrl'],
  },
  navigation: {
    returnToOriginalContext: true,
    neverRedirectToHome: true,
    neverRedirectToGenericView: true,
  },
} as const;

/**
 * Navigation context tracking
 */
export interface NavigationContext {
  origin: 'lucky-list-index' | 'neighborhood' | 'map';
  neighborhoodId?: string;
  scrollPosition?: number;
}

let currentNavigationContext: NavigationContext | null = null;

export const setNavigationContext = (context: NavigationContext): void => {
  currentNavigationContext = context;
};

export const getNavigationContext = (): NavigationContext | null => {
  return currentNavigationContext;
};

export const clearNavigationContext = (): void => {
  currentNavigationContext = null;
};

/**
 * Get return path based on navigation context
 */
export const getReturnPath = (): string => {
  const context = getNavigationContext();
  
  if (!context) {
    return '/lucky-list';
  }
  
  switch (context.origin) {
    case 'neighborhood':
      return context.neighborhoodId 
        ? `/rio/${context.neighborhoodId}` 
        : '/lucky-list';
    case 'map':
      return '/rio';
    case 'lucky-list-index':
    default:
      return '/lucky-list';
  }
};

/**
 * Check if field should be displayed (only if populated)
 */
export const shouldDisplayField = (value: string | null | undefined): boolean => {
  return Boolean(value && value.trim().length > 0);
};

/**
 * Subscriber access check
 */
export const hasSubscriberAccess = (state: SubscriberState): boolean => {
  return state.isSubscribed;
};

/**
 * Get content access mode for a user
 */
export const getContentAccessMode = (isSubscribed: boolean): 'full' | 'teaser' => {
  return isSubscribed ? 'full' : 'teaser';
};
