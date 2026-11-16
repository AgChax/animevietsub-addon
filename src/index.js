const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "org.animevietsubaddon",
    version: "1.0.0",
    name: "AnimeVietsub Addon",
    description: "Xem anime vietsub trên Stremio và Nuvio",
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

// Trả về danh sách phim mẫu để kiểm tra giao diện
builder.defineCatalogHandler(async (args) => {
    return {
        metas: [
            {
                id: "anime-1",
                type: "anime",
                name: "Jujutsu Kaisen Season 2",
                poster: "https://m.media-amazon.com/images/M/MV5BNGY4MTg3NzgtOWFkZi00YzVlLTg0MmEtOGVlOGZjYjQ2YWRmXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg",
                description: "Phim anime mẫu kiểm tra addon."
            },
            {
                id: "anime-2",
                type: "anime",
                name: "Demon Slayer: Hashira Training Arc",
                poster: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODNhXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg",
                description: "Phim anime mẫu kiểm tra addon."
            }
        ]
    };
});

builder.defineStreamHandler(async (args) => {
    return {
        streams: [
            {
                title: "Vietsub - 1080p",
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            }
        ]
    };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
