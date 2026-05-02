const NodeCache = require('node-cache');

// เก็บ Cache ไว้ 10 นาที (600 วินาที)
const appCache = new NodeCache({ stdTTL: 600 });

module.exports = {
    get: (key) => appCache.get(key),
    set: (key, value) => appCache.set(key, value),
    clear: () => appCache.flushAll()
};
