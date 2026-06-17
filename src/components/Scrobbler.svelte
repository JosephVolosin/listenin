<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";

    let { currentUser, sendAlert } = $props();

    const actionURI = "?/scrobble";

    let width = $state(400);
    let height = $state(245);
    let left = $state(200);
    let top = $state(200);
    let isVisible = $state(false);
    let isLoading = $state(false);

    let moving = false;

    let scrobbleSong: string = $state('');
    let scrobbleArtist: string = $state('');
    let scrobbleAlbum: string = $state('');
    let isScrobbleDisabled = $derived(
        scrobbleSong === '' ||
        scrobbleArtist === '' ||
        scrobbleAlbum === ''
    )

    const handleScrobble: SubmitFunction = ({ formData }) => {
        isLoading = true;
        formData.append('user_id', currentUser);
        return async ({ result, update }) => {
            if (result.type === 'error') {
                sendAlert(result.type, result?.error ?? 'Unknown error');
            } else if (result.type === 'failure') {
                sendAlert(result.type, result.data?.error ?? 'Unknown error');
            } else if (result.type === 'success') {
                sendAlert(result.type, result?.data?.message ?? "Unknown success");
            }
            isLoading = false;
            hide()
            update();
        }
    }

    export function show() {
        isVisible = true;
    }

    export function hide() {
        isVisible = false;
    }

    function onMouseDown() {
        moving = true;
    }

    function onMouseUp() {
        moving = false;
    }

    function onMouseMove(e: MouseEvent) {
        if (moving) {
            left += e.movementX;
            top += e.movementY;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            hide()
        }
    }
</script>

<!-- TODO: fix a11y thing below -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="p-2 gap-3 z-999999 bg-white rounded-lg cursor-move"
    style:user-select=none
    style:position=absolute
    style:left={left}px
    style:top={top}px
    style:width={width}px
    style:height={height}px
    style:visibility={isVisible ? 'visible' : 'hidden'}
    onmousedown={onMouseDown}
    role="form"
    bind:clientWidth={width}
>
    <div class="absolute right-0 top-0">
        <button class="btn btn-sm btn-ghost right-0.5 top-0.5 absolute font-bold" onclick={hide}>X</button>
    </div>
    <div style:height=28px class="mb-2 mt-2 font-bold text-center text-xl">
        Scrobbler
    </div>
    <!-- TODO: Finish implementing form action -->
    <form method="POST" name="scrobble" action={actionURI} use:enhance={handleScrobble}>
        <div class="grid gap-2 justify-center">
            <label class="input w-95">
            Song
            <input type="text" name="song" class="grow" bind:value={scrobbleSong} />
            </label>

            <label class="input w-95">
            Artist
            <input type="text" name="artist" class="grow" bind:value={scrobbleArtist} />
            </label>

            <label class="input w-95">
            Album
            <input type="text" name="album" class="grow" bind:value={scrobbleAlbum} />
            </label>

            {#if !isLoading}
                <button class="btn w-95" disabled={isScrobbleDisabled}>
                    Scrobble
                </button>
            {:else}
                <span class="loading loading-dots loading-sm mt-2"></span>
            {/if}
        </div>
    </form>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:keydown={handleKeydown} />
<!-- TODO: Rating? Comment? -->