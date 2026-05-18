<script lang="ts">
	import Scrobbler from "../components/Scrobbler.svelte";
	import Sidebar from "../components/Sidebar.svelte";
    import Song from "../components/Song.svelte";
    import { type SongFull } from "../types.ts";
    import { MusicBrainz } from "../util/api.ts";

    const songWidth = 335;
    const songHeight = 75;

    let scrobbler: Scrobbler;

    let exampleSong1: SongFull = {
        name: "Hey Nineteen",
        artist: "Steely Dan",
        album: "Gaucho"
    }
    let exampleSong2: SongFull = {
        name: "Goodbye Stranger",
        artist: "Supertramp",
        album: "Breakfast in America"
    }

    let drawSidebar = $state(true);  // TODO: This should hide if the window becomes too small
    
    function getSong() {
        const api = new MusicBrainz();
        api.getSong("Goodbye Stranger", "Supertramp");
    }
</script>

<Scrobbler bind:this={scrobbler}/>
<div
    class="grid grid-container"
    style:min-height="100vh"
>
    <div
        class="friends bg-blue-100"
        style:height=94vh
    >
        <div class="grid grid-cols-4 grid-rows-2 text-center h-full">
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 1</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong1}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 2</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong1}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 3</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong2}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 4</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong1}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 5</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong2}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 6</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong1}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 7</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong1}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
            <div class="friend grid grid-cols-1 grid-rows-2 bottom-2">
                <div>Friend 8</div>
                <div class="flex justify-center mt-auto mb-2">
                    <Song
                        song={exampleSong2}
                        width={songWidth}
                        height={songHeight}
                    />
                </div>
            </div>
        </div>
    </div>
    {#if drawSidebar}
        <div
            class="sidebar flex right-0 bg-blue-200"
        >
            <Sidebar />
        </div>
    {/if}
    <div
        class="footer border-t flex bottom-0 bg-blue-200 w-full items-center justify-center"
        style:height=6vh
    >
        <button
            class="btn flex justify-center items-center"
            onclick={() => getSong()}
        >
            Scrobble
        </button>
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

    .grid-container {
        display: grid;
        grid-template-areas:
            "friends sidebar"
            "footer footer";
        grid-template-columns: 84vw 16vw;
    }

    .grid-container div.friends {
        grid-area: friends;
    }

    .grid-container div.sidebar {
        grid-area: sidebar;
    }

    .grid-container div.footer {
        grid-area: footer;
    }

    .grid-friends {
        display: grid;
        grid-template-rows: 1vh 1vh;
        grid-template-columns: 1vw 1vw 1vw 1vw;
    }
</style>