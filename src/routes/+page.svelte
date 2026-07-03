<script lang="ts">
	import AddFriend from '../components/AddFriend.svelte';
	import Friend from '../components/Friend.svelte';
	import Scrobbler from '../components/Scrobbler.svelte';
	import UserLogin from '../components/UserLogin.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { type ActionResultTypes, type Scrobble } from '../types.ts';
	import { MusicAPI } from '../util/api.ts';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { isEven, scrobbleHistoriesMatch } from '../util/util.ts';

	let { data } = $props();
	let { user, friends, scrobbles, scrobblesTotal } = $derived(data);

	const musicAPI = new MusicAPI();

	let scrobbler: Scrobbler;
	let userLogin: UserLogin;
	let addFriend: AddFriend;

	let drawSidebar = $state(true); // TODO: This should hide if the window becomes too small
	let errorAlert: HTMLDivElement;
	let error: string = $state('');
	let successAlert: HTMLDivElement;
	let success: string = $state('');

	let latestScrobbles: Scrobble[] = $state([]);

	const handleLogout: SubmitFunction = () => {
		return async ({ update, result }) => {
			update();
			if (result.type === 'success') {
				handleSendAlert(result.type, result?.data?.message ?? 'Logged out successfully.');
			} else if (result.type === 'error') {
				handleSendAlert(result.type, result?.error ?? 'Unknown error');
			}
			// TODO: Do we care about handling the others? We don't anticipate those responses
		};
	};

	function handleSendAlert(type: ActionResultTypes, message: string) {
		if (type === 'failure') {
			errorAlert.style.display = '';
			error = message;
			setTimeout(() => {
				errorAlert.style.display = 'none';
				error = '';
			}, 5000);
		} else if (type === 'success') {
			successAlert.style.display = '';
			success = message;
			setTimeout(() => {
				successAlert.style.display = 'none';
				success = '';
			}, 5000);
		}
	}

	function handleAddFriend() {
		addFriend.show();
	}

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('supabase:user_data');
		}, 5000);

		return () => clearInterval(interval);
	});

	// Track the length of the retrieved scrobble history to know if we've retrieved new data (scrobbles are never deleted)
	$effect(() => sessionStorage.setItem('scrobbleHistory', scrobbles.length.toString()));

	$effect(() => {
		// Compare scrobbles between the last history and the newest one
		const historiesMatch = scrobbleHistoriesMatch(latestScrobbles, scrobbles);
		if (!historiesMatch) {
			latestScrobbles = scrobbles;
		}
	});
</script>

<AddFriend
	currentUser={user?.id}
	sendAlert={(type: ActionResultTypes, message: string) => handleSendAlert(type, message)}
	bind:this={addFriend}
/>
<UserLogin
	sendAlert={(type: ActionResultTypes, message: string) => handleSendAlert(type, message)}
	bind:this={userLogin}
/>
<Scrobbler
	currentUser={user?.id}
	sendAlert={(type: ActionResultTypes, message: string) => handleSendAlert(type, message)}
	bind:this={scrobbler}
/>
<div class="grid-container grid" style:min-height="100vh">
	<div class="friends" style:height="94vh">
		<div
			role="alert"
			class="absolute alert h-14 w-full alert-success"
			style:display="none"
			bind:this={successAlert}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{success}</span>
		</div>
		<div
			role="alert"
			class="absolute alert h-14 w-full alert-error"
			style:display="none"
			bind:this={errorAlert}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{error}</span>
		</div>
	</div>
	<div class="friends bg-listenin-primary" style:height="94vh">
		<div class="grid h-full grid-cols-4 grid-rows-2 text-center">
			{#each friends as friend, count (friend)}
				<div class="h-full rounded-sm">
					<Friend
						api={musicAPI}
						bgColor={isEven(count) ? 'bg-listenin-accent' : 'bg-listenin-primary-light'}
						userId={friend}
					/>
				</div>
			{/each}
		</div>
	</div>
	{#if drawSidebar}
		<div class="sidebar right-0 flex bg-listenin-primary-dark">
			<Sidebar scrobbles={latestScrobbles} {scrobblesTotal} api={musicAPI} />
		</div>
	{/if}
	<div
		class="bottom-0 footer flex w-full items-center justify-center border-t bg-listenin-primary-dark"
		style:height="7vh"
	>
		{#if user !== null}
			<span class="absolute left-0 m-2 font-bold">{user.user_metadata['username']}</span>
			<!-- TODO: username is a column but the Supabase type doesn't support it? -->
			<div class="flex">
				<button
					class="btn flex items-center justify-center bg-listenin-primary"
					onclick={() => scrobbler.show()}
				>
					Scrobble
				</button>
				<button
					class="btn flex items-center justify-center bg-listenin-primary"
					onclick={() => handleAddFriend()}
				>
					Add Friend
				</button>
			</div>
			<form method="post" action="?/logout" use:enhance={handleLogout}>
				<button class="btn flex items-center justify-center bg-listenin-primary"> Logout </button>
			</form>
		{:else}
			<button
				class="btn flex items-center justify-center bg-listenin-primary"
				onclick={() => userLogin.show()}
			>
				Login
			</button>
		{/if}
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-areas:
			'friends sidebar'
			'footer footer';
		grid-template-columns: 84vw 16vw;
	}

	.grid-container div.friends {
		grid-area: friends;
	}

	.grid-container div.sidebar {
		grid-area: sidebar;
	}

	.grid-container div.footer {
		grid-area: footer;
	}
</style>
