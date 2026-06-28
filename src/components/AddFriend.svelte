<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let width = $state(400);
	let height = $state(145);
	let isVisible = $state(false);
	let isLoading = $state(false);

	let { currentUser, sendAlert } = $props();

	const actionURI = $derived(`?/addFriend`);

	let friendName: string = $state('');
	let isAddDisabled = $derived(friendName === '');

	export function show() {
		isVisible = true;
	}

	export function hide() {
		isVisible = false;
		friendName = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			hide();
		}
	}

	const handleAdd: SubmitFunction = ({ formData }) => {
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
			update();
		};
	};
</script>

<!-- TODO: calculate center of screen to position this -->
<div
	class="absolute z-999999 rounded-lg bg-listenin-primary-dark"
	style:left="33%"
	style:top="33%"
	style:height="{height}px"
	style:width="{width}px"
	style:visibility={isVisible ? 'visible' : 'hidden'}
	role="form"
	bind:clientWidth={width}
>
	<div class="absolute top-0 right-0">
		<button class="btn absolute top-0.5 right-0.5 font-bold btn-ghost btn-sm" onclick={hide}
			>X</button
		>
	</div>
	<div style:height="28px" class="mt-4 mb-2 text-center text-lg font-bold">Add Friend</div>
	<form method="POST" name="addFriend" action={actionURI} use:enhance={handleAdd}>
		<div class="flex items-center justify-center">
			<input
				type="text"
				name="friend"
				placeholder="Friend's name..."
				class="w-80% input mr-2 mb-2 ml-2 flex bg-listenin-primary-light"
				bind:value={friendName}
			/>
		</div>
		<div class="flex items-center justify-center">
			{#if !isLoading}
				<button class="btn flex bg-listenin-primary btn-sm" disabled={isAddDisabled}> Add </button>
			{:else}
				<span class="loading mt-2 loading-sm loading-dots"></span>
			{/if}
		</div>
	</form>
</div>

<svelte:window on:keydown={handleKeydown} />
