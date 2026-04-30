/* ═══════════════════════════════════════
   67SHOP — Data Store (LocalStorage)
   ═══════════════════════════════════════ */

const Store = {
  // ── Users ──
  _defaultUsers: [
    { name: 'Owner', password: '6767', role: 'owner' },
    { name: 'Admin1', password: '1234', role: 'admin' }
  ],

  getUsers() {
    const u = localStorage.getItem('shop67_users');
    if (!u) { this.saveUsers(this._defaultUsers); return this._defaultUsers; }
    return JSON.parse(u);
  },
  saveUsers(users) { localStorage.setItem('shop67_users', JSON.stringify(users)); },
  addUser(name, password, role = 'admin') {
    const users = this.getUsers();
    users.push({ name, password, role });
    this.saveUsers(users);
  },
  removeUser(name) {
    let users = this.getUsers();
    users = users.filter(u => u.name !== name || u.role === 'owner');
    this.saveUsers(users);
  },
  login(name, password) {
    const users = this.getUsers();
    return users.find(u => u.name === name && u.password === password) || null;
  },
  updateUser(name, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.name === name);
    if (idx > -1) {
      users[idx] = { ...users[idx], ...data };
      this.saveUsers(users);
      // Update session if it's the current user
      const s = this.getSession();
      if (s && s.name === name) {
        this.setSession(users[idx]);
      }
      return true;
    }
    return false;
  },

  // ── Session ──
  setSession(user) { localStorage.setItem('shop67_session', JSON.stringify(user)); },
  getSession() {
    const s = localStorage.getItem('shop67_session');
    return s ? JSON.parse(s) : null;
  },
  clearSession() { localStorage.removeItem('shop67_session'); },
  requireAuth(allowedRoles) {
    const s = this.getSession();
    if (!s) { window.location.href = '../index.html'; return null; }
    if (allowedRoles && !allowedRoles.includes(s.role)) {
      window.location.href = './dashboard.html';
      return null;
    }
    return s;
  },

  // ── Games ──
  _defaultGames: [
    { id: 'rov', name: 'ROV', icon: '../assets/images/icon_rov.png' },
    { id: 'freefire', name: 'Free Fire', icon: '../assets/images/icon_freefire.png' },
    { id: 'genshin', name: 'Genshin Impact', icon: '../assets/images/icon_genshin.png' },
    { id: 'roblox', name: 'Roblox', icon: '../assets/images/icon_roblox.png' }
  ],

  getGames() {
    const g = localStorage.getItem('shop67_games');
    if (!g) { this.saveGames(this._defaultGames); return this._defaultGames; }
    return JSON.parse(g);
  },
  saveGames(games) { localStorage.setItem('shop67_games', JSON.stringify(games)); },
  addGame(game) { const g = this.getGames(); g.push(game); this.saveGames(g); },
  updateGame(id, data) {
    const g = this.getGames();
    const i = g.findIndex(x => x.id === id);
    if (i > -1) { Object.assign(g[i], data); this.saveGames(g); }
  },
  removeGame(id) { this.saveGames(this.getGames().filter(g => g.id !== id)); },

  // ── Packages ──
  _defaultPackages: [
    {
      id: 'rov-1', gameId: 'rov', name: '90 คูปอง', sellPrice: 34,
      suppliers: [
        { name: 'TopupA', cost: 25, link: 'https://example.com/topupA' },
        { name: 'TopupB', cost: 27, link: 'https://example.com/topupB' },
        { name: 'TopupC', cost: 29, link: 'https://example.com/topupC' }
      ]
    },
    {
      id: 'ff-1', gameId: 'freefire', name: '100 เพชร', sellPrice: 33,
      suppliers: [
        { name: 'DiamondShop', cost: 22, link: 'https://example.com/ds' },
        { name: 'FFStore', cost: 24, link: 'https://example.com/ffs' }
      ]
    }
  ],

  getPackages() {
    const p = localStorage.getItem('shop67_packages');
    if (!p) { this.savePackages(this._defaultPackages); return this._defaultPackages; }
    let pkgs = JSON.parse(p);
    
    // Migration: Convert old sup1, sup2, sup3 to suppliers array
    let migrated = false;
    pkgs = pkgs.map(pkg => {
      if (!pkg.suppliers) {
        pkg.suppliers = [];
        if (pkg.sup1Name) pkg.suppliers.push({ name: pkg.sup1Name, cost: pkg.sup1Cost || 0, link: pkg.sup1Link || '' });
        if (pkg.sup2Name) pkg.suppliers.push({ name: pkg.sup2Name, cost: pkg.sup2Cost || 0, link: pkg.sup2Link || '' });
        if (pkg.sup3Name) pkg.suppliers.push({ name: pkg.sup3Name, cost: pkg.sup3Cost || 0, link: pkg.sup3Link || '' });
        
        // Remove old keys
        delete pkg.sup1Name; delete pkg.sup1Cost; delete pkg.sup1Link;
        delete pkg.sup2Name; delete pkg.sup2Cost; delete pkg.sup2Link;
        delete pkg.sup3Name; delete pkg.sup3Cost; delete pkg.sup3Link;
        migrated = true;
      }
      return pkg;
    });
    
    if (migrated) this.savePackages(pkgs);
    return pkgs;
  },
  savePackages(pkgs) { localStorage.setItem('shop67_packages', JSON.stringify(pkgs)); },
  getPackagesByGame(gameId) { return this.getPackages().filter(p => p.gameId === gameId); },
  addPackage(pkg) {
    const p = this.getPackages();
    pkg.id = pkg.gameId + '-' + Date.now();
    p.push(pkg);
    this.savePackages(p);
  },
  updatePackage(id, data) {
    const p = this.getPackages();
    const i = p.findIndex(x => x.id === id);
    if (i > -1) { Object.assign(p[i], data); this.savePackages(p); }
  },
  removePackage(id) { this.savePackages(this.getPackages().filter(p => p.id !== id)); },

  // ── Cheapest supplier for a package ──
  getCheapestSupplier(pkg) {
    if (!pkg.suppliers || pkg.suppliers.length === 0) return null;
    const sups = [...pkg.suppliers]
      .filter(s => s.name && s.cost > 0)
      .sort((a, b) => a.cost - b.cost);
    return sups[0] || null;
  },

  // ── Orders ──
  getOrders() { return JSON.parse(localStorage.getItem('shop67_orders') || '[]'); },
  saveOrders(orders) { localStorage.setItem('shop67_orders', JSON.stringify(orders)); },
  addOrder(o) {
    const orders = this.getOrders();
    o.id = 'ORD-' + String(Date.now()).slice(-6);
    o.status = 'pending';
    o.createdAt = new Date().toISOString();
    orders.unshift(o);
    this.saveOrders(orders);
    return o;
  },
  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const i = orders.findIndex(o => o.id === id);
    if (i > -1) {
      const session = this.getSession();
      const userName = session ? session.name : 'System';
      
      orders[i].status = status;
      if (status === 'processing' && !orders[i].acceptedBy) {
        orders[i].acceptedBy = userName;
      }
      if (status === 'completed') {
        orders[i].completedBy = userName;
        orders[i].completedAt = new Date().toISOString();
      }
      this.saveOrders(orders);
    }
  },
  removeOrder(id) { this.saveOrders(this.getOrders().filter(o => o.id !== id)); },

  // ── Stats ──
  getStats() {
    const orders = this.getOrders();
    const completed = orders.filter(o => o.status === 'completed');
    const totalRevenue = completed.reduce((s, o) => s + (o.sellPrice || 0), 0);
    const totalCost = completed.reduce((s, o) => s + (o.cost || 0), 0);
    return {
      totalOrders: orders.length,
      completedOrders: completed.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      totalRevenue,
      totalCost,
      totalProfit: totalRevenue - totalCost
    };
  },
  getStaffStats() {
    const orders = this.getOrders();
    const stats = {};
    orders.forEach(o => {
      const users = [o.createdBy, o.acceptedBy, o.completedBy].filter(Boolean);
      [...new Set(users)].forEach(u => {
        if (!stats[u]) stats[u] = { created:0, accepted:0, completed:0 };
      });
      if (o.createdBy) stats[o.createdBy].created++;
      if (o.acceptedBy) stats[o.acceptedBy].accepted++;
      if (o.completedBy) stats[o.completedBy].completed++;
    });
    return stats;
  }
};
