# kcart — Project Overview

## Features
- Multi-vendor browsing with categories, vendor detail, and cart
- Explore collections with rich media
- Wallet summary with recent orders (mocked)
- Profile and settings
- API routes serving mock data for vendors and orders
- Design system aligned to iOS-like soft, rounded aesthetic

## Tech Stack
- Next.js 14 (App Router), React 18
- Tailwind CSS
- API Routes for serverless endpoints
- Sentry (optional), Stripe (test), MoMo (test), Supabase (future live)

## Data Flow
- UI fetches from /api/vendors and /api/orders (test mode)
- For live mode, replace mocks with Supabase/Postgres and real payment providers

## Core Logic Snippets
src/lib/api.ts uses API_CONFIG to switch between modes.

## What’s Built
- Core navigation (Home, Explore, Wallet, Profile)
- Vendor detail and Cart
- Mock API and sample assets via Unsplash

## What’s Next
- Auth (Supabase Auth), real DB schema, Stripe checkout session, MoMo integration
- E2E tests, analytics, error monitoring wiring