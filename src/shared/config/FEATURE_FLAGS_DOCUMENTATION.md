# DeliGo Feature Flags Documentation

## Overview

The DeliGo Feature Flag system provides centralized control over application features, allowing you to enable/disable functionality without code changes. This system supports environment-specific configurations and provides type-safe access throughout the application.

## Quick Start

### Basic Usage in Components

```tsx
import { useFeatureFlag } from './src/shared/hooks/useFeatureFlag';

const MyComponent = () => {
  const isDroneEnabled = useFeatureFlag('delivery.droneDelivery');
  
  if (!isDroneEnabled) return null;
  
  return <DroneTrackingButton />;
};
```

### Multiple Feature Checks

```tsx
import { useMultipleFeatureFlags } from './src/shared/hooks/useFeatureFlag';

const PaymentOptions = () => {
  const paymentFlags = useMultipleFeatureFlags([
    'payments.mobileMoneyMoMo',
    'payments.creditCardPayments',
    'payments.cashOnDelivery'
  ]);
  
  return (
    <div>
      {paymentFlags['payments.mobileMoneyMoMo'] && <MoMoOption />}
      {paymentFlags['payments.creditCardPayments'] && <CardOption />}
      {paymentFlags['payments.cashOnDelivery'] && <CashOption />}
    </div>
  );
};
```

## Feature Categories

### 🤖 AI Features (`ai.*`)
- `ai.chatAssistant` - Core AI chat assistant
- `ai.foodScanning` - Camera-based food scanning
- `ai.voiceOrdering` - Voice-enabled ordering
- `ai.dietaryAssistant` - AI dietary recommendations
- `ai.smartRecommendations` - Smart food recommendations
- `ai.trendAnalysis` - AI trend analysis for vendors

### 🚁 Delivery Features (`delivery.*`)
- `delivery.droneDelivery` - Drone delivery with live camera feeds
- `delivery.liveTracking` - Enhanced live tracking with maps
- `delivery.enhancedTracking` - Advanced order tracking modal
- `delivery.realTimeUpdates` - Real-time order status updates
- `delivery.locationServices` - GPS and location services

### 💳 Payment Features (`payments.*`)
- `payments.mobileMoneyMoMo` - Mobile Money (MoMo) integration
- `payments.creditCardPayments` - Credit/debit card processing
- `payments.cashOnDelivery` - Cash on delivery option
- `payments.loyaltyPoints` - Loyalty points and rewards
- `payments.multiCurrency` - Multi-currency support

### 👥 Social Features (`social.*`)
- `social.referralProgram` - Customer referral system
- `social.reviewsAndRatings` - Reviews and ratings
- `social.socialSharing` - Social media sharing
- `social.loyaltyRewards` - Customer loyalty rewards

### 🏪 Vendor Features (`vendor.*`)
- `vendor.realTimeOrderManagement` - Real-time order processing
- `vendor.analyticsAndReporting` - Business analytics
- `vendor.menuManagement` - Dynamic menu management
- `vendor.promotionsManagement` - Promotions and discounts
- `vendor.profileCustomization` - Vendor profile customization

### ⚙️ Core Features (`core.*`)
- `core.multiLanguage` - Bilingual support
- `core.bottomNavigation` - Bottom navigation bar
- `core.sidebarMenu` - Sidebar menu
- `core.searchFeatures` - Search functionality
- `core.categoryBrowsing` - Category browsing

### 🧪 Experimental Features (`experimental.*`)
- `experimental.blockchainIntegration` - Blockchain payments
- `experimental.newUIComponents` - New UI patterns
- `experimental.betaFeatures` - Beta testing features
- `experimental.abTesting` - A/B testing framework
- `experimental.advancedAnalytics` - Advanced analytics

## Environment Configuration

### Development Environment
- All experimental features enabled
- Feature flag debugger visible
- Enhanced logging and warnings

### Staging Environment
- Selected experimental features for testing
- Beta features enabled
- A/B testing capabilities

