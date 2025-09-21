/**
 * DeliGo Feature Flag Utilities
 * 
 * Helper functions and utilities for feature flag management and testing.
 * Provides tools for environment detection, flag manipulation, and debugging.
 */

import { FeatureFlags } from '../config/featureFlagTypes';

/**
 * Environment variable names for feature flag overrides
 */
export const FEATURE_FLAG_ENV_VARS = {
  // AI Features
  AI_CHAT_ASSISTANT: 'DELIGO_AI_CHAT_ASSISTANT',
  AI_FOOD_SCANNING: 'DELIGO_AI_FOOD_SCANNING',
  AI_VOICE_ORDERING: 'DELIGO_AI_VOICE_ORDERING',
  AI_DIETARY_ASSISTANT: 'DELIGO_AI_DIETARY_ASSISTANT',
  AI_SMART_RECOMMENDATIONS: 'DELIGO_AI_SMART_RECOMMENDATIONS',
  
  // Delivery Features
  DRONE_DELIVERY: 'DELIGO_DRONE_DELIVERY',
  LIVE_TRACKING: 'DELIGO_LIVE_TRACKING',
  ENHANCED_TRACKING: 'DELIGO_ENHANCED_TRACKING',
  REAL_TIME_UPDATES: 'DELIGO_REAL_TIME_UPDATES',
  
  // Payment Features
  MOMO_PAYMENTS: 'DELIGO_MOMO_PAYMENTS',
  CARD_PAYMENTS: 'DELIGO_CARD_PAYMENTS',
  CASH_ON_DELIVERY: 'DELIGO_CASH_ON_DELIVERY',
  LOYALTY_POINTS: 'DELIGO_LOYALTY_POINTS',
  
  // Experimental Features
  BLOCKCHAIN: 'DELIGO_BLOCKCHAIN',
  BETA_FEATURES: 'DELIGO_BETA_FEATURES',
  AB_TESTING: 'DELIGO_AB_TESTING',
} as const;

/**
 * Parse environment variables to feature flag overrides
 * Supports both Node.js and browser environments
 */
