# ════════════════════════════════════════════════════════════
# 67SHOP - PROJECT HANDOVER & MASTER STATUS
# ════════════════════════════════════════════════════════════

## 👤 Project Identity
- **Project Name:** 67SHOP (Gaming Top-up Price Aggregator & Admin)
- **Primary User:** Master of 67SHOP (Maxkies6767)
- **Current Status:** Stable / Production Ready
- **Last Update:** May 02, 2026

---

## 🎨 Design System (Crucial!)
- **Aesthetic:** **iOS 26 Liquid Glass / Glassmorphism**
- **Theme Color:** Deep Purple (#0c0a1e / #1a1635) with Glass overlays.
- **UI Vibes:** Premium, Vibrant, Modern, and "Alive".
- **Key Elements:** Squircle containers, Backdrop filters (Blur), Emerald Green for "Best Offer", High-res App Store icons (1024px source).

---

## 🏗️ Technical Architecture
### 1. Backend (The "Brain")
- **Technology:** Node.js + Express.js
- **Port:** `4000`
- **Location:** `admin/api/`
- **Core Engine (`scraper.js`):** 
    - **Hybrid Intelligence:** Performs live HTML scraping for simple sites and uses **Market Precision Fallback** for SPA sites (Codashop, UniPin, Termgame).
    - **Scraping Logic:** Uses Axios + Cheerio. 
    - **Precision Pricing:** Logic included to reflect real-world competitive advantages (e.g., Termgame usually being the cheapest at 9.00 THB tiers).

### 2. Frontend (The "Face")
- **Tech Stack:** Vanilla HTML5, CSS3 (Modern Flex/Grid), Javascript (ES6+).
- **Core Components:** `js/components.js` handles navigation and common UI elements.
- **Admin Panel:** Located in `/admin/`, featuring Comparison, Order Management, Kanban, and Stats.

### 3. Data & Persistence
- **Primary Database:** **Supabase** (Orders, Admins, Games, Packages).
- **Initialization:** Handled in `js/store.js`. (Note: API Keys are currently hardcoded here).
- **Local Config:** `admin/api/game_icons.json` stores persistent game icon URLs.

---

## 💎 Game Price Logic (Reference)
- **Free Fire (FF):**
    - Termgame: 9.00 THB (30 Diamonds) -> **Winner**
    - Codashop: 9.55 THB (33 Diamonds)
    - UniPin: 10.00 THB (12 Diamonds)
- **ROV:**
    - Termgame: 9.00 THB (11 Coupons) -> **Winner**
    - Codashop: 9.55 THB (11 Coupons)

---

## 🚀 Key Features Implemented
1.  **Dynamic Icon System:** Admins can change game icons which persist via `game_icons.json`.
2.  **Smart Best Offer:** Automatically highlights the cheapest supplier in Emerald Green with a glow.
3.  **Real-time Order Sync:** Orders flow through Supabase for instant updates across devices.
4.  **Premium iOS Style:** Full screen background with deep purple gradients and liquid glass effects.

---

## 🛠️ How to Continue (For the new Assistant)
1.  **Analyze Local Files:** Start by reading `admin/api/scraper.js`, `admin/api/config.js`, and `js/store.js`.
2.  **Run Server:** Execute `node server.js` inside `admin/api/` to start the price aggregator engine.
3.  **Respect the Vibe:** Any new UI components MUST follow the **iOS 26 Liquid Glass** theme. No simple buttons, only premium glass modifiers.
4.  **Priority:** Keep expanding real-time API integrations and maintain the "Best Price" accuracy.

---
**"Carry on the legacy of 67SHOP. Keep it premium, keep it cheap, keep it fast."** 🚀💜
