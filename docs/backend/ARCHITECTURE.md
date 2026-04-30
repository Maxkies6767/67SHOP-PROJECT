# 🏗️ Backend Architecture Specification: 67SHOP Aggregator

## 1. Overview
This document outlines the architectural design for a high-performance game top-up aggregator capable of fetching, normalizing, and searching prices across 20+ suppliers.

## 2. System Components

### A. Data Ingestion Layer (The Scrapers)
- **Engine**: Node.js with `Puppeteer` (for SPA/heavy JS sites) or `Axios` + `Cheerio` (for static HTML).
- **Orchestration**: `BullMQ` + `Redis`. 
- **Strategy**: Scheduled workers pull data every 5-15 minutes and push to the Database.

### B. Storage & Normalization Layer
- **Database**: PostgreSQL (Relational integrity is critical for product mapping).
- **Mapping Logic**: A "Canonical Product" pattern where every supplier's raw item is mapped to a Master ID.

### C. Search Engine (Fuzzy Search)
- **Primary Tool**: `Meilisearch`.
- **Reasoning**: Extremely fast, supports Thai word segmentation (ICU), and provides out-of-the-box Typo-tolerance and ranking.

---

## 3. Database Schema (PostgreSQL)

```sql
-- 1. Game Entities
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Master Product (What we show to the user)
CREATE TABLE master_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id),
    name TEXT NOT NULL,          -- e.g., "1000 + 20 Coupons"
    base_value INTEGER,          -- e.g., 1020
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Supplier Product Mapping (The raw data from 20 sources)
CREATE TABLE supplier_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_package_id UUID REFERENCES master_packages(id),
    supplier_name TEXT NOT NULL, -- e.g., "Codashop"
    raw_name TEXT NOT NULL,      -- e.g., "1020 ROV Gems (Limited)"
    price DECIMAL(10, 2),
    product_url TEXT,
    last_scraped_at TIMESTAMP WITH TIME ZONE,
    is_available BOOLEAN DEFAULT TRUE
);

-- 4. Search Optimization Index
CREATE INDEX idx_master_pkg_name ON master_packages USING gin (name gin_trgm_ops);
```

---

## 4. Fuzzy Search & Mapping Strategy

### Logic Flow:
1. **Extraction**: Normalize raw strings (e.g., lowercasing, removing "Coupons", "Gems", "Diamonds").
2. **Scoring**: Use Levenshtein distance or Trigrams to find the best match between `raw_name` and `master_packages.name`.
3. **Manual Override**: A Dashboard UI for admins to manually map "Unidentified" products to a Master ID.

### Search Flow:
1. User types "ROV 1000".
2. System queries `Meilisearch` for `master_packages` where `game=ROV` and `name` matches "1000" (fuzzy).
3. System joins with `supplier_packages` to get all live prices.
4. Results are sorted by `price ASC`.

---

## 5. Deployment Recommendation
- **Compute**: Docker Containers (ECS/K8s) for horizontal scaling of workers.
- **Cache**: Redis for BullMQ and API Response caching.
- **Search**: Managed Meilisearch or self-hosted in a separate container.
