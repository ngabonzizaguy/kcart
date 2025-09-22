# Branch Setup Guide for Vite/Tailwind Migration

This guide lets another coding agent recreate the Vite + React + Tailwind migration on a dedicated branch so the `main` branch remains untouched.

## 1. Prepare the repository
1. Ensure you have the latest history:
   ```bash
   git checkout main
   git pull
   ```
2. Identify the last commit before the Vite migration (should be `082534b`). Verify with:
   ```bash
   git log --oneline | head
   ```

## 2. Create a working branch from the pre-migration state
```bash
git checkout 082534b
git checkout -b vite-tailwind-upgrade
```
This new branch now tracks the legacy layout.

## 3. Apply the migration commit
1. Fetch the migration commit (`a0d5c75`) if it is not in local history:
   ```bash
   git fetch origin a0d5c75:a0d5c75-temp
   ```
   Skip this step if the commit already exists locally.
2. Cherry-pick the commit onto the new branch:
   ```bash
   git cherry-pick a0d5c75
   ```
   Resolve any conflicts (none expected) and continue the cherry-pick if prompted.

## 4. Install dependencies and verify build
```bash
npm install
npm run build
```
Address any build issues before proceeding.

## 5. Push the branch for review
```bash
git push -u origin vite-tailwind-upgrade
```

## 6. Share testing instructions
Include the standard Vite scripts in the PR description:
```bash
npm run dev
npm run build
npm run preview
```

## 7. After approval
Merge `vite-tailwind-upgrade` into `main` once the visual review and automated checks pass.

---
**Summary for coding agent:** Create `vite-tailwind-upgrade` from `082534b`, cherry-pick `a0d5c75`, run `npm install`, ensure `npm run build` succeeds, then push the branch for testing.
