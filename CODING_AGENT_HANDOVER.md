# DeliGo Coding Agent Handover Guide

## ⚡ Note on Tool Limitations

### The Problem with `view_tool` (Historical Context)

Previous AI coding agents, such as Figma's Make AI, faced significant limitations with the `view_tool`—a utility that truncated large file views, often displaying only partial content with `<respons[...]`

### Why This Is No Longer an Issue

With modern AI coding agents like Cursor and similar advanced tools, these file truncation issues are largely resolved:

- **Full File Context**: You can reliably access and analyze entire files, regardless of their size.
- **Seamless Editing**: There’s no need to break edits into small sections or worry about missing context.
- **Reliable Integration**: Imports, exports, state management, and integration points can all be handled holistically.
- **Reduced Duplication**: You can accurately identify and update existing implementations without accidentally creating redundant code.

**Legacy workarounds for truncated files (multiple targeted views, temporary files, etc.) are now obsolete.** However, some temporary or backup files may still exist in the codebase as a result of pas[...]

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
└── Onboarding Flow               # Role selection → App routing

/src/features/                    # NEW Professional Structure
├── auth/components/              # Role selection & onboarding
├── customer/components/          # Complete customer experience
│   ├── MainApp.tsx               # Main customer app entry point
│   ├── cart/                     # Cart functionality
│   ├── checkout/                 # Payment processing
│   ├── home/                     # Home screen with restaurants
│   ├── navigation/               # Bottom nav & sidebar
│   ├── orders/                   # Order tracking & history
│   ├── profile/                  # User profile management
│   ├── saved/                    # Saved items
│   └── search/                   # Search functionality
├── vendor/components/            # Vendor dashboard
└── shared/                       # Shared utilities & components

/components/                      # LEGACY Structure (being migrated)
├── VendorDashboardFixed.tsx      # Current vendor dashboard
├── Many other components...      # Some still in use, others migrated
└── ui/                           # Shadcn/ui components
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

## 🧹 Clean-up: Legacy Files & Known Issues

### Files That May Need Attention

#### 1. `/temp_menu_implementation.txt`
- **Purpose**: Contains menu management implementation details (created previously as a workaround)
- **Action Needed**: Review for relevant logic, then migrate or delete as appropriate.

#### 2. `/components/MenuTabContent.tsx`
- **Status**: Recently edited; verify changes are reflected in all vendor dashboard versions.
- **Dependencies**: Used by `VendorDashboardFixed.tsx`.

#### 3. Multiple Vendor Dashboard Versions
```
/components/VendorDashboardFixed.tsx        # Current active version
/components/VendorDashboardCompleteFixed.tsx
/components/VendorDashboardSafe.tsx
```
- **Action**: Consolidate into a single, working version if possible.

---

## 🎯 Best Practices for Working with This Codebase

### 1. Check Integration Points First
Always review what a component imports and what imports it:
```bash
grep -r "import.*ComponentName" src/
grep -r "from.*ComponentName" src/
```

### 2. Understand Data Flow
```
Customer Action → MainApp → App.tsx (Global Store) → VendorDashboard
     ↑                                                      ↓
Customer UI ← Real-time Updates ← Shared Data ← Vendor Action
```

### 3. Design System Compliance
- Cream background: `bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100`
- Glass cards: `bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20`
- Orange CTAs: `bg-orange-500 hover:bg-orange-600`
- **Mobile-first:** Support and test these viewports (width x height, in pixels):
  - 393x852
  - 412x917
  - 700x840
  - 402x874
  - 440x956
  - 430x932
  - 320x568

- Use safe areas for all mobile UIs

### 4. Feature Flag System
```typescript
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
1. Create new component files without checking for existing ones
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
1. Make targeted changes, not full rewrites, unless necessary
2. Test integration points after changes
3. Clean up any remaining temporary or backup files

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

If you encounter unclear file relationships or legacy patterns:
1. Look for similar components in `/src/features/`
2. Review temporary or backup files for relevant logic
3. Check imports/exports to understand dependencies
4. Reference commit history or backup files for full implementations

**Remember:** The app is production-ready with real-time data synchronization. Maintain this functionality and preserve the established design system and user experience in all your changes.

---
