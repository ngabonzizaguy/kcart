# Architecture

## Overview
- Next.js App Router under `src/app`
- Reusable UI in `src/components`
- Mock data in `src/data` served via API routes
- Config via `src_config_api.ts` and `.env`

## Routes
- `/` Home (vendors list)
- `/explore` Collections
- `/wallet` Wallet summary
- `/profile` Profile/settings
- `/vendor/[id]` Vendor detail
- API: `/api/vendors`, `/api/orders`

## Styling
- Tailwind CSS with custom CSS variables matching the design system