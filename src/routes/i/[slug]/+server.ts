import { db, secdb } from '../../../db';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function GET({ params }: RequestEvent) {
    const slug = params.slug;

    if (!slug) {
        return json({ error: 'Id not provided' }, { status: 400 });
    }

    const info = db[slug];

    if (!info) {
        return json({ error: 'Info not found' }, { status: 404 });
    }

    return json(info);
}

function checkFull(gameid: string) {
    if (db[gameid].startpoint !== '' && db[gameid].target !== '') {
        db[gameid].state = 'ready';
    }
}

export async function POST({ request, cookies, params }: RequestEvent) {
    // POST requests will select a startpoint/target, and will update current locations
    const slug = params.slug; // game id
    const bodyParsed = await request.json();
    if (!slug) {
        return json({ error: 'Id not provided' }, { status: 400 });
    }
    // check cookies for a relevant token
    const provided_tok = cookies.get('tok');
    if (!provided_tok) {
        return json({ error: 'Token not provided' }, { status: 400 });
    }
    if (secdb[slug].p1tok !== provided_tok && secdb[slug].p2tok !== provided_tok) {
        return json({ error: 'Invalid token' }, { status: 401 });
    }
    if (!bodyParsed) {
        return json({ error: 'Body not provided' }, { status: 400 });
    }
    if (!bodyParsed.action) {
        return json({ error: 'Action not provided' }, { status: 400 });
    }
    if (bodyParsed.action === 'select') {
        if (!bodyParsed.gameUrl) {
            return json({ error: 'Startpoint or target not provided' }, { status: 400 });
        }
        // gameUrl is either startpoint or target
        // randomly select one
        const game = db[slug];
        if (!game) {
            return json({ error: 'Game not found' }, { status: 404 });
        }
        if (game.state !== 'connected' && game.state !== 'partialReady') {
            return json({ error: 'Game not connected' }, { status: 400 });
        }
        if (game.startpoint === '' && game.target === '') {
            // first selection
            const rand = Math.floor(Math.random() * 2);
            if (rand === 0) {
                game.startpoint = bodyParsed.gameUrl;
            } else {
                game.target = bodyParsed.gameUrl;
            }
            db[slug].state = 'partialReady';
            // 200 no content
            return json({}, { status: 200 });
        }
        if (game.startpoint !== '' && game.target === '') {
            game.target = bodyParsed.gameUrl;
            checkFull(slug);
            // 200 no content
            return json({}, { status: 200 });
        }
        if (game.startpoint === '' && game.target !== '') {
            game.startpoint = bodyParsed.gameUrl;
            checkFull(slug);
            // 200 no content
            return json({}, { status: 200 });
        }
    }
    return json({ error: 'Invalid action' }, { status: 400 });
}