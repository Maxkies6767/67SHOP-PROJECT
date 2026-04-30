/* ═══════════════════════════════════════
   67SHOP — Auth Guard
   ═══════════════════════════════════════ */

// Utility used by login page only — all other pages use Store.requireAuth()
const Auth = {
  attempt(name, password) {
    const user = Store.login(name, password);
    if (user) {
      Store.setSession({ name: user.name, role: user.role });
      return true;
    }
    return false;
  },
  attemptByPassword(password) {
    const users = Store.getUsers();
    const user = users.find(u => u.password === password);
    if (user) {
      Store.setSession({ name: user.name, role: user.role });
      return user;
    }
    return null;
  }
};
