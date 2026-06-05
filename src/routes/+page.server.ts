import { fail, redirect, type Actions } from '@sveltejs/kit';
import { supabase } from '../util/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const { data, error } = await supabase.auth.getClaims();
  const userResponse = await supabase.auth.getUser();
  return {
    url: url.origin,
    user: userResponse.data.user
  }
}

export const actions: Actions = {
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
  }
};
