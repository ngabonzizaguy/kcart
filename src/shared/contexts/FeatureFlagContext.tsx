/**
 * DeliGo Feature Flag Context
 * 
 * Provides feature flag state management throughout the application using React Context.
 * This enables any component to easily check if a feature is enabled without prop drilling.
 * 
 * Usage:
 * 1. Wrap your app with <FeatureFlagProvider>
 * 2. Use useFeatureFlag('category.feature') hook in any component
 * 3. Features will be checked against the current environment configuration
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { FeatureFlags, FeatureFlagContextValue } from '../config/featureFlagTypes';
import { getFeatureFlags, getNestedFlag, getCurrentEnvironment } from '../config/featureFlags';

/**
 * Feature Flag Context
 */
const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

/**
 * Feature Flag Provider Props
 */
interface FeatureFlagProviderProps {
  children: ReactNode;
  /** Optional override for feature flags (useful for testing) */
  overrideFlags?: Partial<FeatureFlags>;
}

/**
 * Feature Flag Provider Component
 * 
 * Wraps the application and provides feature flag state to all child components.
 * Automatically detects the current environment and applies appropriate overrides.
 */
export function FeatureFlagProvider({ 
  children, 
  overrideFlags = {} 
}: FeatureFlagProviderProps) {
  // Get computed feature flags with environment overrides
  const baseFlags = getFeatureFlags();
  
  // Apply any additional overrides (useful for testing)
  const flags: FeatureFlags = {
    ...baseFlags,
    ...Object.keys(overrideFlags).reduce((acc, key) => {
      const category = key as keyof FeatureFlags;
      acc[category] = {
        ...baseFlags[category],
        ...overrideFlags[category],
      };
      return acc;
    }, {} as Partial<FeatureFlags>),
  } as FeatureFlags;

  const environment = getCurrentEnvironment();

  /**
   * Check if a feature is enabled by its path
   * @param flagPath - Dot notation path like 'ai.chatAssistant' or 'delivery.droneDelivery'
   * @returns boolean indicating if the feature is enabled
   */
  const isFeatureEnabled = (flagPath: string): boolean => {
    return getNestedFlag(flagPath, flags);
  };

  /**
   * Get a feature flag value with type safety
   * @param flagPath - Dot notation path to the feature flag
   * @returns The feature flag value (typically boolean)
   */
  const getFeatureFlag = <T = boolean>(flagPath: string): T => {
    const value = getNestedFlag(flagPath, flags);
    return value as T;
  };

  const contextValue: FeatureFlagContextValue = {
    flags,
    isFeatureEnabled,
    getFeatureFlag,
    environment,
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

/**
 * Custom hook to access feature flag context
 * 
 * @throws Error if used outside of FeatureFlagProvider
 * @returns FeatureFlagContextValue with flags and helper functions
 */
export function useFeatureFlagContext(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);
  
  if (!context) {
    throw new Error(
      'useFeatureFlagContext must be used within a FeatureFlagProvider. ' +
      'Make sure to wrap your app with <FeatureFlagProvider>.'
    );
  }
  
  return context;
}

/**
 * Debug component to display current feature flag state
 * Useful for development and troubleshooting
 */
export function FeatureFlagDebugger({ className = '' }: { className?: string }) {
  const { flags, environment } = useFeatureFlagContext();
  
  // Only show in development
  if (environment === 'production') {
    return null;
  }
  
  const enabledFeatures = Object.entries(flags).flatMap(([category, features]) =>
    Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => `${category}.${feature}`)
  );
  
  const disabledFeatures = Object.entries(flags).flatMap(([category, features]) =>
    Object.entries(features)
      .filter(([, enabled]) => !enabled)
      .map(([feature]) => `${category}.${feature}`)
  );
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <details className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg max-w-xs">
        <summary className="cursor-pointer font-medium text-sm text-gray-800">
          🎛️ Feature Flags ({environment})
        </summary>
        <div className="mt-2 space-y-2 text-xs">
          <div>
            <strong className="text-green-600">Enabled ({enabledFeatures.length}):</strong>
            <div className="text-green-700 text-xs">
              {enabledFeatures.slice(0, 5).join(', ')}
              {enabledFeatures.length > 5 && `... +${enabledFeatures.length - 5} more`}
            </div>
          </div>
          
          {disabledFeatures.length > 0 && (
            <div>
              <strong className="text-red-600">Disabled ({disabledFeatures.length}):</strong>
              <div className="text-red-700 text-xs">
                {disabledFeatures.slice(0, 3).join(', ')}
                {disabledFeatures.length > 3 && `... +${disabledFeatures.length - 3} more`}
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}