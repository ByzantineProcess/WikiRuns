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

## the cors rant
CORS is great, until it works against you.

What seems like a relatively simple idea is instantly overcomplicated by MediaWiki pages not sending with any CORS headers. 

This means that my app cannot figure out what Wikipedia page you are on, even though you're browsing through an iframe **on my app**

I understand why this exists, and why MediaWiki protects against it (they use an account system which would otherwise be vulnerable to CSRF) but surely it's not too hard to just allow `&action=render` calls to return with working CORS headers within Wikipedia's API.

## personal choices
I made this in SvelteKit because I wanted to learn more of the framework. I'd used it before, and I like what I saw.

It's been somewhat fun learning the more opinionated aspects of the framework, but writing the server feels very different to the more component-based arch of Svelte in general.

if you made it through the text, thanks.

