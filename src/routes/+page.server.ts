import type { PageServerLoad } from './$types';
import { db, secdb } from '../db';
import { v4 as uuidv4 } from 'uuid';

export let load: PageServerLoad = ({ params }) => {
	// db is shared across all requests
	// we can use it to gen game ids
	// random id for this game:
	let id = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
	// this should return a number with 4 digits, always
	// let's register this game in the db
	db[id] = {
		gameid: id,
		state: 'waiting',
		p1loc: '',
		p2loc: '',
		target: '',
		startpoint: ''
	};
	// before returning, let's generate a token for the client
	let tok = uuidv4();
	// link this token to the game id
	secdb[id] = {
		p1tok: tok,
		p2tok: ''
	};
	console.log("game gen'd");
	console.log(secdb);
	// then we return the id to the client
	return {id, tok};
};