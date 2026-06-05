<script lang="ts">
	import { onMount } from "svelte";
	import Song from "./Song.svelte";
	import type { Scrobble, SongFull, User } from "../types";

    let { api, username } = $props();
    
    const songWidth = "335px";
    const songHeight = "75px";

    let userData: User = $state({ username });
    let lastPlayed: Scrobble | null = $state(null);

    onMount(async () => {
        // Lookup user details
        // TODO: Handle failures
        const userResponse = await fetch(`/api/user/${username}`);
        const userResponseJSON: User[] = await userResponse.json();
        if (userResponseJSON.length > 0) {
            userData = userResponseJSON.pop();
        }
    });

    $effect(() => {
        if (userData.scrobbles) {
            const sortedScrobbles = userData.scrobbles.sort(
                (songA: Scrobble, songB: Scrobble) => {
                    const songADate = new Date(songA.timestamp);
                    const songBDate = new Date(songB.timestamp);
                    return songBDate.getTime() - songADate.getTime();
                }
            );
            lastPlayed = sortedScrobbles.at(0) ?? null;
        }
    })

</script>

<div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
    <div>{username}</div>
    <div class="flex justify-center mt-auto mb-2">
        {#if lastPlayed !== null}
            <Song
                song={lastPlayed}
                width={songWidth}
                height={songHeight}
                api={api}
                fetchArt={true}
            />
        {:else}
            <div>No recent plays.</div>
        {/if}
    </div>
</div>

<style>
    .friend {
        border-top: 1px;
        border-left: 1px;
        border-right: 1px;
        border-style: solid;
        border-color: black;
    }
</style>