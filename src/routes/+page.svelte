<script lang="ts">
    import AddFriend from '../components/AddFriend.svelte';
	import Friend from "../components/Friend.svelte";
    import Scrobbler from "../components/Scrobbler.svelte";
    import UserLogin from "../components/UserLogin.svelte";
	import Sidebar from "../components/Sidebar.svelte";
    import { type ActionResultTypes, type User } from "../types.ts";
    import { MusicAPI } from "../util/api.ts";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from '@sveltejs/kit';

    let { data } = $props();
    let { claims, user, supabase, friends, scrobbles } = $derived(data);

    $effect(() => console.log(user));

    const musicAPI = new MusicAPI();

    let scrobbler: Scrobbler;
    let userLogin: UserLogin;
    let addFriend: AddFriend;

    let drawSidebar = $state(true);  // TODO: This should hide if the window becomes too small
    let errorAlert: HTMLDivElement;
    let error: string = $state('');
    let successAlert: HTMLDivElement;
    let success: string = $state('');

    const handleLogout: SubmitFunction = () => {
        return async ({ update, result }) => {
            update()
            if (result.type === 'success') {
                handleSendAlert(result.type, result?.data?.message ?? "Logged out successfully.");
            } else {
                handleSendAlert(result.type, result?.error ?? 'Unknown error');
            }
        }
    }

    function handleSendAlert(type: ActionResultTypes, message: string) {
        if (type === 'failure') {
            errorAlert.style.display = '';
            error = message;
            setTimeout(() => {
                errorAlert.style.display = 'none';
                error = '';
            }, 5000);
        } else if (type === 'success') {
            successAlert.style.display = '';
            success = message;
            setTimeout(() => {
                successAlert.style.display = 'none';
                success = '';
            }, 5000);
        }
    }

    function handleAddFriend() {
        addFriend.show();
    }
</script>

<AddFriend currentUser={user?.id} sendAlert={(type: ActionResultTypes, message: string) => handleSendAlert(type, message)} bind:this={addFriend} />
<UserLogin sendAlert={(type: ActionResultTypes, message: string) => handleSendAlert(type, message)} bind:this={userLogin} />
<Scrobbler currentUser={user?.id} sendAlert={(type: ActionResultTypes, message: string) => handleSendAlert(type, message)} bind:this={scrobbler} />
<div
    class="grid grid-container"
    style:min-height="100vh"
>
    <div
        class="friends bg-blue-100"
        style:height=94vh
    >
        <div role="alert" class="alert alert-success absolute h-14 w-full" style:display='none' bind:this={successAlert}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
        </div>
        <div role="alert" class="alert alert-error absolute h-14 w-full" style:display='none' bind:this={errorAlert}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
        </div>
    </div>
    <div
        class="friends bg-blue-100"
        style:height=94vh
    >

        <div class="grid grid-cols-4 grid-rows-2 text-center h-full">
            {#each friends as friend (friend)}
                <Friend
                    api={musicAPI}
                    userId={friend}
                />
            {/each}
        </div>
    </div>
    {#if drawSidebar}
        <div
            class="sidebar flex right-0 bg-blue-200"
        >
            <Sidebar {scrobbles} api={musicAPI}/>
        </div>
    {/if}
    <div
        class="footer border-t flex bottom-0 bg-blue-200 w-full items-center justify-center"
        style:height=6vh
    >
        {#if user !== null}
            <span class="font-bold absolute left-0 m-2">{user.user_metadata["username"]}</span> <!-- TODO: username is a column but the Supabase type doesn't support it? -->
            <div class="flex">
                <button
                    class="btn flex justify-center items-center"
                    onclick={() => scrobbler.show()}
                >
                    Scrobble
                </button>
                <button
                    class="btn flex justify-center items-center"
                    onclick={() => handleAddFriend()}
                >
                    Add Friend
                </button>
            </div>
            <form method="post" action="?/logout" use:enhance={handleLogout}>
                <button
                    class="btn flex justify-center items-center"
                >
                    Logout
                </button> 
            </form>
        {:else}
            <button
                class="btn flex justify-center items-center"
                onclick={() => userLogin.show()}
            >
                Login
            </button>
        {/if}
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