export function parseEnvironmentOverrides(): Partial<FeatureFlags> {
  const overrides: Partial<FeatureFlags> = {};
  
  // Helper to get environment variable value
  const getEnvValue = (key: string): boolean | undefined => {
    let value: string | undefined;
    
    // Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      value = process.env[key];
    }
    
    // Browser environment (if variables are exposed)
    if (typeof window !== 'undefined' && (window as any).__DELIGO_ENV__) {
      value = (window as any).__DELIGO_ENV__[key];
    }
    
    if (value === undefined) return undefined;
    
    // Parse boolean values
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue === 'true' || lowercaseValue === '1') return true;
    if (lowercaseValue === 'false' || lowercaseValue === '0') return false;
    
    return undefined;
  };
  
  // AI Features
  const chatAssistant = getEnvValue(FEATURE_FLAG_ENV_VARS.AI_CHAT_ASSISTANT);
  const foodScanning = getEnvValue(FEATURE_FLAG_ENV_VARS.AI_FOOD_SCANNING);
  const voiceOrdering = getEnvValue(FEATURE_FLAG_ENV_VARS.AI_VOICE_ORDERING);
  const dietaryAssistant = getEnvValue(FEATURE_FLAG_ENV_VARS.AI_DIETARY_ASSISTANT);
  const smartRecommendations = getEnvValue(FEATURE_FLAG_ENV_VARS.AI_SMART_RECOMMENDATIONS);
  
  if (chatAssistant !== undefined || foodScanning !== undefined || 
      voiceOrdering !== undefined || dietaryAssistant !== undefined || 
      smartRecommendations !== undefined) {
    overrides.ai = {};
    if (chatAssistant !== undefined) overrides.ai.chatAssistant = chatAssistant;
    if (foodScanning !== undefined) overrides.ai.foodScanning = foodScanning;
    if (voiceOrdering !== undefined) overrides.ai.voiceOrdering = voiceOrdering;
    if (dietaryAssistant !== undefined) overrides.ai.dietaryAssistant = dietaryAssistant;
    if (smartRecommendations !== undefined) overrides.ai.smartRecommendations = smartRecommendations;
  }
  
  // Delivery Features
  const droneDelivery = getEnvValue(FEATURE_FLAG_ENV_VARS.DRONE_DELIVERY);
  const liveTracking = getEnvValue(FEATURE_FLAG_ENV_VARS.LIVE_TRACKING);
  const enhancedTracking = getEnvValue(FEATURE_FLAG_ENV_VARS.ENHANCED_TRACKING);
  const realTimeUpdates = getEnvValue(FEATURE_FLAG_ENV_VARS.REAL_TIME_UPDATES);
  
  if (droneDelivery !== undefined || liveTracking !== undefined || 
      enhancedTracking !== undefined || realTimeUpdates !== undefined) {
    overrides.delivery = {};
    if (droneDelivery !== undefined) overrides.delivery.droneDelivery = droneDelivery;
    if (liveTracking !== undefined) overrides.delivery.liveTracking = liveTracking;
    if (enhancedTracking !== undefined) overrides.delivery.enhancedTracking = enhancedTracking;
    if (realTimeUpdates !== undefined) overrides.delivery.realTimeUpdates = realTimeUpdates;
  }
  
  // Payment Features
  const momoPayments = getEnvValue(FEATURE_FLAG_ENV_VARS.MOMO_PAYMENTS);
  const cardPayments = getEnvValue(FEATURE_FLAG_ENV_VARS.CARD_PAYMENTS);
  const cashOnDelivery = getEnvValue(FEATURE_FLAG_ENV_VARS.CASH_ON_DELIVERY);
  const loyaltyPoints = getEnvValue(FEATURE_FLAG_ENV_VARS.LOYALTY_POINTS);
  
  if (momoPayments !== undefined || cardPayments !== undefined || 
      cashOnDelivery !== undefined || loyaltyPoints !== undefined) {
    overrides.payments = {};
    if (momoPayments !== undefined) overrides.payments.mobileMoneyMoMo = momoPayments;
    if (cardPayments !== undefined) overrides.payments.creditCardPayments = cardPayments;
    if (cashOnDelivery !== undefined) overrides.payments.cashOnDelivery = cashOnDelivery;
    if (loyaltyPoints !== undefined) overrides.payments.loyaltyPoints = loyaltyPoints;
  }
  
  // Experimental Features
  const blockchain = getEnvValue(FEATURE_FLAG_ENV_VARS.BLOCKCHAIN);
  const betaFeatures = getEnvValue(FEATURE_FLAG_ENV_VARS.BETA_FEATURES);
  const abTesting = getEnvValue(FEATURE_FLAG_ENV_VARS.AB_TESTING);
  
  if (blockchain !== undefined || betaFeatures !== undefined || abTesting !== undefined) {
    overrides.experimental = {};
    if (blockchain !== undefined) overrides.experimental.blockchainIntegration = blockchain;
    if (betaFeatures !== undefined) overrides.experimental.betaFeatures = betaFeatures;
    if (abTesting !== undefined) overrides.experimental.abTesting = abTesting;
  }
  
  return overrides;
}

/**
 * Create a feature flag override object for testing
 */
export function createTestOverrides(overrides: {
  [key: string]: boolean;
}): Partial<FeatureFlags> {
  const testFlags: Partial<FeatureFlags> = {};
  
  Object.entries(overrides).forEach(([path, value]) => {
    const [category, feature] = path.split('.');
    
    if (!testFlags[category as keyof FeatureFlags]) {
      (testFlags as any)[category] = {};
    }
    
    (testFlags as any)[category][feature] = value;
  });
  
  return testFlags;
}

/**
 * Validate feature flag configuration
 */
