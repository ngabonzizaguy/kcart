# DeliGo Coding Agent Handover Guide

## ⚠️ Critical Tool Limitation: view_tool Truncation Issue

### The Problem
The `view_tool` has a significant limitation - it truncates large files, showing only partial content with `<response clipped>`. This creates several challenges:

1. **Incomplete Context**: You can't see the full file structure, leading to incomplete edits
2. **Integration Issues**: Missing imports, function calls, or state dependencies
3. **Duplicate Code**: Creating separate files instead of editing existing ones
4. **Broken Functionality**: Edits that don't account for existing code patterns

### Workaround Strategies

#### 1. Use Multiple Small view_tool Calls
Instead of viewing entire large files, target specific sections:
```bash
# Instead of viewing the entire file
view_tool("/src/features/customer/components/MainApp.tsx")

# Use targeted approaches:
view_tool("/src/features/customer/components/MainApp.tsx:1-50")   # First 50 lines
view_tool("/src/features/customer/components/MainApp.tsx:100-200") # Middle section
```

#### 2. Look for Integration Points First
Before editing any file, check:
- Import statements at the top
- Export statements at the bottom
- Function signatures and props
- State management patterns

#### 3. Use edit_tool for Targeted Changes
When you know exactly what to change, use `edit_tool` with specific context rather than rewriting entire files.

#### 4. Check for Temporary Files
Look for files with patterns like:
- `temp_*.tsx`
- `*_implementation.txt`
- `*_backup.tsx`
- Files with version suffixes like `*Fixed.tsx`, `*Updated.tsx`

---

## 🏗️ DeliGo Codebase Architecture

### Current Project State
- **Phase**: Production-ready mobile food delivery app
- **Design**: "DeliGo Glass Design Language" (cream/orange with glassmorphism)
- **Architecture**: Professional folder structure with feature-based organization
- **Data Flow**: Global data store at App.tsx level with real-time sync between customer and vendor

### Core File Structure

```
/App.tsx                          # Main entry point with global data store
├── Shared Data Architecture      # Restaurant[], Order[], User[] state
├── Customer-Vendor Integration   # Real-time data sync handlers
└── Onboarding Flow              # Role selection → App routing

/src/features/                    # NEW Professional Structure
├── auth/components/              # Role selection & onboarding
├── customer/components/          # Complete customer experience
│   ├── MainApp.tsx              # Main customer app entry point
│   ├── cart/                    # Cart functionality
│   ├── checkout/                # Payment processing
│   ├── home/                    # Home screen with restaurants
│   ├── navigation/              # Bottom nav & sidebar
│   ├── orders/                  # Order tracking & history
│   ├── profile/                 # User profile management
│   ├── saved/                   # Saved items
│   └── search/                  # Search functionality
├── vendor/components/           # Vendor dashboard
└── shared/                      # Shared utilities & components

/components/                     # LEGACY Structure (being migrated)
├── VendorDashboardFixed.tsx     # Current vendor dashboard
├── Many other components...     # Some still in use, others migrated
└── ui/                         # Shadcn/ui components
```

### Critical Integration Points

#### 1. Global Data Store (App.tsx)
```typescript
// Shared business data that syncs between customer and vendor
const [sharedRestaurants, setSharedRestaurants] = useState<Restaurant[]>([]);
const [sharedOrders, setSharedOrders] = useState<Order[]>([]);
const [sharedUsers, setSharedUsers] = useState<User[]>([]);

// Handlers for real-time updates
const handleOrderCreation = async (orderData) => { /* Customer → Vendor */ };
const handleOrderStatusUpdate = async (orderId, status) => { /* Vendor → Customer */ };
const handleMenuItemUpdate = async (restaurantId, menuItem) => { /* Vendor → Customer */ };
```

#### 2. Customer App Integration (MainApp.tsx)
Located at: `/src/features/customer/components/MainApp.tsx`
```typescript
// Receives shared data from App.tsx
interface MainAppProps {
  sharedRestaurants: Restaurant[];
  sharedOrders: Order[];
  sharedUsers: User[];
  onCreateOrder: (orderData) => Promise<Order>;
  onUpdateOrderStatus: (orderId, status) => Promise<void>;
}
```

