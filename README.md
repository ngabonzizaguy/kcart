# 🛒 kcart — App Design & Setup Guide

A modern multi-vendor e-commerce & food delivery app, styled in iOS-19 design language, powered by Supabase, Stripe, Mobile Money (MoMo), and Sentry.

This document provides the design system, mock API setup, and reference rules so the app can be built consistently across all screens.

## 🎨 Brand Design System
**Colors**
- Primary Accent:   #efa7a7
- Secondary Accent: #ffd972
- Support 1:        #c7eae4
- Support 2:        #a7e8bd
- Support 3:        #fcbcb8
- Neutral:          white, black, system gray (adaptive)

**Typography**
- Font Family: SF Pro (Apple System Font)
- Large Title: Bold — 34pt
- Headline: Semibold — 17pt
- Body: Regular — 15pt
- Caption: Regular — 13pt

**Shape & Elevation**
- Border Radius: 16–24 (cards, buttons, sheets)
- Shadows: Subtle, soft (iOS-native style)

**Iconography**
- System: SF Symbols (Apple icons)
- Action Icons: Accent tinted
- Neutral Icons: System gray

## 📱 UI Patterns
- Navigation: Bottom tab bar (Home, Explore, Wallet, Profile)
- Primary Action: Floating Action Button (FAB)
- Secondary Actions: Bottom sheets & contextual menus
- Search: Sticky search bar + pill filters
- Cards: Rounded, soft shadows, accent highlights
- Lists: Smooth scroll, grouped sections, swipe actions

## 🧪 Mock API Setup
**config/api.ts**
```ts
export const API_CONFIG = {
  MODE: "test", // "test" | "live"

  SUPABASE_URL: "https://placeholder.supabase.co",
  SUPABASE_KEY: "public-anon-key-placeholder",

  STRIPE_SECRET: "sk_test_placeholder",
  MOMO_API_KEY: "test-placeholder",

  SENTRY_DSN: "https://examplePublicKey@o0.ingest.sentry.io/0"
};
```