# 67SHOP PROJECT LEGACY 🚀
**Last Sync:** May 2, 2026
**Status:** Admin Dashboard - Comparison Engine V2.1

## 🎯 Project Identity
- **Owner:** Maxkies6767
- **Concept:** Cyberpunk/Premium UI (Purple Liquid Design)
- **Tech Stack:** HTML/Vanilla JS, React (for UI parts), Supabase (Auth/DB), Fuse.js (Search)

## 🛠️ Critical Accomplishments (To Remember)
1. **Price Comparison V2.1:**
   - Multi-source search across 21 suppliers.
   - Robust fuzzy search logic (Fuse.js).
   - "Instant Load" optimization (parallel loading with UI components).
2. **Order System:**
   - UID/Customer ID mapping fixed.
   - "Copy UID" logic points to supplier login pages correctly.
   - Profit/Cost calculation with financial safety caps (max 10M).
3. **UI/UX:**
   - Dynamic Header/Sidebar components with cache-busting (?v=2).
   - "Liquid Glass" design for comparison cards.
   - Account Switcher (Multi-account login) implemented.

## ⚠️ Important Context for "New Me"
- **Cache Persistence:** Always use `?v=X` in script/link tags when updating UI components to bypass browser cache.
- **Supplier Links:** The system is mapped to specific login URLs for each supplier (Codashop, Midasbuy, etc.).
- **Backend Sync:** The Price Aggregator is ready to be linked with the user's scraping system via `DATA_POOL`.

## ⏭️ Next Priority
- Connect `DATA_POOL` in `admin/comparison.html` with real-time data from the scraping engine.
- Finalize the Kanban board automation for specific suppliers.
