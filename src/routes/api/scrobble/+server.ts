import { error, json } from '@sveltejs/kit';

export async function POST({ request, cookies, locals }) {
    const { song, artist, album } = await request.json();
    const authToken = cookies.getAll().find(cookie => cookie.name.includes("auth-token"));

    if (
        song !== undefined &&
        artist !== undefined &&
        album !== undefined &&
        authToken !== undefined
    ) {
        const { error: supabaseError } = await locals.supabase.from('scrobbles').insert({
            album,
            artist,
            song
        });
        if (supabaseError) {
            error(400, supabaseError.message);
        }
        return json({ success: true, message: `Successfully added '${song}' (${album} by ${artist})` });
    }
    return error(400, "Missing data")
}