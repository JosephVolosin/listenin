import { fail, redirect, type Actions } from '@sveltejs/kit';
import { supabase } from '../util/supabase';
import type { PageServerLoad } from './$types';
import type { FriendMapEntry, Scrobble } from '../types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const { data, error } = await supabase.auth.getClaims();
  const userResponse = await supabase.auth.getUser();

  // Retrieve user's friends
  // TODO: Should this be here or in the UI?
  let userFriends: string[] = [];
  let userScrobbles: Scrobble[] = [];
  if (userResponse.data.user) {
    const currentUserName = userResponse.data.user.user_metadata["username"];
    // Gather friends data
    const friendsResponse = await supabase
      .from("friends")
      .select("*")
      .or(`friendA.eq.${currentUserName},friendB.eq.${currentUserName}`);
    if (friendsResponse.data) {
      // Generate a friends list from the returned data and push it into the original list
      // TODO: Do we really need to declare the initial list?
      const friendsList = friendsResponse.data.reduce(
        (friendsList: string[], currentFriendship: FriendMapEntry) => {
          if (currentFriendship.friendA !== currentUserName) {
            friendsList.push(currentFriendship.friendA);
          } else {
            friendsList.push(currentFriendship.friendB);
          }
          return friendsList
        }, []
      );
      userFriends = friendsList;
    }
    // Gather personal history
    const scrobblesResponse = await supabase
      .from("scrobbles")
      .select("album, artist, name:song, timestamp")
      .eq("user", currentUserName);
    if (scrobblesResponse.data) {
      userScrobbles = scrobblesResponse.data;
    } else {
      console.error(`Unable to retrieve user's history, ${scrobblesResponse.error.message}`);
    }
  }
  return {
    url: url.origin,
    user: userResponse.data.user,
    scrobbles: userScrobbles,
    friends: userFriends
  }
}

export const actions: Actions = {
  addFriend: async ({ request, locals }) => {
    const formData = await request.formData();
    const currentUser = formData.get("user")?.toString();
    const friendName = formData.get("friend")?.toString();

    if (currentUser !== null && friendName !== null) {
      const { error } = await locals.supabase
        .from("friends")
        .insert({
          friendA: currentUser,
          friendB: friendName
      });
      if (error) {
        return fail(400, { error: error.message })
      }
      return { success: true, message: `Successfully added '${friendName}'!` }
    }
    return fail(400, { error: 'Invalid friend name, or no user is logged in.'})
  },
  login: async ({ request, locals }) => {
    const data = await request.formData();
    
    const email = data.get('e-mail')?.toString();
    const password = data.get('password')?.toString();
    
    if (
      email !== undefined &&
      password !== undefined
    ) {
      const loginResponse = await locals.supabase.auth.signInWithPassword({
        email,
        password
      });
      if (loginResponse.error) {
        return fail(400, { error: {
          name: loginResponse.error.name,
          message: loginResponse.error.message,
          code: loginResponse.error.code,
          status: loginResponse.error.status,
        }})
      }
      return { success: true, message: `Welcome ${loginResponse.data.user.user_metadata["username"]}!` };
    }

    return fail(400, { error: 'Login failed' });
  },
  logout: async ({ locals }) => {
    const result = await locals.supabase.auth.signOut();
    if (result.error) {
      return fail(400, { error: { 
        name: result.error.name,
        message: result.error.message,
        code: result.error.code,
        status: result.error.status
      }});
    }
    return { success: true, message: "Logged out successfully." };
  },
  register: async ({ request }) => {
    const data = await request.formData();

    const email = data.get('e-mail')?.toString();
    const password = data.get('password')?.toString();
    const username = data.get('username')?.toString();

    if (
      email !== undefined &&
      password !== undefined &&
      username !== undefined
    ) {
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
        return fail(signUpResponse.error.status ?? 400, { error: signUpResponse.error.message })
      }
      return { success: true };
    }

    return fail(400, { error: 'Sign-up failed' });
  },
  scrobble: async (event) => {
    console.log(event);
    const { request, locals } = event;
    const data = await request.formData();
    const song = data.get('song')?.toString();
    const artist = data.get('artist')?.toString();
    const album = data.get('album')?.toString();
    const username = data.get('username')?.toString();

    if (
      song !== undefined &&
      artist !== undefined &&
      album !== undefined
    ) {
      const { error } = await locals.supabase
        .from('scrobbles')
        .insert({
          user: username,
          album,
          artist,
          song
        });
      if (error) {
        return fail(400, { error: error.message });
      }
      return { success: true, message: `Successfully added '${song}' (${album} by ${artist})`};
    }
    return fail(400, { error: 'Invalid request' });
  }
};
