// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies }) => {
  console.log('+layout.server.ts:load');
  return {
    cookies: cookies.getAll(),
  }
}