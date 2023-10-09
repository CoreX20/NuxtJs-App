import { supabase } from '../utils/supabase'
export default async function ({ route, redirect }) {
  const publicRoutes = ['/login', '/signup'];

  // If the route is public, allow access
  if (publicRoutes.includes(route.path)) {
    return;
  }

  const { data } = await supabase.auth.getSession();
  // If the user is not authenticated
  if (data.session == null) {
    return redirect('/login')
  }
}