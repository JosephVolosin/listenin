<script lang="ts">

    let width = $state(400);
    let height = $state(145);
    let isVisible = $state(true);
    let isLoading = $state(false);

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
    <div class="flex justify-center items-center">
        <input type="text" placeholder="Friend's name..." class="input ml-2 mr-2 mb-2 w-80% flex" bind:value={friendName} />
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
</div>

<svelte:window on:keydown={handleKeydown} />