### Production Environment
- Only stable, tested features enabled
- Experimental features disabled
- No debug information displayed

## Advanced Usage

### Conditional Feature Access

```tsx
import { useAnyFeatureEnabled, useAllFeaturesEnabled } from './src/shared/hooks/useFeatureFlag';

const AdvancedDashboard = () => {
  // Show if ANY AI feature is enabled
  const hasAnyAI = useAnyFeatureEnabled([
    'ai.chatAssistant',
    'ai.foodScanning',
    'ai.voiceOrdering'
  ]);
  
  // Show only if ALL payment methods are available
  const hasCompletePayments = useAllFeaturesEnabled([
    'payments.mobileMoneyMoMo',
    'payments.creditCardPayments',
    'payments.cashOnDelivery'
  ]);
  
  return (
    <div>
      {hasAnyAI && <AISection />}
      {hasCompletePayments && <PremiumCheckout />}
    </div>
  );
};
```

### Environment Detection

```tsx
import { useEnvironment } from './src/shared/hooks/useFeatureFlag';

const DebugPanel = () => {
  const { environment, isDevelopment, isProduction } = useEnvironment();
  
  if (isProduction) return null;
  
  return <DeveloperTools environment={environment} />;
};
```

## Environment Variables

You can override feature flags using environment variables:

```bash
# Disable drone delivery
export DELIGO_DRONE_DELIVERY=false

# Enable experimental features
export DELIGO_BETA_FEATURES=true
export DELIGO_BLOCKCHAIN=true

# Disable specific AI features
export DELIGO_AI_VOICE_ORDERING=false
```

### Available Environment Variables

| Variable | Feature | Default |
|----------|---------|---------|
| `DELIGO_AI_CHAT_ASSISTANT` | ai.chatAssistant | true |
| `DELIGO_AI_FOOD_SCANNING` | ai.foodScanning | true |
| `DELIGO_AI_VOICE_ORDERING` | ai.voiceOrdering | true |
| `DELIGO_DRONE_DELIVERY` | delivery.droneDelivery | true |
| `DELIGO_LIVE_TRACKING` | delivery.liveTracking | true |
| `DELIGO_ENHANCED_TRACKING` | delivery.enhancedTracking | true |
| `DELIGO_MOMO_PAYMENTS` | payments.mobileMoneyMoMo | true |
| `DELIGO_CARD_PAYMENTS` | payments.creditCardPayments | true |
| `DELIGO_CASH_ON_DELIVERY` | payments.cashOnDelivery | true |
| `DELIGO_BETA_FEATURES` | experimental.betaFeatures | false |
| `DELIGO_BLOCKCHAIN` | experimental.blockchainIntegration | false |

## Implementation Examples

### OrderTracking Component (Updated)

```tsx
import { useMultipleFeatureFlags } from '../../../shared/hooks/useFeatureFlag';

export function OrderTracking({ order, onOpenDroneTracking }) {
  const featureFlags = useMultipleFeatureFlags([
    'delivery.droneDelivery',
    'delivery.enhancedTracking',
    'social.reviewsAndRatings'
  ]);

  return (
    <div>
      {/* Drone indicator only shows if feature is enabled */}
      {featureFlags['delivery.droneDelivery'] && order.deliveryMethod === 'drone' && (
        <DroneDeliveryIndicator />
      )}
      
      {/* Enhanced tracking button */}
      {featureFlags['delivery.enhancedTracking'] && (
        <EnhancedTrackingButton />
      )}
      
      {/* Reviews only if social features enabled */}
      {featureFlags['social.reviewsAndRatings'] && (
        <ReviewPrompt />
      )}
    </div>
  );
}
```

### MainApp Component (Updated)