export function validateFeatureFlags(flags: FeatureFlags): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for required structure
  const requiredCategories = ['ai', 'delivery', 'payments', 'social', 'vendor', 'core', 'experimental'];
  
  for (const category of requiredCategories) {
    if (!(category in flags)) {
      errors.push(`Missing required category: ${category}`);
    }
  }
  
  // Check for logical dependencies
  if (flags.delivery?.droneDelivery && !flags.delivery?.liveTracking) {
    warnings.push('Drone delivery is enabled but live tracking is disabled. This may cause poor UX.');
  }
  
  if (flags.ai?.voiceOrdering && !flags.ai?.chatAssistant) {
    warnings.push('Voice ordering is enabled but chat assistant is disabled. Consider enabling both.');
  }
  
  if (!flags.payments?.mobileMoneyMoMo && !flags.payments?.creditCardPayments && !flags.payments?.cashOnDelivery) {
    errors.push('At least one payment method must be enabled.');
  }
  
  // Check for experimental features in production
  const hasExperimentalEnabled = Object.values(flags.experimental || {}).some(Boolean);
  
  if (hasExperimentalEnabled) {
    warnings.push('Experimental features are enabled. Ensure this is intentional for the current environment.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate feature flag documentation
 */
export function generateFeatureFlagDocs(flags: FeatureFlags): string {
  let docs = '# DeliGo Feature Flags\n\n';
  
  Object.entries(flags).forEach(([category, features]) => {
    docs += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Features\n\n`;
    
    Object.entries(features).forEach(([feature, enabled]) => {
      const status = enabled ? '✅ Enabled' : '❌ Disabled';
      docs += `- **${feature}**: ${status}\n`;
    });
    
    docs += '\n';
  });
  
  return docs;
}

/**
 * Feature flag comparison utility
 */
export function compareFeatureFlags(
  flags1: FeatureFlags, 
  flags2: FeatureFlags
): {
  added: string[];
  removed: string[];
  changed: string[];
  unchanged: string[];
} {
  const result = {
    added: [] as string[],
    removed: [] as string[],
    changed: [] as string[],
    unchanged: [] as string[],
  };
  
  const getAllPaths = (flags: FeatureFlags): string[] => {
    return Object.entries(flags).flatMap(([category, features]) =>
      Object.keys(features).map(feature => `${category}.${feature}`)
    );
  };
  
  const paths1 = getAllPaths(flags1);
  const paths2 = getAllPaths(flags2);
  
  const allPaths = new Set([...paths1, ...paths2]);
  
  allPaths.forEach(path => {
    const [category, feature] = path.split('.');
    const value1 = (flags1 as any)[category]?.[feature];
    const value2 = (flags2 as any)[category]?.[feature];
    
    if (value1 === undefined && value2 !== undefined) {
      result.added.push(path);
    } else if (value1 !== undefined && value2 === undefined) {
      result.removed.push(path);
    } else if (value1 !== value2) {
      result.changed.push(path);
    } else {
      result.unchanged.push(path);
    }
  });
  
  return result;
}

/**
 * Convert feature flags to URL query parameters for sharing/debugging
 */
export function featureFlagsToQueryParams(flags: FeatureFlags): string {
  const params = new URLSearchParams();
  
  Object.entries(flags).forEach(([category, features]) => {
    Object.entries(features).forEach(([feature, enabled]) => {
      if (!enabled) { // Only include disabled flags to keep URL short
        params.append('disable', `${category}.${feature}`);
      }
    });
  });
  
  return params.toString();
}

/**
 * Parse feature flags from URL query parameters
 */
export function parseFeatureFlagsFromQueryParams(queryString: string): Partial<FeatureFlags> {
  const params = new URLSearchParams(queryString);
  const overrides: Partial<FeatureFlags> = {};
  
  // Get disabled flags
  const disabledFlags = params.getAll('disable');
  
  disabledFlags.forEach(path => {
    const [category, feature] = path.split('.');
    if (!overrides[category as keyof FeatureFlags]) {
      (overrides as any)[category] = {};
    }
    (overrides as any)[category][feature] = false;
  });
  
  // Get enabled flags
  const enabledFlags = params.getAll('enable');
  
  enabledFlags.forEach(path => {
    const [category, feature] = path.split('.');
    if (!overrides[category as keyof FeatureFlags]) {
      (overrides as any)[category] = {};
    }
    (overrides as any)[category][feature] = true;
  });
  
  return overrides;
}