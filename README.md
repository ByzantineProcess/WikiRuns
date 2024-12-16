# WikiRuns
> a. k. a. "yet another wikipedia speedrunning app"

a pretty good web app for speedrunning wikipedia

made with SvelteKit and Tailwind.

## long description

I wanted to make a different wiki speedrun site focused on ease of connectivity and overall speed. Other options <sub><sup>apart from being blocked at my school</sup></sub> didn't feel modern, or required signups just to play. This is not the experience I wanted, so I set out to build a different one.

The multiplayer system is designed to be quick and snappy, with join links and 4-digit join codes available for any kind of connection.
No database is used, an in-memory JS object on the server side is good enough for what we do here. 

This app works in just 3 routes: the homepage, the game page, and an info API.
When a player visits the homepage, a new game ID is generated. For simplicity, game IDs and join codes are one and the same.