```tsx
import { useFeatureFlag } from '../../../shared/hooks/useFeatureFlag';

export function MainApp() {
  const hasBottomNav = useFeatureFlag('core.bottomNavigation');
  const hasAI = useFeatureFlag('ai.chatAssistant');
  const hasDroneDelivery = useFeatureFlag('delivery.droneDelivery');

  return (
    <div>
      <MainContent />
      
      {/* Conditional bottom navigation */}
      {hasBottomNav && (
        <BottomNavigation onAIOpen={hasAI ? openAI : undefined} />
      )}
      
      {/* Conditional AI assistant */}
      {hasAI && <AIAssistant />}
      
      {/* Conditional drone visualization */}
      {hasDroneDelivery && <DroneDeliveryVisualization />}
    </div>
  );
}
```

## Migration Guide

### Converting Existing Components

1. **Import feature flag hooks**:
   ```tsx
   import { useFeatureFlag } from './path/to/shared/hooks/useFeatureFlag';
   ```

2. **Add feature checks**:
   ```tsx
   // Before
   {showDroneButton && <DroneButton />}
   
   // After
   {useFeatureFlag('delivery.droneDelivery') && showDroneButton && <DroneButton />}
   ```

3. **Wrap conditional sections**:
   ```tsx
   // Before
   <AIFeatures />
   
   // After
   {useFeatureFlag('ai.chatAssistant') && <AIFeatures />}
   ```

### Testing with Feature Flags

```tsx
// Test with features disabled
const TestWrapper = ({ children }) => (
  <FeatureFlagProvider overrideFlags={{
    ai: { chatAssistant: false },
    delivery: { droneDelivery: false }
  }}>
    {children}
  </FeatureFlagProvider>
);
```

## Best Practices

### 1. Default to Enabled
- All existing features default to `true`
- Only new/experimental features default to `false`
- This ensures zero breaking changes

### 2. Granular Control
- Use specific feature flags rather than broad categories
- Example: `ai.chatAssistant` vs `ai.enabled`

### 3. Logical Grouping
- Group related features under common categories
- Use dot notation for hierarchy: `payments.mobileMoneyMoMo`

### 4. Environment Awareness
- Enable experimental features in development
- Disable risky features in production
- Use staging for gradual rollouts

### 5. Performance Considerations
- Feature flags are memoized and performant
- Use `useOptimizedFeatureFlag` for expensive components
- Avoid feature flag checks in render loops

## Debugging

### Development Debugger

The feature flag debugger appears automatically in development environments:

```tsx
// Automatically included in App.tsx
<FeatureFlagDebugger />
```

Shows:
- Current environment
- Enabled/disabled feature counts
- Quick feature overview

### Manual Debugging

```tsx
import { useFeatureFlagDebug } from './src/shared/hooks/useFeatureFlag';

const MyComponent = () => {
  const debugInfo = useFeatureFlagDebug();
  
  console.log('Current flags:', debugInfo?.flags);
  console.log('Environment:', debugInfo?.environment);
};
```

## Troubleshooting

### Common Issues

1. **Feature flag not working**
   - Check spelling of flag path
   - Verify component is wrapped in `FeatureFlagProvider`
   - Check environment overrides

2. **Component still showing when disabled**
   - Ensure all conditional rendering uses feature flags
   - Check for multiple render paths

3. **Environment variables not working**
   - Verify variable naming (must start with `DELIGO_`)
   - Check that variables are properly exposed to browser

### Validation

Use the validation utility to check your configuration:

```tsx
import { validateFeatureFlags } from './src/shared/utils/featureFlagUtils';

const validation = validateFeatureFlags(flags);
console.log('Validation errors:', validation.errors);
console.log('Warnings:', validation.warnings);
```

## Future Enhancements

This feature flag system is designed to support:

1. **Remote Configuration** - Load flags from external services
2. **User-specific Flags** - Per-user feature rollouts
3. **A/B Testing** - Percentage-based feature rollouts
4. **Analytics Integration** - Track feature usage
5. **Real-time Updates** - Change flags without deployments

## Support

For questions or issues with the feature flag system:

1. Check this documentation first
2. Use the development debugger for insights
3. Validate your configuration with provided utilities
4. Test in different environments before deployment

---

**Remember**: Feature flags should enhance your development workflow, not complicate it. Start simple and gradually adopt more advanced patterns as needed.