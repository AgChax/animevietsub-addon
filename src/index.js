const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const builder = new addonBuilder({
    id: "org.animevietsubaddon",
    version: "1.0.0",
    name: "AnimeVietsub Addon",
    description: "Xem anime từ animevietsub.best",
    resources: ["catalog", "stream"],
    types: ["anime"],
    catalogs: [
        {
            type: "anime",
            id: "animevietsub_catalog",
            name: "AnimeVietsub - Mới Cập Nhật"
        }
    ]
});

// Xử lý lấy danh sách phim từ trang web
builder.defineCatalogHandler(async (args) => {
    try {
        const response = await axios.get("https://animevietsub.best/");
        const $ = cheerio.load(response.data);
        const metas = [];

        // Selector này tùy thuộc vào cấu trúc HTML thực tế của trang web
        $(".FilmItem").each((i, element) => {
            const title = $(element).find(".FilmName").text().trim();
            const link = $(element).find("a").attr("href");
            const poster = $(element).find("img").attr("data-src") || $(element).find("img").attr("src");
            
            if (link) {
                const id = link.split("/").pop(); // Lấy ID từ đường dẫn
                metas.push({
                    id: id,
                    type: "anime",
                    name: title || "Anime",
                    poster: poster
                });
            }
        });

        return { metas };
    } catch (error) {
        console.error("Lỗi lấy catalog:", error);
        return { metas: [] };
    }
});

builder.defineStreamHandler(async (args) => {
    // Phần xử lý lấy link phát video chi tiết cho từng tập phim
    return { streams: [] };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
