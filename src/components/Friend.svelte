<script lang="ts">
	import Song from "./Song.svelte";

    let { api, user } = $props();
    
    const songWidth = "335px";
    const songHeight = "75px";

</script>

<div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
    <div>{user.username}</div>
    <div class="flex justify-enter mt-auto mb-2">
        {#if user.lastPlayed}
            <Song
                song={user.lastPlayed}
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