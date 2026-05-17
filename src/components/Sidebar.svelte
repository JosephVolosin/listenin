<script lang="ts">
	import type { SongFull } from "../types";
	import Song from "./Song.svelte";

    const songWidth: number = 300;
    const songHeight: number = 75;

    let exampleSong1: SongFull = {
        name: "Faron Young",
        artist: "Prefab Sprout",
        album: "Steve McQueen"
    }

    let exampleSong2: SongFull = {
        name: "Sgt. Rock (Is Going To Help Me)",
        artist: "XTC",
        album: "Black Sea"
    }
</script>

<div
    class="history flex flex-col gap-2 mt-2 items-center w-full"
>
    <div class="font-bold text-cener">History</div>
    <Song song={exampleSong1} height={songHeight} width={songWidth} />
    <Song song={exampleSong2} height={songHeight} width={songWidth}  />

    <div class="join w-full mt-auto mb-2 rounded-lg justify-center">
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
