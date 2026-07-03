<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Scrobble } from '../types';
	import type { MusicAPI } from '../util/api';
	import { SCROBBLE_PAGE_SIZE } from '../util/constants';
	import Song from './Song.svelte';

	let { api, scrobbles, scrobblesTotal }: { api: MusicAPI; scrobbles: Scrobble[] | null, scrobblesTotal: number } = $props();

	const songWidth: string = '95%';
	const songHeight: string = '9.5vh';

	let scrobblesVisible: Scrobble[] = $state([]);
	let currentScrobblePage = $state("0");
	let currentScrobblePageNum = $derived(parseInt(currentScrobblePage));

	onMount(async () => {
		// Reset page iteration
		cookieStore.set('userScrobblePage', '0');
	});

	$effect(() => {
		if (scrobbles) {
			scrobblesVisible = scrobbles
		}
	});
</script>

<div class="history mt-2 flex w-full flex-col items-center gap-2">
	<div class="text-cener font-bold">History</div>
	{#if scrobbles === null}
		<span class="h-full loading mt-2 loading-lg loading-dots"></span>
	{:else}
		<div class="grid grid-cols-1 gap-2 w-full">
			{#each scrobblesVisible as scrobble (scrobble)}
				<Song song={scrobble} height={songHeight} width={songWidth} {api} fetchArt={true} />
			{/each}
		</div>

		<div class="join w-full mt-auto mb-2 rounded-lg justify-center">
			{#each { length: scrobblesTotal / SCROBBLE_PAGE_SIZE }, currentPage}
			<input
					class={currentPage === currentScrobblePageNum ? 'join-item btn btn-square bg-listenin-primary-light' : 'join-item btn btn-square bg-listenin-primary-dark'}
				type="radio"
				name="options"
					aria-label={(currentPage + 1).toString()}
					onclick={() => {
						cookieStore.set('userScrobblePage', currentPage.toString());
						currentScrobblePage = currentPage.toString();
						invalidate("supabase:user_data");
						scrobbles = null;  // Using null to identify loading vs. []
					}}
				/>
			{/each}
		</div>
	{/if}
</div>
