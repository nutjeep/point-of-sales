export function requireAuth(to, from, next) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    next('/');
  } else {
    next();
  }
}