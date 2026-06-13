import { error, json } from "@sveltejs/kit"

export async function GET({ params, locals }) {
    const userResponse = await locals.supabase
      .from("profiles")
      .select(`
        username,
        scrobbles (
          album,
          artist,
          name:song,
          timestamp
        )
      `)
      .eq("username", params.username)
    if (userResponse.error !== null) {
      error(400, userResponse.error);
    }
    return json(userResponse.data);
}