<script lang="ts">
	import { onMount } from 'svelte';
	import type { SongFull, SongDB } from '../types';
	import { albumArtIsStored, hashAlbum } from '../util/util';

	let { song, width, height, api, fetchArt = false } = $props();
	let albumArtURL: string = $state('');
	let songDB: SongDB | null = $state(null);
	let isLoading: boolean = $state(false);

	onMount(() => {
		// Retrieve album art from API
		if (fetchArt === true && song !== null) {
			isLoading = true;
			// Check if album art URL is already in local storage
			const artStorage = albumArtIsStored(song);
			if (artStorage !== null) {
				albumArtURL = artStorage;
				isLoading = false;
			} else {
				// If art isn't in local storage, request it
				getSong(song).then((songResponse) => {
					songDB = songResponse;
					if (songDB !== null) {
						getAlbumArt(songDB?.musicbrainzIds ?? null).then((artResponse) => {
							if (artResponse !== null) {
								sessionStorage.setItem(hashAlbum(song), artResponse);
								albumArtURL = artResponse;
								isLoading = false;
							}
						});
					}
				});
			}
		}
	});

	async function getSong(song: SongFull): Promise<SongDB | null> {
		// TODO: Can condense the logic here
		const songMusicBrainz: SongDB | null = await api.getSong(song.name, song.artist, song.album);
		if (songMusicBrainz !== null) {
			return new Promise<SongDB | null>((resolve) => resolve(songMusicBrainz));
		} else {
			console.error(`'${song.name} by '${song.artist}' was not found.'`);
			isLoading = false;
		}
		return new Promise<SongDB | null>((resolve) => resolve(null));
	}

	async function getAlbumArt(musicBrainzIds: string[] | null): Promise<string | null> {
		if (musicBrainzIds !== null) {
			for (const musicBrainzId of musicBrainzIds) {
				albumArtURL = (await api.getAlbumArt(musicBrainzId)) ?? '';
				// Return first hit
				if (albumArtURL !== '') {
					return new Promise<string | null>((resolve) => resolve(albumArtURL));
				}
			}
			isLoading = false;
		}
		return new Promise<string | null>((resolve) => resolve(null));
	}
</script>

<div
	style:min-width={width}
	style:height
	class="mr-2 ml-2 inline-flex rounded-lg border border-black bg-listenin-primary"
>
	<div class="album-art flex h-full justify-center border-r border-r-black" style:width="25%">
		{#if isLoading}
			<span class="loading loading-sm loading-spinner"></span>
		{:else}
			<img class="h-full w-full" src={albumArtURL} alt="Album art" />
		{/if}
	</div>
	<div class="song-info ml-2 h-full text-left" style:width="75%">
		<div class="song mt-1 mb-1 max-h-6 w-full overflow-hidden text-lg font-bold">{song.name}</div>
		<div
			class="artist text-md overflow-hdden w-full"
			style:font-style="italic"
			style:margin-bottom="-4px"
		>
			{song.artist}
		</div>
		<div class="album w-full overflow-hidden text-sm text-gray-600" style:font-style="italic">
			{song.album}
		</div>
	</div>
</div>
