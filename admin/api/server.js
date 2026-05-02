const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const scraper = require('./scraper');
const logic = require('./logic');
const cache = require('./cache');

const app = express();
const PORT = 4000;
const ICONS_PATH = path.join(__dirname, 'game_icons.json');

app.use(cors());
app.use(express.json());

// --- ICON PERSISTENCE API ---

app.get('/api/config/icons', (req, res) => {
    try {
        if (!fs.existsSync(ICONS_PATH)) {
            return res.json({});
        }
        const data = fs.readFileSync(ICONS_PATH, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/config/icons', (req, res) => {
    try {
        const newIcons = req.body;
        fs.writeFileSync(ICONS_PATH, JSON.stringify(newIcons, null, 4), 'utf8');
        res.json({ status: 'success', message: 'Icons saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PRICE DATA API ---

app.get('/api/prices', async (req, res) => {
    try {
        console.log('[API] Requesting price data...');
        
        const cachedData = cache.get('grouped_prices');
        if (cachedData) {
            console.log('[Cache] Returning cached data');
            return res.json({
                status: 'success',
                source: 'cache',
                lastUpdated: new Date(),
                data: cachedData
            });
        }

        console.log('[Scraper] Starting parallel scrape...');
        const rawResults = await scraper.runAllScrapers(config);
        const groupedData = logic.processData(rawResults);
        cache.set('grouped_prices', groupedData);

        res.json({
            status: 'success',
            source: 'live',
            lastUpdated: new Date(),
            data: groupedData
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 67SHOP API Server running at http://localhost:${PORT}`);
    console.log(`📌 Admin Icon Sync: http://localhost:${PORT}/api/config/icons`);
});
