/**
 * DeliGo Feature Flag Hooks
 * 
 * Custom React hooks for easy feature flag access throughout the application.
 * Provides type-safe and performant feature flag checking with helpful utilities.
 * 
 * Usage Examples:
 * 
 * // Basic feature check
 * const isDroneEnabled = useFeatureFlag('delivery.droneDelivery');
 * 
 * // Multiple feature checks
 * const { ai, payments } = useFeatureFlags();
 * 
 * // Conditional rendering
 * const AIDashboard = () => {
 *   const hasAnyAI = useAnyFeatureEnabled(['ai.chatAssistant', 'ai.foodScanning']);
 *   return hasAnyAI ? <AIFeatures /> : <BasicFeatures />;
 * };
 */

import { useMemo } from 'react';
import { useFeatureFlagContext } from '../contexts/FeatureFlagContext';
import { FeatureFlags } from '../config/featureFlagTypes';

/**
 * Primary hook for checking individual feature flags
 * 
 * @param flagPath - Dot notation path to feature flag (e.g., 'ai.chatAssistant')
 * @returns boolean indicating if the feature is enabled
 * 
 * @example
 * const DroneButton = () => {
 *   const isDroneEnabled = useFeatureFlag('delivery.droneDelivery');
 *   
 *   if (!isDroneEnabled) return null;
 *   
 *   return <Button>Launch Drone Delivery</Button>;
 * };
 */
export function useFeatureFlag(flagPath: string): boolean {
  const { isFeatureEnabled } = useFeatureFlagContext();
  
  return useMemo(() => {
    return isFeatureEnabled(flagPath);
  }, [isFeatureEnabled, flagPath]);
}

/**
 * Hook to get multiple feature flags at once
 * 
 * @param flagPaths - Array of feature flag paths
 * @returns Object with flag paths as keys and boolean values
 * 
 * @example
 * const PaymentOptions = () => {
 *   const paymentFlags = useMultipleFeatureFlags([
 *     'payments.mobileMoneyMoMo',
 *     'payments.creditCardPayments',
 *     'payments.cashOnDelivery'
 *   ]);
 *   
 *   return (
 *     <div>
 *       {paymentFlags['payments.mobileMoneyMoMo'] && <MoMoOption />}
 *       {paymentFlags['payments.creditCardPayments'] && <CardOption />}
 *       {paymentFlags['payments.cashOnDelivery'] && <CashOption />}
 *     </div>
 *   );
 * };
 */
export function useMultipleFeatureFlags(flagPaths: string[]): Record<string, boolean> {
  const { isFeatureEnabled } = useFeatureFlagContext();
  
  return useMemo(() => {
    return flagPaths.reduce((acc, path) => {
      acc[path] = isFeatureEnabled(path);
      return acc;
    }, {} as Record<string, boolean>);
  }, [isFeatureEnabled, flagPaths]);
}

/**
 * Hook to check if ANY of the provided features are enabled
 * Useful for showing entire feature sections
 * 
 * @param flagPaths - Array of feature flag paths
 * @returns boolean indicating if at least one feature is enabled
 * 
 * @example
 * const AISection = () => {
 *   const hasAnyAI = useAnyFeatureEnabled([
 *     'ai.chatAssistant',
 *     'ai.foodScanning',
 *     'ai.voiceOrdering'
 *   ]);
 *   
 *   if (!hasAnyAI) return null;
 *   
 *   return <AIFeaturesDashboard />;
 * };
 */
export function useAnyFeatureEnabled(flagPaths: string[]): boolean {
  const { isFeatureEnabled } = useFeatureFlagContext();
  
  return useMemo(() => {
    return flagPaths.some(path => isFeatureEnabled(path));
  }, [isFeatureEnabled, flagPaths]);
}

/**
 * Hook to check if ALL provided features are enabled
 * Useful for complex feature dependencies
 * 
 * @param flagPaths - Array of feature flag paths
 * @returns boolean indicating if all features are enabled
 * 
 * @example
 * const AdvancedCheckout = () => {
 *   const hasAllPaymentFeatures = useAllFeaturesEnabled([
 *     'payments.mobileMoneyMoMo',
 *     'payments.loyaltyPoints',
 *     'delivery.realTimeUpdates'
 *   ]);
 *   
 *   return hasAllPaymentFeatures ? <PremiumCheckout /> : <BasicCheckout />;
 * };
 */
export function useAllFeaturesEnabled(flagPaths: string[]): boolean {
  const { isFeatureEnabled } = useFeatureFlagContext();
  
  return useMemo(() => {
    return flagPaths.every(path => isFeatureEnabled(path));
  }, [isFeatureEnabled, flagPaths]);
}

