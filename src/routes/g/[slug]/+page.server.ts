import { db, secdb } from '../../../db';
import { v4 as uuidv4 } from 'uuid';

export const load = ({ params, cookies }) => {
    console.log("loading game page");
    // we need to do a few things here
    const gameid = params.slug;
    let game = db[gameid];
    let provided_tok = cookies.get('tok');
    console.log("provided tok: ", provided_tok);
    console.log("game: ", game);
    if (!game) {
        return {
            gameInfo: null,
            tok: null,
        }
    }
    if (game.state === "waiting") {
        game.state = "connected";
    }
    if (!provided_tok) {
        console.log("no tok provided");
        let newtok = uuidv4();
        secdb[gameid].p2tok = newtok;
        return {
            gameInfo: game,
            tok: newtok
        }
    }
    if (provided_tok) {
        console.log("tok provided", provided_tok);
        if (provided_tok !== secdb[gameid].p2tok && provided_tok !== secdb[gameid].p1tok) {
            console.log("toks don't match, valid tok: ");
            console.log(secdb[gameid]);
            let newtok = uuidv4();
            secdb[gameid].p2tok = newtok;
            game.player = 2;
            return {
                gameInfo: game,
                tok: newtok
            }
        }
        else {
            // we have a valid tok
            console.log("valid tok");
            let player = 0;
            if (secdb[gameid].p1tok === provided_tok) {
                player = 1;
            }
            if (secdb[gameid].p2tok === provided_tok) {
                player = 2;
            }
            game.player = player;
            return {
                gameInfo: game,
                tok: provided_tok
            }
        }
    }
}