<script lang="ts">
    import { browser } from '$app/environment';
    
    export let data;

    if (browser) {
        console.log(data);
        document.cookie = `tok=${data.tok}; path=/`;

        if (data.gameInfo?.state === 'partialReady') {
            const poll = setInterval(() => {
                fetch(`/i/${data.gameInfo?.gameid}`)
                    .then(res => res.json())
                    .then(res => {
                        if (res.state === 'ready') {
                            clearInterval(poll);
                            window.location.reload();
                        }
                    });
            }, 1000);
        }
        if (data.gameInfo?.state === 'ready') {
            const poll = setInterval(() => {
                fetch(`/i/${data.gameInfo?.gameid}`)
                    .then(res => res.json())
                    .then(res => {
                        if (res.state === 'finished') {
                            clearInterval(poll);
                            window.location.reload();
                        }
                    });
            }, 1000);
        }
    }
    function pickrand() {
        fetch('https://en.wikipedia.org/w/api.php?action=query&generator=random&grnlimit=1&grnnamespace=0&inprop=url&prop=info&format=json&origin=*')
        // get the json response
        .then(response => response.json())
        .then(data => {
            // get the link
            let link = (Object.values(data.query.pages) as any)[0].fullurl;
            // url-decode the link
            link = decodeURIComponent(link);
            // set the input value to the link
            (document.querySelector('input') as HTMLInputElement).value = link;
        });
    }
    function submitUrl() {
        document.getElementById('submit')?.classList.add('animate-pulse');
        document.getElementById('submit')?.classList.add('disabled');
        let url = (document.querySelector('input') as HTMLInputElement).value;
        fetch(`/i/${data.gameInfo?.gameid}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "select", gameUrl: url })
        }).then(res => {
            if (res.status === 200) {
                window.location.reload();
            }
        });
    }
    function sayImDone() {
        fetch(`/i/${data.gameInfo?.gameid}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "done" })
        }).then(res => {
            if (res.status === 200) {
                window.location.reload();
            }
        });
    }


</script>

<div class="flex flex-col bg-black text-white min-h-screen h-screen items-center justify-center">
    <div class="absolute top-0 mt-2 left-1/2 transform -translate-x-1/2 items-center text-center">
        <h1 class="text-3xl">wikipedia speedruns</h1>
    </div>
    {#if data.gameInfo && data.gameInfo.state}
        {#if data.gameInfo.state === 'partialReady'}
            <div class="flex flex-col justify-center items-center">
            <h1 class="text-4xl border border-white p-2 border-dashed rounded-xl bg-gradient-to-tr from-fuchsia-700 to-blue-800 animate-pulse">starting game</h1>
            <p>waiting for opponent to pick a page</p>
            </div>
        {:else if data.gameInfo.state === 'connected'}
            <div class="flex flex-col justify-center items-center text-center">
                <h1 class="text-4xl p-2 rounded-xl">pick a page</h1>
                <p>this page will be either the start point or the end point.</p>
                <p>your opponent will also pick a page</p>
                <div class="flex flex-row w-full">
                    <input class="mt-2 p-4 w-full bg-black rounded-xl border-4 border-white" type="text" placeholder="english wikipedia link">
                    <a href="https://en.wikipedia.org" target="_blank" class="ml-2 mt-2 p-4 border-4 border-white rounded-xl hover:bg-white hover:text-black">open wikipedia</a>
                    <button on:click={pickrand} id="submit" class="ml-2 mt-2 p-4 border-4 border-white rounded-xl hover:bg-white hover:text-black">random page</button>
                </div>
                <button on:click={submitUrl} class="mt-2 p-4 rounded-xl hover:bg-white hover:text-black hover:underline">continue</button>
            </div>
        {:else if data.gameInfo.state === 'ready'}
            <div class="flex flex-col justify-center items-center">
                <iframe src="https://en.wikipedia.org" sandbox="allow-same-origin" class="absolute h-screen w-screen min-h-screen" frameborder="0" title="game" id="wikiframe"></iframe>
            </div>
            <div class="absolute bottom-0 mb-2 left-1/2 transform -translate-x-1/2 items-center text-center bg-black bg-opacity-50 rounded-xl hover:bg-opacity-100">
                <button on:click={sayImDone} class="p-4 rounded-xl hover:underline hover:shadow-2xl">i got it!</button>
            </div>
        {:else if data.gameInfo.state === 'finished'}
            <div class="flex flex-col justify-center items-center">
                <h1 class="text-4xl border border-white p-2 rounded-xl">game over</h1>
                <p>thanks for playing! 🏴‍☠️🏴‍☠️🏴‍☠️</p>
                <a href="/" class="mt-4 text-xl hover:underline">go back</a>
            </div>
        {:else}
            <div class="flex flex-col justify-center items-center">
                <h1 class="text-4xl border border-white p-2 rounded-xl">game in progress</h1>
                <p>if you're trying to play and confused, try staying on the homepage until someone else uses your join code.</p>
            </div>
        {/if}
    {:else}
        <div class="flex flex-col justify-center items-center">
            <h1 class="text-4xl border border-white p-2 rounded-xl">game does not exist</h1>
            <a href="/" class="mt-4 text-xl hover:underline">go back</a>
        </div>
    {/if}
</div>