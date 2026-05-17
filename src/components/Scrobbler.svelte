<script lang="ts">

    let width = $state(400);
    let height = $state(245);
    let left = $state(200);
    let top = $state(200);
    let isVisible = $state(false);

    let moving = false;

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

    $effect(() => { console.log(isVisible) })
</script>

<!-- TODO: Add 'X' to modal -->
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
    <div style:height=28px class="mb-2 mt-2 font-bold text-center text-xl">
        Scrobbler
    </div>
    <div class="grid gap-2 justify-center">
        <label class="input w-95">
        Track
        <input type="text" class="grow" />
        </label>

        <label class="input w-95">
        Artist
        <input type="text" class="grow" />
        </label>

        <label class="input w-95">
        Album
        <input type="text" class="grow" />
        </label>

        <button class="btn w-95" onclick={() => hide()}>Scrobble</button>
    </div>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:keydown={handleKeydown} />
<!-- TODO: Rating? Comment? -->