<script lang="ts">
	import type { SongFull } from "../types";
	import Song from "./Song.svelte";
    
    let { api, scrobbles } = $props();

    const songWidth: string = "100%";
    const songHeight: string = "75px";
</script>

<div
    class="history flex flex-col gap-2 mt-2 items-center w-full"
>
    <div class="font-bold text-cener">History</div>
    <div class="m-2">
        {#each scrobbles as scrobble (scrobble)}
            <Song song={scrobble} height={songHeight} width={songWidth} {api} fetchArt={true} />
        {/each}
    </div>

    <!-- TODO: Pagination -->
    <!-- <div class="join w-full mt-auto mb-2 rounded-lg justify-center">
        <input
            class="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked={true}
        />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="2" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="3" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="4" />
    </div> -->
</div>

 <!-- TODO: Maybe just an openable menu instead? -->
<!-- <div class="buttons inline-grid gap-2 justify-center align-center w-full mt-auto mb-4">
    <button class="btn btn-sm rounded-lg">Add Friend</button>
    <div class="join w-full mt-auto mb-2 rounded-lg">
        <input
            class="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked={true}
        />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="2" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="3" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="4" />
    </div>
</div> -->
