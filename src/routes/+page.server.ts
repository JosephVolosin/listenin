import { fail, type Actions } from '@sveltejs/kit';
import { supabase } from '../util/supabase';
import type { PageServerLoad } from './$types';
import type { FriendMapEntry, Scrobble } from '../types';

export const load: PageServerLoad = async ({ depends, url, locals: { supabase } }) => {
	// const { data, error } = await supabase.auth.getClaims();
	const userResponse = await supabase.auth.getUser();

	depends('supabase:user_data');

	// Retrieve user's friends
	// TODO: Should this be here or in the UI?
	let userFriends: string[] = [];
	let userScrobbles: Scrobble[] = [];
	const {
		data: { user: currentUser }
	} = userResponse;
	if (currentUser !== null && currentUser.id) {
		if (currentUser.id !== null) {
			// Gather friends data
			const friendsResponse = await supabase
				.from('friends')
				.select('*')
				.or(`friend_a.eq.${currentUser.id},friend_b.eq.${currentUser.id}`);
			if (friendsResponse.data) {
				// Generate a friends list from the returned data and push it into the original list
				// TODO: Do we really need to declare the initial list?
				const friendsList = friendsResponse.data.reduce(
					(friendsList: string[], currentFriendship: FriendMapEntry) => {
						if (currentFriendship.friend_a !== currentUser.id) {
							friendsList.push(currentFriendship.friend_a);
						} else {
							friendsList.push(currentFriendship.friend_b);
						}
						return friendsList;
					},
					[]
				);
				userFriends = friendsList;
			}
			// Gather personal history
			const scrobblesResponse = await supabase
				.from('scrobbles')
				.select('album, artist, name:song, timestamp')
				.eq('user_id', currentUser.id);
			if (scrobblesResponse.data) {
				userScrobbles = scrobblesResponse.data;
			} else {
				console.error(`Unable to retrieve user's history, ${scrobblesResponse.error.message}`);
			}
		}
	}
	return {
		url: url.origin,
		user: userResponse.data.user,
		scrobbles: userScrobbles,
		friends: userFriends
	};
};

export const actions: Actions = {
	addFriend: async ({ request, locals }) => {
		const formData = await request.json();
		const currentUser = formData.get('user_id')?.toString();
		const friendName = formData.get('friend')?.toString();

		if (currentUser !== null && friendName !== null) {
			// 1. Attempt to retrieve the friend's user ID
			const { error: idLookupError, data } = await locals.supabase
				.from('profiles')
				.select('id')
				.eq('username', friendName);

			// Check for error or no response
			if (idLookupError) {
				return fail(400, { error: idLookupError.message });
			} else if (data.length === 0) {
				return fail(400, { error: `No user named '${friendName}' exists.` });
			}

			// Pull id out, fail if none was returned
			const { id: friendUserId } = data.pop() ?? { id: null };
			if (friendUserId === null) {
				return fail(500, { error: `Could not locate '${friendName}'s user ID.` });
			}

			// 2. Create the friend linkage
			const { error: friendInsertError } = await locals.supabase.from('friends').insert({
				friend_a: currentUser,
				friend_b: friendUserId
			});
			if (friendInsertError) {
				return fail(400, { error: friendInsertError.message });
			}
			return { success: true, message: `Successfully added '${friendName}'!` };
		}
		return fail(400, { error: 'Invalid friend name, or no user is logged in.' });
	},
	login: async ({ request, locals }) => {
		const data = await request.json();

		const email = data.get('e-mail')?.toString();
		const password = data.get('password')?.toString();

		if (email !== undefined && password !== undefined) {
			const loginResponse = await locals.supabase.auth.signInWithPassword({
				email,
				password
			});
			if (loginResponse.error) {
				return fail(400, {
					error: {
						name: loginResponse.error.name,
						message: loginResponse.error.message,
						code: loginResponse.error.code,
						status: loginResponse.error.status
					}
				});
			}
			return {
				success: true,
				message: `Welcome ${loginResponse.data.user.user_metadata['username']}!`
			}; // TODO: username is a column, but not supported in the Supabase type?
		}

		return fail(400, { error: 'Login failed' });
	},
	logout: async ({ locals }) => {
		const result = await locals.supabase.auth.signOut();
		if (result.error) {
			return fail(400, {
				error: {
					name: result.error.name,
					message: result.error.message,
					code: result.error.code,
					status: result.error.status
				}
			});
		}
		return { success: true, message: 'Logged out successfully.' };
	},
	register: async ({ request }) => {
		const data = await request.json();

		const email = data.get('e-mail')?.toString();
		const password = data.get('password')?.toString();
		const username = data.get('username')?.toString();

		if (email !== undefined && password !== undefined && username !== undefined) {
			const client = supabase;
			const signUpResponse = await client.auth.signUp({
				email: email,
				password: password,
				options: {
					data: {
						username: username
					}
				}
			});
			if (signUpResponse.error) {
				return fail(signUpResponse.error.status ?? 400, { error: signUpResponse.error.message });
			}
			return { success: true };
		}

		return fail(400, { error: 'Sign-up failed' });
	},
	scrobble: async (event) => {
		const { request, locals } = event;
		const data = await request.json();
		const song = data.get('song')?.toString();
		const artist = data.get('artist')?.toString();
		const album = data.get('album')?.toString();

		if (song !== undefined && artist !== undefined && album !== undefined) {
			const { error } = await locals.supabase.from('scrobbles').insert({
				album,
				artist,
				song
			});
			if (error) {
				return fail(400, { error: error.message });
			}
			return { success: true, message: `Successfully added '${song}' (${album} by ${artist})` };
		}
		return fail(400, { error: 'Invalid request' });
	}
};
