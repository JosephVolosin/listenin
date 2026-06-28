<script lang="ts">
	import type { Scrobble } from '../types';
	import Song from './Song.svelte';

	let { api, scrobbles } = $props();

	const songWidth: string = '95%';
	const songHeight: string = '75px';

	// TODO: Condense this and do it on initial retrieval
	$effect(() => {
		if (scrobbles) {
			scrobbles.sort((songA: Scrobble, songB: Scrobble) => {
				const songADate = new Date(songA.timestamp);
				const songBDate = new Date(songB.timestamp);
				return songBDate.getTime() - songADate.getTime();
			});
		}
	});
</script>

<div class="history mt-2 flex w-full flex-col items-center gap-2">
	<div class="text-cener font-bold">History</div>
	<div class="m-2 w-full">
		{#each scrobbles as scrobble (scrobble)}
			<Song song={scrobble} height={songHeight} width={songWidth} {api} fetchArt={true} />
		{/each}
	</div>

	<!-- TODO: Pagination -->
	<!-- <div class="join w-full mt-auto mb-2 rounded-lg justify-center">
        <input
            class="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked={true}
        />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="2" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="3" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="4" />
    </div> -->
</div>

<!-- TODO: Maybe just an openable menu instead? -->
<!-- <div class="buttons inline-grid gap-2 justify-center align-center w-full mt-auto mb-4">
    <button class="btn btn-sm rounded-lg">Add Friend</button>
    <div class="join w-full mt-auto mb-2 rounded-lg">
        <input
            class="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked={true}
        />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="2" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="3" />
        <input class="join-item btn btn-square" type="radio" name="options" aria-label="4" />
    </div>
</div> -->
