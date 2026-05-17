<script lang="ts">
    import { type SongFull } from "../types.ts";

    let { song, width, height } = $props();

</script>

<div
    style:width={width}px
    style:height={height}px
    class="rounded-lg bg-blue-300 inline-flex border-black border"
>
    <div
        class="album-art border-r border-r-black h-full"
        style:width=25%
    >
    </div>
    <div
        class="song-info h-full text-left ml-2"
        style:width=75%
    >
        <div class="song text-lg font-bold mt-1 mb-1 w-full max-h-6 overflow-hidden">{song.name}</div>
        <div class="artist text-md w-full overflow-hdden" style:font-style="italic" style:margin-bottom="-4px">{song.artist}</div>
        <div class="album text-sm text-gray-600 w-full overflow-hidden" style:font-style="italic">{song.album}</div>
    </div>
</div>