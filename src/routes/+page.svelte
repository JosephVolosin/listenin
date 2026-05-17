<script lang="ts">
	import Friend from "../components/Friend.svelte";
    import Scrobbler from "../components/Scrobbler.svelte";
	import Sidebar from "../components/Sidebar.svelte";
    import { type User } from "../types.ts";
    import { MusicAPI } from "../util/api.ts";

    const musicAPI = new MusicAPI();

    let scrobbler: Scrobbler;
    let drawSidebar = $state(true);  // TODO: This should hide if the window becomes too small
    let testUser: User = {
        username: "testguy",
        lastPlayed: {
            name: "Hey Nineteen",
            artist: "Steely Dan",
            album: "Gaucho"
        }
    };
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
            <Friend
                api={musicAPI}
                user={testUser}
            />
        </div>
    </div>
    {#if drawSidebar}
        <div
            class="sidebar flex right-0 bg-blue-200"
        >
            <Sidebar api={musicAPI}/>
        </div>
    {/if}
    <div
        class="footer border-t flex bottom-0 bg-blue-200 w-full items-center justify-center"
        style:height=6vh
    >
        <button
            class="btn flex justify-center items-center"
            onclick={() => scrobbler.show()}
        >
            Scrobble
        </button>
    </div>
</div>

<style>
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