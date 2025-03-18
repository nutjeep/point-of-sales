export function requireSuperadmin(to, from, next) {
  const role = parseInt(localStorage.getItem('user_permission'), 10);
  if (role !== 1) {  // 1 = role_id for Superadmin
    next('/dashboard');
  } else {
    next();
  }
}