const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
    id: "org.animevietsubaddon",
    version: "1.0.0",
    name: "AnimeVietsub Addon",
    description: "Xem anime vietsub trên Stremio và Nuvio",
    resources: ["catalog", "meta", "stream"],
    types: ["anime"],
    idPrefixes: ["anime-"],
    catalogs: [
        {
            type: "anime",
            id: "animevietsub_catalog",
            name: "AnimeVietsub - Mới Cập Nhật"
        }
    ]
});

// Dữ liệu phim mẫu
const sampleAnime = [
    {
        id: "anime-1",
        type: "anime",
        name: "Jujutsu Kaisen Season 2",
        poster: "https://m.media-amazon.com/images/M/MV5BNGY4MTg3NzgtOWFkZi00YzVlLTg0MmEtOGVlOGZjYjQ2YWRmXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg",
        description: "Phim anime mẫu kiểm tra addon.",
        videos: [
            { id: "anime-1:1", title: "Tập 1", season: 1, episode: 1, released: "2023-07-06T00:00:00.000Z" },
            { id: "anime-1:2", title: "Tập 2", season: 1, episode: 2, released: "2023-07-13T00:00:00.000Z" }
        ]
    },
    {
        id: "anime-2",
        type: "anime",
        name: "Demon Slayer: Hashira Training Arc",
        poster: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODNhXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg",
        description: "Phim anime mẫu kiểm tra addon.",
        videos: [
            { id: "anime-2:1", title: "Tập 1", season: 1, episode: 1, released: "2024-05-12T00:00:00.000Z" }
        ]
    }
];

// 1. Trả về danh sách phim ngoài trang Khám phá
builder.defineCatalogHandler(async () => {
    return { metas: sampleAnime };
});

// 2. Trả về thông tin chi tiết & danh sách tập khi bấm vào phim
builder.defineMetaHandler(async (args) => {
    const meta = sampleAnime.find((item) => item.id === args.id);
    return { meta: meta || null };
});

// 3. Trả về link phát video khi bấm vào từng tập
builder.defineStreamHandler(async (args) => {
    return {
        streams: [
            {
                title: "Vietsub - 1080p (Server Test)",
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            }
        ]
    };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
