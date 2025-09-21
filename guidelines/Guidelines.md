# DeliGo Glass Design Language

**The DeliGo Glass Design Language** is a warm, mobile-first design system that combines cream and orange color palettes with sophisticated glassmorphic effects to create a modern, food-focused user experience. This design language emphasizes warmth, accessibility, and premium feel while maintaining excellent mobile usability.

## Core Design Principles

### 1. Warm & Appetizing
- Use cream/warm backgrounds (`from-orange-50 via-amber-50 to-orange-100`) to create a food-friendly atmosphere
- Orange accent colors (`#f97316`) for primary actions and highlights
- Avoid cold colors that might reduce appetite appeal

### 2. Glassmorphic Elegance
- All cards and overlays use glass effects: `bg-white/80 backdrop-blur-sm border border-white/20`
- Strong glass effects for modals: `bg-white/90 backdrop-blur-md`
- Glass utility classes: `.glass` and `.glass-strong` are available in globals.css

### 3. Mobile-First & Safe
- Always use safe area utilities: `pb-safe`, `pt-safe`, `pl-safe`, `pr-safe`
- Bottom navigation spacing: `.bottom-nav-spacing` (96px + safe area)
- Hide scrollbars: `.scrollbar-hide` for clean mobile experience
- Minimum touch target: 44px (use `h-12` for buttons)

### 4. Bilingual Excellence
- All text content must support English and Kinyarwanda
- Use content objects with language keys: `content[language].textKey`
- Respect text length differences between languages

---

# Component Guidelines

## Cards & Containers
```tsx
// Standard glass card
<div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
  {/* Content */}
</div>

// Strong glass for important modals/overlays
<div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/30">
  {/* Modal content */}
</div>
```

**Rules:**
- Always use rounded corners: `rounded-3xl` for cards, `rounded-xl` for buttons
- Standard padding: `p-6` for cards, `p-4` for compact cards
- Glass effects are mandatory for all elevated surfaces

## Buttons & CTAs

### Primary Buttons (Orange CTAs)
```tsx
<Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12">
  {content[language].primaryAction}
</Button>
```

### Secondary Buttons (Outlined)
```tsx
<Button 
  variant="outline" 
  className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12"
>
  {content[language].secondaryAction}
</Button>
```

### Destructive Actions (Red accent)
```tsx
<Button 
  variant="outline" 
  className="border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12"
>
  {content[language].dangerousAction}
</Button>
```

**Rules:**
- Primary actions: Always orange (`bg-orange-500 hover:bg-orange-600`)
- All buttons: Minimum height `h-12` (44px) for accessibility
- Border radius: `rounded-xl` for all buttons
- Destructive actions: Red accents, never solid red unless critical

## Typography & Content

### Content Structure Pattern
```tsx
const content = {
  en: {
    title: 'English Title',
    description: 'English description text',
    action: 'Action Button'
  },
  rw: {
    title: 'Kinyarwanda Title',
    description: 'Kinyarwanda description text', 
    action: 'Kinyarwanda Action'
  }
};
```

### Usage in Components
```tsx
<h1>{content[language].title}</h1>
<p className="text-gray-600">{content[language].description}</p>
<Button>{content[language].action}</Button>
```

**Rules:**
- Never hardcode text strings - always use content objects
- Use semantic HTML: `h1`, `h2`, `h3`, `p`, `label` etc.
- Gray text hierarchy: `text-gray-800` > `text-gray-600` > `text-gray-500`

## Icons & Visual Elements

### Icon Standards
```tsx
import { Package, Clock, Check, AlertTriangle, Heart } from 'lucide-react';

// Standard icon sizing
<Package className="w-5 h-5" />      // Default size
<Clock className="w-4 h-4" />        // Small size  
<Check className="w-6 h-6" />        // Large size
```

### Status Indicators
```tsx
// Success (Green)
<div className="bg-green-500 text-white rounded-full p-2">
  <Check className="w-4 h-4" />
</div>

// In Progress (Orange)
<div className="bg-orange-500 text-white rounded-full p-2">
  <Clock className="w-4 h-4" />
</div>

// Warning/Issue (Red)
<div className="bg-red-100 text-red-500 rounded-full p-2">
  <AlertTriangle className="w-4 h-4" />
</div>
```

## Layout & Spacing

### Mobile Grid Patterns
```tsx
// Two-column actions
<div className="grid grid-cols-2 gap-4">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>

// Three-column grid for categories
<div className="grid grid-cols-3 gap-4">
  {items.map(item => <CategoryCard key={item.id} />)}
</div>
```

### Standard Spacing
- Page padding: `px-6 py-6`
- Card spacing: `mb-6` between cards
- Button spacing: `gap-4` between button groups
- Content spacing: `space-y-4` for vertical content

---

# Code Quality Standards

## Component Structure Template
```tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
// ... other imports

/**
 * ComponentName - Brief description of component purpose
 * 
 * Features:
 * - Feature 1 description
 * - Feature 2 description
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - onAction: () => void - Callback for main action
 * 
 * TODO: Add real API integration for [specific functionality]
 * TODO: Connect to Supabase for [data persistence]
 */
interface ComponentProps {
  language: 'en' | 'rw';
  onAction: () => void;
  // Add other props with clear types
}

// Mock data structure - replace with real API calls
const mockData = {
  // Structure your mock data to match expected API response
  id: 'unique-id',
  status: 'active',
  // ... other fields
};

export function ComponentName({ language, onAction }: ComponentProps) {
  // State management
  const [localState, setLocalState] = useState(initialValue);
  
  // Content localization
  const content = {
    en: {
      title: 'English Title',
      description: 'English description'
    },
    rw: {
      title: 'Kinyarwanda Title', 
      description: 'Kinyarwanda description'
    }
  };
  
  // Event handlers
  const handleAction = () => {
    // TODO: Replace with real API call
    // Example: await api.performAction(data);
    console.log('Action performed - integrate with real API');
    onAction();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Component content following glass design patterns */}
    </div>
  );
}
```

## Data Integration Comments
```tsx
// TODO: Replace with real restaurant data from API
const mockRestaurants = [
  {
    id: 'rest-1',
    name: { en: 'Golden Spoon', rw: 'Ikiganza cy\'Umuhanga' },
    // Structure matches expected API response
  }
];

// TODO: Integrate with payment processing
const handlePayment = async (paymentData) => {
  // Mock implementation - replace with real payment API
  console.log('Processing payment:', paymentData);
  // Example: const result = await paymentAPI.process(paymentData);
  return { success: true, transactionId: 'mock-txn-123' };
};

// TODO: Connect to real-time order tracking
const subscribeToOrderUpdates = (orderId) => {
  // Mock real-time updates - replace with WebSocket or similar
  console.log('Subscribing to order updates for:', orderId);
  // Example: return orderTrackingService.subscribe(orderId, updateCallback);
};
```

---

# Implementation Checklist

When creating new components, ensure:

- [ ] Uses DeliGo glass design patterns (`bg-white/80 backdrop-blur-sm`)
- [ ] Supports bilingual content (English/Kinyarwanda)
- [ ] Mobile-first with safe area considerations
- [ ] Orange CTAs for primary actions
- [ ] Proper accessibility (min 44px touch targets)
- [ ] Clear comments for API integration points
- [ ] Mock data structured like expected real data
- [ ] Follows consistent naming conventions
- [ ] Uses semantic HTML elements
- [ ] Implements proper loading and error states

**Remember: The DeliGo Glass Design Language creates a premium, warm, and accessible food delivery experience that works beautifully on mobile devices while maintaining visual consistency across all screens.**