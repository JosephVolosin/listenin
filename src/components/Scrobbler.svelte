<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { currentUser, sendAlert } = $props();

	const actionURI = '?/scrobble';

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
		scrobbleSong === '' || scrobbleArtist === '' || scrobbleAlbum === ''
	);

	const handleScrobble: SubmitFunction = ({ formData }) => {
		isLoading = true;
		formData.append('user_id', currentUser);
		return async ({ result, update }) => {
			if (result.type === 'error') {
				sendAlert(result.type, result?.error ?? 'Unknown error');
			} else if (result.type === 'failure') {
				sendAlert(result.type, result.data?.error ?? 'Unknown error');
			} else if (result.type === 'success') {
				sendAlert(result.type, result?.data?.message ?? 'Unknown success');
			}
			isLoading = false;
			hide();
			update();
		};
	};

	export function show() {
		isVisible = true;
	}

	export function hide() {
		isVisible = false;
		scrobbleSong = '';
		scrobbleArtist = '';
		scrobbleAlbum = '';
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
		if (e.key === 'Escape') {
			hide();
		}
	}
</script>

<!-- TODO: fix a11y thing below -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="z-999999 cursor-move gap-3 rounded-lg bg-listenin-primary-dark p-2"
	style:user-select="none"
	style:position="absolute"
	style:left="{left}px"
	style:top="{top}px"
	style:width="{width}px"
	style:height="{height}px"
	style:visibility={isVisible ? 'visible' : 'hidden'}
	onmousedown={onMouseDown}
	role="form"
	bind:clientWidth={width}
>
	<div class="absolute top-0 right-0">
		<button class="btn absolute top-0.5 right-0.5 font-bold btn-ghost btn-sm" onclick={hide}
			>X</button
		>
	</div>
	<div style:height="28px" class="mt-2 mb-2 text-center text-xl font-bold">Scrobbler</div>
	<!-- TODO: Finish implementing form action -->
	<form method="POST" name="scrobble" action={actionURI} use:enhance={handleScrobble}>
		<div class="grid justify-center gap-2">
			<label class="input w-95 bg-listenin-primary-light">
				Song
				<input
					type="text"
					name="song"
					class="grow bg-listenin-primary-light"
					bind:value={scrobbleSong}
				/>
			</label>

			<label class="input w-95 bg-listenin-primary-light">
				Artist
				<input
					type="text"
					name="artist"
					class="grow bg-listenin-primary-light"
					bind:value={scrobbleArtist}
				/>
			</label>

			<label class="input w-95 bg-listenin-primary-light">
				Album
				<input
					type="text"
					name="album"
					class="grow bg-listenin-primary-light"
					bind:value={scrobbleAlbum}
				/>
			</label>

			{#if !isLoading}
				<button class="btn w-95 bg-listenin-primary" disabled={isScrobbleDisabled}>
					Scrobble
				</button>
			{:else}
				<span class="loading mt-2 loading-sm loading-dots"></span>
			{/if}
		</div>
	</form>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:keydown={handleKeydown} />
<!-- TODO: Rating? Comment? -->