/**
 * Hook to get entire feature flag categories
 * Provides typed access to all flags in a category
 * 
 * @returns Typed object with all feature flag categories
 * 
 * @example
 * const FeatureManager = () => {
 *   const flags = useFeatureFlags();
 *   
 *   return (
 *     <div>
 *       <h2>AI Features</h2>
 *       {flags.ai.chatAssistant && <AIChat />}
 *       {flags.ai.foodScanning && <FoodScanner />}
 *       
 *       <h2>Payment Options</h2>
 *       {flags.payments.mobileMoneyMoMo && <MoMoPayment />}
 *       {flags.payments.creditCardPayments && <CardPayment />}
 *     </div>
 *   );
 * };
 */
export function useFeatureFlags(): FeatureFlags {
  const { flags } = useFeatureFlagContext();
  return flags;
}

/**
 * Hook for conditional feature flag access with default values
 * 
 * @param flagPath - Feature flag path
 * @param defaultValue - Default value if flag doesn't exist
 * @returns Feature flag value or default
 * 
 * @example
 * const maxRetries = useFeatureFlagWithDefault('experimental.retryLimit', 3);
 * const apiTimeout = useFeatureFlagWithDefault('core.apiTimeout', 5000);
 */
export function useFeatureFlagWithDefault<T = boolean>(
  flagPath: string, 
  defaultValue: T
): T {
  const { getFeatureFlag } = useFeatureFlagContext();
  
  return useMemo(() => {
    try {
      return getFeatureFlag<T>(flagPath);
    } catch {
      return defaultValue;
    }
  }, [getFeatureFlag, flagPath, defaultValue]);
}

/**
 * Hook to get environment information
 * Useful for environment-specific behavior
 * 
 * @returns Current environment and related utilities
 * 
 * @example
 * const DebugPanel = () => {
 *   const { environment, isDevelopment } = useEnvironment();
 *   
 *   if (!isDevelopment) return null;
 *   
 *   return <DeveloperDebugPanel environment={environment} />;
 * };
 */
export function useEnvironment() {
  const { environment } = useFeatureFlagContext();
  
  return useMemo(() => ({
    environment,
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
  }), [environment]);
}

/**
 * Hook for performance-optimized feature checks
 * Caches results and only re-evaluates when dependencies change
 * 
 * @param flagPath - Feature flag path
 * @param deps - Dependencies for memoization
 * @returns Memoized feature flag value
 * 
 * @example
 * const ExpensiveComponent = ({ userId }) => {
 *   const hasAdvancedFeatures = useOptimizedFeatureFlag(
 *     'experimental.advancedAnalytics',
 *     [userId]
 *   );
 *   
 *   return hasAdvancedFeatures ? <AdvancedAnalytics /> : <BasicAnalytics />;
 * };
 */
export function useOptimizedFeatureFlag(
  flagPath: string, 
  deps: React.DependencyList = []
): boolean {
  const { isFeatureEnabled } = useFeatureFlagContext();
  
  return useMemo(() => {
    return isFeatureEnabled(flagPath);
  }, [isFeatureEnabled, flagPath, ...deps]);
}

/**
 * Development-only hook for feature flag debugging
 * Returns detailed information about feature flag state
 * 
 * @returns Debug information object (only in development)
 * 
 * @example
 * const DeveloperToolbar = () => {
 *   const debugInfo = useFeatureFlagDebug();
 *   
 *   if (!debugInfo) return null; // Not in development
 *   
 *   return (
 *     <div>
 *       <p>Environment: {debugInfo.environment}</p>
 *       <p>Enabled: {debugInfo.enabledCount}</p>
 *       <p>Disabled: {debugInfo.disabledCount}</p>
 *     </div>
 *   );
 * };
 */
export function useFeatureFlagDebug() {
  const { flags, environment } = useFeatureFlagContext();
  
  return useMemo(() => {
    // Only provide debug info in development
    if (environment === 'production') {
      return null;
    }
    
    const allFlags = Object.entries(flags).flatMap(([category, features]) =>
      Object.entries(features).map(([feature, enabled]) => ({
        path: `${category}.${feature}`,
        enabled,
        category,
        feature,
      }))
    );
    
    const enabledFlags = allFlags.filter(f => f.enabled);
    const disabledFlags = allFlags.filter(f => !f.enabled);
    
    return {
      environment,
      flags,
      allFlags,
      enabledFlags,
      disabledFlags,
      enabledCount: enabledFlags.length,
      disabledCount: disabledFlags.length,
      totalCount: allFlags.length,
    };
  }, [flags, environment]);
}