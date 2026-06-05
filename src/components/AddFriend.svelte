<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";


    let width = $state(400);
    let height = $state(145);
    let isVisible = $state(false);
    let isLoading = $state(false);

    let { currentUser, sendAlert } = $props();

    const actionURI = $derived(`?/addFriend`);

    let friendName: string = $state('');
    let isAddDisabled = $derived(friendName === '');

    export function show() {
        isVisible = true;
    }

    export function hide() {
        isVisible = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            hide();
        }
    }

    const handleAdd: SubmitFunction = ({ formData }) => {
        isLoading = true;
        formData.append('user', currentUser);
        return async ({ result, update }) => {
            if (result.type === 'error') {
                sendAlert(result.type, result?.error ?? 'Unknown error');
            } else if (result.type === 'failure') {
                sendAlert(result.type, result.data?.error ?? 'Unknown error');
            } else if (result.type === 'success') {
                sendAlert(result.type, result?.data?.message ?? "Unknown success");
            }
            isLoading = false;
            update();
        }
    }
</script>

<!-- TODO: calculate center of screen to position this -->
<div
    class="z-999999 rounded-lg bg-white absolute"
    style:left=33%
    style:top=33%
    style:height={height}px
    style:width={width}px
    style:visibility={isVisible ? 'visible' : 'hidden'}
    role="form"
    bind:clientWidth={width}
>
    <div class="absolute right-0 top-0">
        <button class="btn btn-sm btn-ghost right-0.5 top-0.5 absolute font-bold" onclick={hide}>X</button>
    </div>
    <div style:height=28px class="mb-2 mt-4 font-bold text-center text-lg">
        Add Friend
    </div>
    <form method="POST" name="addFriend" action={actionURI} use:enhance={handleAdd}>
        <div class="flex justify-center items-center">
            <input type="text" name="friend" placeholder="Friend's name..." class="input ml-2 mr-2 mb-2 w-80% flex" bind:value={friendName} />
        </div>
        <div class="flex justify-center items-center">
            {#if !isLoading}
                <button class="btn btn-sm flex" disabled={isAddDisabled}>
                    Add
                </button>
            {:else}
                <span class="loading loading-dots loading-sm mt-2"></span>
            {/if}
        </div>
    </form>
</div>

<svelte:window on:keydown={handleKeydown} />