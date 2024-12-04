<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let host = $state('');

    let gameIdInput: HTMLInputElement;

    onMount(() => {
        host = window.location.host;
    });

    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    // set tok to a cookie

    function copyLink() {
        const link = `https://${host}/g/${data.id}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            alert('Failed to copy: ' +  err);
        });
    }
    function handleInput() {
        if (gameIdInput.value.length === 4) {
            // go to the game page
            window.location.href = `https://${host}/g/${gameIdInput.value}`;
        }
    }
    if (browser) {
        document.cookie = `tok=${data.tok}; path=/`;
        const poll = setInterval(() => {
            fetch(`/i/${data.id}`)
                .then(res => res.json())
                .then(res => {
                    if (res.state === 'connected') {
                        clearInterval(poll);
                        window.location.href = `https://${host}/g/${data.id}`;
                    }
                });
        }, 1000);
    }
</script>

<div class="bg-black flex flex-col min-h-screen justify-center items-center">
    <h1 class="text-white pt-4 text-4xl text-center">yet another wikipedia speedrun app</h1>
    <div class="items-center justify-center text-center text-white">
        <p>give this game ID to someone else:</p>
        <h2 class=" text-4xl pt-2">{data.id}</h2>
        <p class="pt-2 pb-4"> ~ or ~ </p>
        <p>give this link to someone else:</p>
        <button class="ubuntu-mono-regular-italic mt-2 p-2 border-white border-spacing-1 rounded-2xl border-2 hover:bg-white hover:text-black" onclick={copyLink} style="cursor: pointer;" aria-label="Copy link">copy link</button>
        <p class="pt-8">to play someone else's game, enter their game ID here:</p>
        <input bind:this={gameIdInput} oninput={handleInput} id="gameIdIn" type="number" pattern="[0-9]*" class="bg-black mt-2 w-1/4 text-center pt-4 pb-4 text-2xl appearance-none border-white border-spacing-1 rounded-2xl border-2">
    </div>
</div>