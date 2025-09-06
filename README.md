# 🛒 kcart — iOS‑inspired Static Web UI + RN Skeleton

This repository now ships a sleek, liquid‑glass iOS aesthetic front-end built with:
- HTML5, SASS/CSS3, JavaScript
- Anime.js and Animate.css for micro‑interactions
- Three.js for subtle, interactive 3D backgrounds
- React Native skeleton for mobile parity

All backend data is mocked with placeholders. Images sourced from Unsplash are royalty‑free and used as examples.

## 🚀 Quickstart (Web)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build styles:
   ```bash
   npm run build
   ```
3. Start local server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000/web/index.html`

## 📁 Structure
```
web/
  index.html         # Discover
  explore.html       # Collections
  vendor.html        # Vendor details & menu
  cart.html          # Cart summary
  wallet.html        # Wallet & orders
  profile.html       # Profile & settings
  styles/
    _variables.scss
    _base.scss
    main.scss → main.css
  scripts/
    data.js          # Placeholder vendors/orders/menu
    ui.js            # Rendering + micro-interactions
    three-background.js
  assets/images/
    favicon.svg
mobile/ (soon)
```

## 🧑‍🎨 Design Notes
- Typography uses Apple System font stack for an iOS feel.
- Cards, pills, and tab bar use glassmorphism with soft shadows.
- Micro‑interactions powered by Anime.js; page entrances use Animate.css.
- Background features gently floating translucent spheres via Three.js.

## 📱 React Native (skeleton)
A minimal RN skeleton will live under `mobile/` to mirror pages and styles.

## 🔒 Backend & Payments
Out of scope for this UI‑focused rebuild. All data is placeholder‑only.

## 🖼️ Images
Example images are from Unsplash (royalty‑free). Replace with your own assets before production.