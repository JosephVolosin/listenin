<script lang="ts">
	import type { Scrobble } from '../types';
	import type { MusicAPI } from '../util/api';
	import Song from './Song.svelte';

	let { api, scrobbles }: { api: MusicAPI; scrobbles: Scrobble[] } = $props();

	const songWidth: string = '95%';
	const songHeight: string = '100%';

	let scrobblesVisible: Scrobble[] = $state([]);

	$effect(() => {
		if (scrobbles) {
			scrobbles.sort((songA: Scrobble, songB: Scrobble) => {
				const songADate = new Date(songA.timestamp);
				const songBDate = new Date(songB.timestamp);
				return songBDate.getTime() - songADate.getTime();
			});
			// TODO: Should be smarter to work better with window size
			scrobblesVisible = scrobbles.slice(0, 9);
		}
	});
</script>

<div class="history mt-2 flex w-full flex-col items-center gap-2">
	<div class="text-cener font-bold">History</div>
	<div class="grid grid-cols-1 gap-2 w-full">
		{#each scrobblesVisible as scrobble (scrobble)}
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
