const Fuse = require('fuse.js');

/**
 * 67SHOP Backend Prototype: Fuzzy Search & Price Aggregator Logic
 * 
 * This script demonstrates how to:
 * 1. Store aggregated data from multiple suppliers.
 * 2. Search using Fuzzy Matching (Approximate String Matching).
 * 3. Sort by price (Cheapest first).
 */

// 1. MOCKED DATA (In production, this would be in Meilisearch or PostgreSQL)
const aggregatedData = [
  { supplier: 'Codashop', name: 'ROV 1020 Coupons', price: 950, game: 'ROV', url: 'https://codashop.com/rov' },
  { supplier: 'Midasbuy', name: '1000 + 20 ROV Diamonds', price: 945, game: 'ROV', url: 'https://midasbuy.com/rov' },
  { supplier: 'Itemmania', name: 'ROV 1000 คูปอง (แถม 20)', price: 960, game: 'ROV', url: 'https://itemmania.com/rov' },
  { supplier: 'Richman', name: 'ROV 500 Coupons', price: 480, game: 'ROV', url: 'https://richmanshop.com/rov' },
  { supplier: 'INDEX Game', name: 'RoV: 1000 Coupons', price: 930, game: 'ROV', url: 'https://indexgame.center/rov' },
  { supplier: 'WonDD', name: 'PUBG Mobile 600 UC', price: 320, game: 'PUBG', url: 'https://wondd.com/pubg' }
];

/**
 * fuzzySearch(query)
 * Returns sorted list of packages matching the query.
 */
function fuzzySearch(query) {
  // CONFIG: Adjust threshold for sensitivity
  const options = {
    keys: ['name', 'game'],
    threshold: 0.4, // 0.0 (exact match) to 1.0 (match anything)
    includeScore: true,
    shouldSort: true
  };

  const fuse = new Fuse(aggregatedData, options);
  const results = fuse.search(query);

  // Return mapped items sorted by price
  return results
    .map(res => ({
      ...res.item,
      searchScore: res.score
    }))
    .sort((a, b) => a.price - b.price);
}

// --- DEMO EXECUTION ---
const keyword = "rov 1000";
console.log(`\n🔍 Searching for: "${keyword}"...`);

const output = fuzzySearch(keyword);

console.log(`✅ Found ${output.length} packages (Sorted by cheapest price):\n`);

output.forEach((item, index) => {
  console.log(`${index + 1}. [${item.supplier}] ${item.name}`);
  console.log(`   Price: ฿${item.price.toLocaleString()}`);
  console.log(`   Link: ${item.url}`);
  console.log(`   Match Confidence: ${(1 - item.searchScore).toFixed(2)}`);
  console.log('-------------------------------------------');
});
