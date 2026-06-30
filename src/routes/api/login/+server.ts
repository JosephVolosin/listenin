import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const { 'e-mail': email, password } = await request.json();

    if (
        email !== undefined && password !== undefined
    ) {
        const loginResponse = await locals.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (loginResponse.error) {
            return error(400, loginResponse.error.message);
        }
        return json({
            success: true,
            message: `Welcome ${loginResponse.data.user.user_metadata['username']}!`
        });
    }
    return error(400, "Missing data")
}