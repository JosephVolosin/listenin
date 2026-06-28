<script lang="ts">
	import { onMount } from 'svelte';
	import Song from './Song.svelte';
	import type { Scrobble, User } from '../types';

	let { api, bgColor, userId } = $props();

	const songWidth = '335px';
	const songHeight = '75px';

	let userData: User = $derived({ username: '', scrobbles: [], user_id: userId });
	let lastPlayed: Scrobble | null = $state(null);

	onMount(async () => {
		// Lookup user details
		// TODO: Handle failures
		const userResponse = await fetch(`/api/user/${userId}`);
		const userResponseJSON: User[] = await userResponse.json();
		if (userResponseJSON.length > 0) {
			userData = userResponseJSON.pop() ?? { username: '', scrobbles: [], user_id: userId }; // TODO: What do we do when a friendship is broken like this?
		}
	});

	$effect(() => {
		if (userData.scrobbles) {
			const sortedScrobbles = userData.scrobbles.sort((songA: Scrobble, songB: Scrobble) => {
				const songADate = new Date(songA.timestamp);
				const songBDate = new Date(songB.timestamp);
				return songBDate.getTime() - songADate.getTime();
			});
			lastPlayed = sortedScrobbles.at(0) ?? null;
		}
	});
</script>

<div class="bottom-2 grid h-full grid-cols-1 grid-rows-2 {bgColor}">
	<div class="text-3xl font-bold">{userData.username}</div>
	<div class="mt-auto mb-2 flex justify-center">
		{#if lastPlayed !== null}
			<Song song={lastPlayed} width={songWidth} height={songHeight} {api} fetchArt={true} />
		{:else}
			<div>No recent plays.</div>
		{/if}
	</div>
</div>
