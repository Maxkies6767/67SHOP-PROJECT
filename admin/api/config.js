/**
 * 67SHOP AGGREGATOR CONFIGURATION (Total: 20 Suppliers)
 * รายชื่อเว็บผู้ให้บริการทั้งหมดที่ระบบเฝ้าติดตาม
 */
const CONFIG = [
    {
        name: "Richman Shop",
        type: "api",
        baseUrl: "https://richmanshop.com",
        games: { "Mobile Legends": "/game/mobilelegendsbangbang", "ROV": "/game/rov", "Free Fire": "/game/freefire" }
    },
    {
        name: "Over Topup",
        type: "html",
        baseUrl: "https://www.overtopup.com",
        games: { "Mobile Legends": "/game-topup/mobile-legends-bang-bang", "ROV": "/game-topup/rov", "Free Fire": "/game-topup/free-fire" },
        selectors: { container: "label.product-check", name: "div:nth-child(2)", price: "div:nth-child(3) div" }
    },
    {
        name: "P2W Topup",
        type: "html",
        baseUrl: "https://p2wtopup.com",
        games: { "Mobile Legends": "/เติมเงินเกม/mobile-legends/", "ROV": "/เติมเงินเกม/rov/", "Free Fire": "/เติมเงินเกม/free-fire/" },
        selectors: { container: ".product-item", name: ".product-name", price: ".product-price" }
    },
    {
        name: "JollyMax",
        type: "html",
        baseUrl: "https://www.jollymax.com/th",
        games: { "Mobile Legends": "/market/mlbb", "ROV": "/market/rov", "Free Fire": "/market/freefire" },
        selectors: { container: ".goods-item", name: ".goods-name", price: ".goods-price" }
    },
    {
        name: "Smile One",
        type: "html",
        baseUrl: "https://www.smile.one/th",
        games: { "Mobile Legends": "/mobilelegends", "ROV": "/rov", "Free Fire": "/freefire" },
        selectors: { container: ".product-list-item", name: ".name", price: ".price" }
    },
    {
        name: "GameTopup.co.th",
        type: "html",
        baseUrl: "https://gametopup.co.th",
        games: { "Mobile Legends": "/game/mlbb", "ROV": "/game/rov", "Free Fire": "/game/ff" },
        selectors: { container: ".item", name: ".title", price: ".price" }
    },
    {
        name: "KGGAME",
        type: "html",
        baseUrl: "https://kggame.com",
        games: { "Mobile Legends": "/mlbb", "ROV": "/rov" },
        selectors: { container: ".card", name: ".card-title", price: ".text-primary" }
    },
    {
        name: "EasyTopup",
        type: "html",
        baseUrl: "https://easytopup.in.th",
        games: { "Mobile Legends": "/game/mlbb", "Free Fire": "/game/ff" },
        selectors: { container: ".product-card", name: ".p-name", price: ".p-price" }
    },
    {
        name: "SEAGM",
        type: "mock",
        url: "https://www.seagm.com/th-th/"
    },
    {
        name: "Topup.in.th",
        type: "mock",
        url: "https://topup.in.th"
    },
    {
        name: "GameDede",
        type: "mock",
        url: "https://gamedede.com"
    },
    {
        name: "Razer Gold",
        type: "mock",
        url: "https://gold.razer.com"
    },
    {
        name: "LapakGaming",
        type: "mock",
        url: "https://www.lapakgaming.com/th-th/"
    },
    {
        name: "Midasbuy",
        type: "mock",
        url: "https://www.midasbuy.com"
    },
    {
        name: "Codashop",
        type: "html",
        baseUrl: "https://www.codashop.com/th-th",
        games: { "Mobile Legends": "/mobile-legends", "ROV": "/garena-rov--arena-of-valor", "Free Fire": "/free-fire" },
        selectors: { container: ".product-list__item", name: ".product-list__item__title", price: ".product-list__item__price" }
    },
    {
        name: "UniPin",
        type: "html",
        baseUrl: "https://www.unipin.com/th",
        games: { "Mobile Legends": "/mobile-legends", "ROV": "/game/arena-of-valor", "Free Fire": "/free-fire" },
        selectors: { container: "button.position-relative", name: "div:nth-child(1)", price: "div:nth-child(2)" }
    },
    {
        name: "Termgame",
        type: "html",
        baseUrl: "https://www.termgame.com",
        games: { "ROV": "/?app=100055", "Free Fire": "/?app=100067" },
        selectors: { container: "div[role='radio']", name: "span:first-child", price: "span:last-child" }
    },
    {
        name: "G-Cash",
        type: "mock",
        url: "https://gcash.com"
    },
    {
        name: "MeTopup",
        type: "mock",
        url: "https://metopup.com"
    },
    {
        name: "Garena Shop",
        type: "mock",
        url: "https://shop.garena.co.th"
    }
];

module.exports = CONFIG;
