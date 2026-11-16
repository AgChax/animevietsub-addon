const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// 1. Khai báo builder đúng chuẩn
const builder = new addonBuilder({
    id: "org.animevietsubaddon",
    version: "1.0.0",
    name: "AnimeVietsub Addon",
    description: "AnimeVietsub Addon for Stremio and Nuvio",
    resources: ["catalog", "stream"],
    types: ["anime"],
    catalogs: [
        {
            type: "anime",
            id: "animevietsub_catalog",
            name: "AnimeVietsub"
        }
    ]
});

// 2. Định nghĩa các handler cơ bản
builder.defineCatalogHandler(async () => {
    return { metas: [] };
});

builder.defineStreamHandler(async () => {
    return { streams: [] };
});

// 3. Sử dụng builder.getInterface() truyền vào serveHTTP để tránh lỗi undefined
serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
