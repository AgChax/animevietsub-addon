const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://animevietsub.best';

const manifest = {
    id: 'org.animevietsub.nuvio',
    version: '1.0.0',
    name: 'AnimeVietsub Addon',
    description: 'Addon xem anime Vietsub từ animevietsub.best cho Stremio và Nuvio',
    types: ['anime', 'series', 'movie'],
    catalogs: [
        {
            type: 'anime',
            id: 'animevietsub_latest',
            name: 'Anime Mới Cập Nhật',
            extra: [{ name: 'search', isRequired: false }]
        }
    ],
    resources: ['catalog', 'meta', 'stream'],
    idPrefixes: ['avs:']
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ type, id, extra }) => {
    try {
        let url = BASE_URL;
        if (extra && extra.search) {
            url = `${BASE_URL}/tim-kiem?keyword=${encodeURIComponent(extra.search)}`;
        }

        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);
        const metas = [];

        $('.item.film-item, .TPostMv').each((_, element) => {
            const title = $(element).find('.film-name, .Title').text().trim();
            const link = $(element).find('a').attr('href');
            const poster = $(element).find('img').attr('data-src') || $(element).find('img').attr('src');

            if (link) {
                const idMatch = link.match(/\/phim\/([^\/]+)/);
                const filmId = idMatch ? idMatch[1] : encodeURIComponent(link);

                metas.push({
                    id: `avs:${filmId}`,
                    type: 'anime',
                    name: title || 'Anime',
                    poster: poster || '',
                    description: 'Xem anime vietsub từ AnimeVietsub'
                });
            }
        });

        return { metas };
    } catch (error) {
        console.error('Error fetching catalog:', error.message);
        return { metas: [] };
    }
});

builder.defineMetaHandler(async ({ type, id }) => {
    try {
        const filmId = id.replace('avs:', '');
        const url = filmId.startsWith('http') ? decodeURIComponent(filmId) : `${BASE_URL}/phim/${filmId}`;
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        const title = $('.film-info-title h1, h1.Title').text().trim() || 'Anime';
        const poster = $('.film-info-image img, .Image img').attr('src') || '';
        const description = $('.film-info-description, .Description').text().trim() || '';

        const videos = [];
        $('.list-episode a.btn-episode, .list-episode a').each((index, element) => {
            const epTitle = $(element).text().trim();
            videos.push({
                id: `${id}:${index + 1}`,
                title: `Tập ${epTitle || (index + 1)}`,
                episode: index + 1,
                released: new Date().toISOString(),
                season: 1
            });
        });

        return {
            meta: {
                id,
                type: 'anime',
                name: title,
                poster,
                description,
                videos: videos.length > 0 ? videos : [{ id: `${id}:1`, title: 'Tập 1', episode: 1 }]
            }
        };
    } catch (error) {
        console.error('Error fetching meta:', error.message);
        return { meta: {} };
    }
});

builder.defineStreamHandler(async ({ type, id }) => {
    try {
        const parts = id.split(':');
        const filmSlug = parts[1];
        const epNum = parts[2] || 1;

        const watchUrl = `${BASE_URL}/xem-phim/${filmSlug}/tap-${epNum}.html`;
        const response = await axios.get(watchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        let streamUrl = '';
        $('script').each((_, element) => {
            const scriptContent = $(element).html();
            if (scriptContent && scriptContent.includes('.m3u8')) {
                const match = scriptContent.match(/(https?:\/\/[^"']+\.m3u8)/);
                if (match) {
                    streamUrl = match[1];
                }
            }
        });

        const streams = [];
        if (streamUrl) {
            streams.push({
                title: 'AnimeVietsub - HD Stream',
                url: streamUrl
            });
        } else {
            streams.push({
                title: 'Xem trực tiếp trên Web',
                url: watchUrl,
                externalUrl: watchUrl
            });
        }

        return { streams };
    } catch (error) {
        console.error('Error fetching stream:', error.message);
        return { streams: [] };
    }
});

const port = process.env.PORT || 7000;
serveHTTP(builder.interface, { port });
console.log(`Addon running on http://localhost:${port}`);
