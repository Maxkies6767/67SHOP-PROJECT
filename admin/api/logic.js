/**
 * Normalization: ล้างชื่อให้คลีนเพื่อใช้จับคู่
 */
const normalizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/(diamonds|gems|พอยท์|คะแนน|pts|points|gold|uc|เติมเกม|💎|🔥)/gi, '') // ตัดคำที่ไม่จำเป็น
        .replace(/\s+/g, '') // ตัดช่องว่าง
        .trim();
};

/**
 * Grouping & Ranking Logic
 */
const processData = (rawData) => {
    const groups = {};

    rawData.forEach(item => {
        const normName = normalizeName(item.name);
        const key = `${item.game}-${normName}`;

        // หา Group ที่มีอยู่แล้ว และมีราคาต่างกันไม่เกิน ±3 บาท
        let targetGroup = Object.values(groups).find(g => 
            g.game === item.game && 
            normalizeName(g.title) === normName &&
            Math.abs(g.avgPrice - item.price) <= 3
        );

        if (!targetGroup) {
            groups[key] = {
                id: key,
                title: item.name,
                game: item.game,
                avgPrice: item.price,
                items: []
            };
            targetGroup = groups[key];
        }

        targetGroup.items.push(item);
        // อัปเดตราคาเฉลี่ยเพื่อใช้เปรียบเทียบตัวถัดไป
        targetGroup.avgPrice = targetGroup.items.reduce((sum, i) => sum + i.price, 0) / targetGroup.items.length;
    });

    // Ranking: เรียงลำดับราคาและใส่ Tag Cheapest
    return Object.values(groups).map(group => {
        // เรียงจากถูกไปแพง
        group.items.sort((a, b) => a.price - b.price);
        
        // ใส่ Tag cheapest ให้เจ้าที่ถูกที่สุด
        const minPrice = group.items[0].price;
        group.items = group.items.map(item => ({
            ...item,
            isCheapest: item.price === minPrice
        }));

        return group;
    });
};

module.exports = { processData };