#### 3. Vendor Dashboard Integration (VendorDashboardFixed.tsx)
Located at: `/components/VendorDashboardFixed.tsx`
```typescript
// Receives shared data and update handlers
interface VendorDashboardProps {
  sharedRestaurants: Restaurant[];
  sharedOrders: Order[];
  sharedUsers: User[];
  onUpdateRestaurant: (id, updates) => Promise<void>;
  onUpdateMenuItem: (restaurantId, menuItem) => Promise<void>;
  onUpdateOrderStatus: (orderId, status, vendorId) => Promise<void>;
}
```

---

## 🔧 Known Issues & Temporary Files

### Files That May Need Attention

#### 1. `/temp_menu_implementation.txt`
- **Purpose**: Contains menu management implementation details
- **Status**: Temporary file created due to view_tool limitations
- **Action Needed**: Review and integrate into proper component files

#### 2. `/components/MenuTabContent.tsx`
- **Status**: Manually edited recently
- **Integration**: Check if changes are properly reflected in vendor dashboard
- **Dependencies**: May be used by VendorDashboardFixed.tsx

#### 3. Multiple Vendor Dashboard Versions
```
/components/VendorDashboardFixed.tsx        # Current active version
/components/VendorDashboardCompleteFixed.tsx
/components/VendorDashboardSafe.tsx
```
- **Issue**: Multiple versions exist due to incremental fixes
- **Action**: Consolidate into single, working version

### Recent Fixes Applied
1. **CartScreen**: Fixed React component errors
2. **Vendor Dashboard**: Fixed pagination and customer names display
3. **Data Conversion**: Corrected data conversion functions

---

## 🎯 Best Practices for Working with This Codebase

### 1. Always Check Integration Points
Before modifying any component:
```bash
# Check what imports this component
grep -r "import.*ComponentName" src/
grep -r "from.*ComponentName" src/

# Check what this component imports
view_tool("/path/to/component.tsx:1-20")  # Import section only
```

### 2. Understand Data Flow
```
Customer Action → MainApp → App.tsx (Global Store) → VendorDashboard
     ↑                                                      ↓
Customer UI ← Real-time Updates ← Shared Data ← Vendor Action
```

### 3. Design System Compliance
All components must follow "DeliGo Glass Design Language":
- Cream background: `bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100`
- Glass cards: `bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20`
- Orange CTAs: `bg-orange-500 hover:bg-orange-600`
- Mobile-first: 393x852 viewport with safe areas

### 4. Feature Flag System
```typescript
// Use feature flags for new functionality
import { useFeatureFlag } from './src/shared/hooks/useFeatureFlag';

const isNewFeatureEnabled = useFeatureFlag('NEW_FEATURE_NAME');
```

### 5. Bilingual Support
All text must support English and Kinyarwanda:
```typescript
const content = {
  en: { title: 'English Title' },
  rw: { title: 'Kinyarwanda Title' }
};
```

---

## 🚨 Critical Guidelines

### DO NOT:
1. Create new component files without checking if they already exist
2. Modify `/components/figma/ImageWithFallback.tsx` (protected file)
3. Override typography classes unless specifically requested
4. Break the shared data architecture between customer and vendor
5. Remove existing bilingual support

### ALWAYS:
1. Check for existing implementations before creating new ones
2. Maintain the glass design system consistency
3. Use safe area utilities for mobile (`pb-safe`, `pt-safe`, etc.)
4. Add proper TypeScript types
5. Include TODO comments for API integration points

### WHEN EDITING LARGE FILES:
1. Use `edit_tool` with sufficient context (3-5 lines before/after)
2. Make targeted changes rather than full rewrites
3. Test integration points after changes
4. Check for any temporary files that might contain newer implementations

---

## 🔄 Integration Testing Checklist

After making changes, verify:
- [ ] Customer can place orders (data flows to vendor)
- [ ] Vendor can update order status (data flows to customer)
- [ ] Menu changes from vendor appear in customer app
- [ ] No broken imports or missing dependencies
- [ ] Bilingual support still works
- [ ] Mobile responsiveness maintained
- [ ] Glass design language preserved

---

## 📞 Emergency Procedures

If you encounter truncated files and need full context:
1. Look for similar components in the `/src/features/` structure
2. Check if there are temporary files with implementations
3. Use multiple targeted `view_tool` calls to piece together the file
4. Look at import/export statements to understand dependencies
5. Check the commit history or backup files for complete implementations

Remember: The app is production-ready with real-time data synchronization. Any changes must maintain this critical functionality while preserving the established design system and user experience.