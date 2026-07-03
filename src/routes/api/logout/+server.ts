import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const logoutResponse = await locals.supabase.auth.signOut();
    if (logoutResponse.error) {
        return error(400, logoutResponse.error.message);
    }
    return json({
        success: true,
        message: "Logged out."
    });
}