const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// --- CONFIGURATION ---
const CONFIG_PATH = path.join(__dirname, 'suppliers.json');
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// --- ANTI-BOT & UTILS ---
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
];

let priceCache = { data: null, lastUpdated: null };

const getRandomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Retry with Backoff
const withRetry = async (fn, retries = 2) => {
    try { return await fn(); }
    catch (e) {
        if (retries <= 0) throw e;
        await new Promise(r => setTimeout(r, 2000));
        return withRetry(fn, retries - 1);
    }
};

// --- DATA NORMALIZATION ---
const normalize = (name) => {
    let clean = name.toLowerCase();
    const map = { 'points': [/pts/g, /พอยท์/g], 'diamonds': [/เพชร/g, /dm/g] };
    for (const [s, v] of Object.entries(map)) v.forEach(re => clean = clean.replace(re, s));
    return clean.replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
};

const groupResults = (data) => {
    const groups = [];
    data.forEach(item => {
        const nums = item.name.match(/\d+/g);
        const key = `${item.game}-${nums ? nums[0] : 'item'}`;
        let g = groups.find(x => x.key === key && Math.abs(x.avgPrice - item.price) <= 15);
        if (g) {
            g.items.push(item);
            g.avgPrice = g.items.reduce((a, b) => a + b.price, 0) / g.items.length;
        } else {
            groups.push({ key, game: item.game, avgPrice: item.price, items: [item] });
        }
    });
    return groups;
};

// --- SCRAPER ENGINES ---
const fetchStatic = async (supplier) => {
    return withRetry(async () => {
        const { data } = await axios.get(supplier.url, { 
            timeout: 10000, 
            headers: { 'User-Agent': getRandomUA() } 
        });
        const $ = cheerio.load(data);
        const results = [];
        $(supplier.selectors.container).each((i, el) => {
            const name = $(el).find(supplier.selectors.name).text().trim();
            const price = parseInt($(el).find(supplier.selectors.price).text().replace(/[^0-9]/g, ''));
            if (name && price) results.push({ name, price, supplier: supplier.name, url: supplier.url, game: supplier.game || 'Unknown' });
        });
        return results;
    }).catch(() => []); // Ignore single source failure
};

const fetchDynamic = async (supplier) => {
    return withRetry(async () => {
        const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent(getRandomUA());
        await page.goto(supplier.url, { waitUntil: 'networkidle2', timeout: 25000 });
        const items = await page.evaluate((sel) => {
            return Array.from(document.querySelectorAll(sel.container)).map(el => ({
                name: el.querySelector(sel.name)?.innerText.trim(),
                price: parseInt(el.querySelector(sel.price)?.innerText.replace(/[^0-9]/g, ''))
            }));
        }, supplier.selectors);
        await browser.close();
        return items.filter(i => i.name && i.price).map(i => ({ ...i, supplier: supplier.name, url: supplier.url, game: supplier.game || 'Unknown' }));
    }).catch(() => []);
};

// --- API ENDPOINT ---
app.get('/api/compare-prices', async (req, res) => {
    const now = Date.now();
    if (priceCache.data && (now - priceCache.lastUpdated < CACHE_TTL)) {
        return res.json({ success: true, source: 'cache', lastUpdated: priceCache.lastUpdated, groups: priceCache.data });
    }

    try {
        const suppliers = JSON.parse(fs.readFileSync(CONFIG_PATH));
        const tasks = suppliers.map(s => s.engine === 'puppeteer' ? fetchDynamic(s) : fetchStatic(s));
        const rawResults = await Promise.all(tasks);
        const grouped = groupResults(rawResults.flat());

        priceCache = { data: grouped, lastUpdated: now };
        res.json({ success: true, source: 'realtime', lastUpdated: now, groups: grouped });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.listen(PORT, () => console.log(`67SHOP Scraper running on port ${PORT}`));
