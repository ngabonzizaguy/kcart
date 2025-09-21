/**
 * DeliGo Feature Flag Type Definitions
 * 
 * Provides type safety and autocomplete for all feature flags across the application.
 * Each feature flag category maps to specific functionality areas in DeliGo.
 */

export interface FeatureFlags {
  /** AI-powered features for enhanced user experience */
  ai: {
    /** Core AI chat assistant for customer support and recommendations */
    chatAssistant: boolean;
    /** Camera-based food scanning and nutrition analysis */
    foodScanning: boolean;
    /** Voice-enabled ordering system */
    voiceOrdering: boolean;
    /** AI-powered dietary assistance and recommendations */
    dietaryAssistant: boolean;
    /** Smart food recommendations based on user behavior */
    smartRecommendations: boolean;
    /** AI trend analysis for vendors */
    trendAnalysis: boolean;
  };

  /** Delivery and logistics features */
  delivery: {
    /** Drone delivery functionality with live camera feeds */
    droneDelivery: boolean;
    /** Enhanced live tracking with interactive maps */
    liveTracking: boolean;
    /** Advanced order tracking modal with detailed timeline */
    enhancedTracking: boolean;
    /** Real-time order status updates via WebSocket */
    realTimeUpdates: boolean;
    /** Location-based services and GPS tracking */
    locationServices: boolean;
  };

  /** Payment processing and financial features */
  payments: {
    /** Mobile Money (MoMo) payment integration */
    mobileMoneyMoMo: boolean;
    /** Credit/debit card payment processing */
    creditCardPayments: boolean;
    /** Cash on delivery option */
    cashOnDelivery: boolean;
    /** Loyalty points and rewards system */
    loyaltyPoints: boolean;
    /** Multi-currency support */
    multiCurrency: boolean;
  };

  /** Social and community features */
  social: {
    /** Customer referral program */
    referralProgram: boolean;
    /** Reviews and ratings system */
    reviewsAndRatings: boolean;
    /** Social media sharing integration */
    socialSharing: boolean;
    /** Customer loyalty rewards */
    loyaltyRewards: boolean;
  };

  /** Vendor dashboard and management features */
  vendor: {
    /** Real-time order management and processing */
    realTimeOrderManagement: boolean;
    /** Business analytics and reporting dashboard */
    analyticsAndReporting: boolean;
    /** Dynamic menu management system */
    menuManagement: boolean;
    /** Promotions and discount management */
    promotionsManagement: boolean;
    /** Vendor profile customization */
    profileCustomization: boolean;
  };

  /** Core application features */
  core: {
    /** Bilingual language switching (English/Kinyarwanda) */
    multiLanguage: boolean;
    /** Bottom navigation bar */
    bottomNavigation: boolean;
    /** Sidebar menu */
    sidebarMenu: boolean;
    /** Search functionality */
    searchFeatures: boolean;
    /** Category browsing */
    categoryBrowsing: boolean;
  };

  /** Experimental and beta features */
  experimental: {
    /** Blockchain integration for payments and loyalty */
    blockchainIntegration: boolean;
    /** New UI components and design patterns */
    newUIComponents: boolean;
    /** Beta features for testing */
    betaFeatures: boolean;
    /** A/B testing framework */
    abTesting: boolean;
    /** Advanced analytics tracking */
    advancedAnalytics: boolean;
  };
}

/**
 * Environment-specific feature flag overrides
 * Allows different feature sets for different deployment environments
 */
export interface EnvironmentOverrides {
  development?: Partial<FeatureFlags>;
  staging?: Partial<FeatureFlags>;
  production?: Partial<FeatureFlags>;
}

/**
 * Feature flag context value type
 */
export interface FeatureFlagContextValue {
  flags: FeatureFlags;
  isFeatureEnabled: (flagPath: string) => boolean;
  getFeatureFlag: <T = boolean>(flagPath: string) => T;
  environment: 'development' | 'staging' | 'production';
}

/**
 * Helper type for deeply nested feature flag paths
 * Examples: 'ai.chatAssistant', 'delivery.droneDelivery', 'payments.mobileMoneyMoMo'
 */
export type FeatureFlagPath = string;