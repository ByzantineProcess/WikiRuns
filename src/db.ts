// good enough ephemeral in-memory db
let db: { [key: string]: { gameid: string, state: string, p1loc: string, p2loc: string, target: string, startpoint: string } } = {};

let secdb: { [key: string]: { p1tok: string, p2tok: string } } = {};

export { db, secdb };