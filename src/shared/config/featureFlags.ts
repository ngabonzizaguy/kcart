/**
 * DeliGo Feature Flags Configuration
 * 
 * Centralized feature management for the DeliGo food delivery application.
 * All features default to TRUE to maintain existing functionality.
 * 
 * Usage:
 * - Set any flag to false to disable that feature across the entire app
 * - Override with environment variables for different deployment environments
 * - Use in components with useFeatureFlag('category.feature') hook
 * 
 * Examples:
 * - useFeatureFlag('ai.chatAssistant') - Controls AI assistant availability
 * - useFeatureFlag('delivery.droneDelivery') - Controls drone delivery features
 * - useFeatureFlag('payments.mobileMoneyMoMo') - Controls MoMo payment option
 */

import { FeatureFlags, EnvironmentOverrides } from './featureFlagTypes';

/**
 * Default feature flags - ALL ENABLED by default
 * This ensures zero impact on existing functionality
 */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  ai: {
    chatAssistant: true,
    foodScanning: true,
    voiceOrdering: true,
    dietaryAssistant: true,
    smartRecommendations: true,
    trendAnalysis: true,
  },

  delivery: {
    droneDelivery: true,
    liveTracking: true,
    enhancedTracking: true,
    realTimeUpdates: true,
    locationServices: true,
  },

  payments: {
    mobileMoneyMoMo: true,
    creditCardPayments: true,
    cashOnDelivery: true,
    loyaltyPoints: true,
    multiCurrency: false, // New feature - disabled by default
  },

  social: {
    referralProgram: true,
    reviewsAndRatings: true,
    socialSharing: true,
    loyaltyRewards: true,
  },

  vendor: {
    realTimeOrderManagement: true,
    analyticsAndReporting: true,
    menuManagement: true,
    promotionsManagement: true,
    profileCustomization: true,
  },

  core: {
    multiLanguage: true,
    bottomNavigation: true,
    sidebarMenu: true,
    searchFeatures: true,
    categoryBrowsing: true,
  },

  experimental: {
    blockchainIntegration: false, // Experimental - disabled by default
    newUIComponents: false,       // Experimental - disabled by default
    betaFeatures: false,          // Experimental - disabled by default
    abTesting: false,             // Experimental - disabled by default
    advancedAnalytics: false,     // Experimental - disabled by default
  },
};

/**
 * Environment-specific overrides
 * These can be used to enable/disable features in different environments
 */
export const ENVIRONMENT_OVERRIDES: EnvironmentOverrides = {
  development: {
    // Enable all experimental features in development
    experimental: {
      blockchainIntegration: true,
      newUIComponents: true,
      betaFeatures: true,
      abTesting: true,
      advancedAnalytics: true,
    },
  },

  staging: {
    // Enable some experimental features in staging for testing
    experimental: {
      betaFeatures: true,
      abTesting: true,
      advancedAnalytics: true,
    },
  },

  production: {
    // Production overrides (if needed)
    // Generally, production should use defaults unless specifically overridden
  },
};

/**
 * Environment detection
 */
export const getCurrentEnvironment = (): 'development' | 'staging' | 'production' => {
  // Browser environment detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')) {
      return 'development';
    }
    
    if (hostname.includes('staging') || hostname.includes('stg')) {
      return 'staging';
    }
    
    return 'production';
  }
  
  // Node.js environment detection
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'development') return 'development';
  if (nodeEnv === 'staging') return 'staging';
  return 'production';
};

/**
 * Get computed feature flags with environment overrides applied
 */
export const getFeatureFlags = (): FeatureFlags => {
  const environment = getCurrentEnvironment();
  const baseFlags = { ...DEFAULT_FEATURE_FLAGS };
  const overrides = ENVIRONMENT_OVERRIDES[environment];

  if (!overrides) {
    return baseFlags;
  }

  // Deep merge overrides with base flags
  return deepMerge(baseFlags, overrides);
};

/**
 * Deep merge utility for feature flag overrides
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[typeof key];
    }
  }

  return result;
}

/**
 * Helper function to get a nested feature flag value
 * Example: getNestedFlag('ai.chatAssistant', flags) returns boolean
 */
export const getNestedFlag = (path: string, flags: FeatureFlags): boolean => {
  const keys = path.split('.');
  let current: any = flags;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Feature flag path '${path}' not found. Defaulting to false.`);
      return false;
    }
  }

  return Boolean(current);
};

/**
 * Quick feature checks for common patterns
 */
export const FEATURE_CHECKS = {
  /** Check if any AI features are enabled */
  hasAnyAI: (flags: FeatureFlags) => 
    Object.values(flags.ai).some(Boolean),
  
  /** Check if any payment methods are enabled */
  hasAnyPayments: (flags: FeatureFlags) => 
    Object.values(flags.payments).some(Boolean),
  
  /** Check if tracking features are available */
  hasTracking: (flags: FeatureFlags) => 
    flags.delivery.liveTracking || flags.delivery.enhancedTracking,
  
  /** Check if experimental features are enabled */
  hasExperimental: (flags: FeatureFlags) => 
    Object.values(flags.experimental).some(Boolean),
};

/**
 * Feature flag debugging information
 */
export const getFeatureFlagDebugInfo = () => {
  const flags = getFeatureFlags();
  const environment = getCurrentEnvironment();
  
  return {
    environment,
    flags,
    enabledFeatures: getAllEnabledFeatures(flags),
    disabledFeatures: getAllDisabledFeatures(flags),
  };
};

/**
 * Get all enabled features as a flat array
 */
export const getAllEnabledFeatures = (flags: FeatureFlags): string[] => {
  const enabled: string[] = [];
  
  Object.entries(flags).forEach(([category, features]) => {
    Object.entries(features).forEach(([feature, isEnabled]) => {
      if (isEnabled) {
        enabled.push(`${category}.${feature}`);
      }
    });
  });
  
  return enabled;
};

/**
 * Get all disabled features as a flat array
 */
export const getAllDisabledFeatures = (flags: FeatureFlags): string[] => {
  const disabled: string[] = [];
  
  Object.entries(flags).forEach(([category, features]) => {
    Object.entries(features).forEach(([feature, isEnabled]) => {
      if (!isEnabled) {
        disabled.push(`${category}.${feature}`);
      }
    });
  });
  
  return disabled;
};