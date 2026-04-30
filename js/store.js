/* ═══════════════════════════════════════
   67SHOP — Data Store (Supabase Realtime)
   ═══════════════════════════════════════ */

const SUPABASE_URL = 'https://jukqkngkinefavbrymrs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a3FrbmdraW5lZmF2YnJ5bXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MzU3NDksImV4cCI6MjA5MzExMTc0OX0.1qvRUkWNKleNAyDJAAECjEn9-cTok_ECAkdae3w7zE4';

// Initialize Supabase Client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const Store = {
  // ── Sync Cache ──
  _cache: {
    users: [],
    games: [],
    packages: [],
    orders: []
  },
  _listeners: [],
  _isSubscribed: false,

  async init() {
    if (!supabase) return console.error('Supabase not loaded');
    
    // Load all data into cache once
    const [u, g, p, o] = await Promise.all([
      supabase.from('admins').select('*'),
      supabase.from('games').select('*').order('created_at', { ascending: true }),
      supabase.from('packages').select('*').order('created_at', { ascending: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);

    this._cache.users = u.data || [];
    this._cache.games = g.data || [];
    this._cache.packages = (p.data || []).map(pkg => ({
      id: pkg.id,
      gameId: pkg.game_id,
      name: pkg.name,
      sellPrice: pkg.sell_price,
      suppliers: pkg.suppliers
    }));
    this._cache.orders = (o.data || []).map(ord => ({
      id: ord.id,
      gameId: ord.game_id,
      pkgId: ord.pkg_id,
      customerId: ord.customer_id,
      sellPrice: ord.sell_price,
      cost: ord.cost,
      status: ord.status,
      createdBy: ord.created_by,
      acceptedBy: ord.accepted_by,
      completedBy: ord.completed_by,
      createdAt: ord.created_at,
      completedAt: ord.completed_at
    }));

    console.log('📦 Store Initialized (Supabase)');
    this.initRealtime();
  },

  async initRealtime() {
    if (this._isSubscribed || !supabase) return;
    this._isSubscribed = true;

    supabase
      .channel('public-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
        console.log('🔄 Realtime Change Detected:', payload);
        await this.init();
        this._notifyListeners();
      })
      .subscribe();
  },

  subscribe(callback) {
    if (typeof callback === 'function') {
      this._listeners.push(callback);
    }
  },

  _notifyListeners() {
    this._listeners.forEach(cb => cb());
  },

  // ── Users ──
  getUsers() { 
    return this._cache.users.map(u => ({ 
      name: u.username, 
      password: u.password, 
      role: u.role,
      displayName: u.display_name,
      avatarUrl: u.avatar_url
    })); 
  },
  async addUser(name, password, role = 'admin') {
    const { data } = await supabase.from('admins').insert([{ username: name, password, role }]).select();
    if (data) await this.init();
  },
  async removeUser(name) {
    const { error } = await supabase.from('admins').delete().eq('username', name).neq('role', 'owner');
    if (!error) await this.init();
  },
  login(name, password) {
    const users = this.getUsers();
    return users.find(u => u.name === name && u.password === password) || null;
  },
  async updateUser(name, data) {
    const updateData = {};
    if (data.name) updateData.username = data.name;
    if (data.password) updateData.password = data.password;
    if (data.role) updateData.role = data.role;
    if (data.displayName !== undefined) updateData.display_name = data.displayName;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const { error } = await supabase.from('admins').update(updateData).eq('username', name);
    if (!error) {
      await this.init();
      // Update session if it's the current user
      const s = this.getSession();
      if (s && s.name === name) {
        const updatedUser = this.getUsers().find(u => u.name === (data.name || name));
        this.setSession(updatedUser);
      }
      return true;
    }
    return false;
  },

  // ── Session (Still LocalStorage for persistence) ──
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
  getGames() { return this._cache.games; },
  async addGame(game) {
    const { error } = await supabase.from('games').insert([game]);
    if (!error) await this.init();
  },
  async updateGame(id, data) {
    const { error } = await supabase.from('games').update(data).eq('id', id);
    if (!error) await this.init();
  },
  async removeGame(id) {
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (!error) await this.init();
  },

  // ── Packages ──
  getPackages() { return this._cache.packages; },
  getPackagesByGame(gameId) { return this.getPackages().filter(p => p.gameId === gameId); },
  async addPackage(pkg) {
    const dbPkg = {
      id: pkg.gameId + '-' + Date.now(),
      game_id: pkg.gameId,
      name: pkg.name,
      sell_price: pkg.sellPrice,
      suppliers: pkg.suppliers
    };
    const { error } = await supabase.from('packages').insert([dbPkg]);
    if (!error) await this.init();
  },
  async updatePackage(id, data) {
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.sellPrice) updateData.sell_price = data.sellPrice;
    if (data.suppliers) updateData.suppliers = data.suppliers;

    const { error } = await supabase.from('packages').update(updateData).eq('id', id);
    if (!error) await this.init();
  },
  async removePackage(id) {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (!error) await this.init();
  },

  // ── Cheapest supplier ──
  getCheapestSupplier(pkg) {
    if (!pkg.suppliers || pkg.suppliers.length === 0) return null;
    const sups = [...pkg.suppliers]
      .filter(s => s.name && s.cost > 0)
      .sort((a, b) => a.cost - b.cost);
    return sups[0] || null;
  },

  // ── Orders ──
  getOrders() { return this._cache.orders; },
  async addOrder(o) {
    const dbOrder = {
      id: 'ORD-' + String(Date.now()).slice(-6),
      game_id: o.gameId,
      pkg_id: o.pkgId,
      customer_id: o.customerId,
      sell_price: o.sellPrice,
      cost: o.cost,
      status: 'pending',
      created_by: o.createdBy,
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from('orders').insert([dbOrder]);
    if (!error) {
      await this.init();
      return dbOrder;
    }
    return null;
  },
  async updateOrderStatus(id, status) {
    const session = this.getSession();
    const userName = session ? session.name : 'System';
    
    const updateData = { status };
    if (status === 'processing') updateData.accepted_by = userName;
    if (status === 'completed') {
      updateData.completed_by = userName;
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase.from('orders').update(updateData).eq('id', id);
    if (!error) await this.init();
  },
  async updateOrder(id, data) {
    const { error } = await supabase.from('orders').update(data).eq('id', id);
    if (!error) await this.init();
  },
  async removeOrder(id) {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) await this.init();
  },
  async clearCompletedOrders() {
    const { error } = await supabase.from('orders').delete().eq('status', 'completed');
    if (!error) await this.init();
  },

  // ── Stats (Computed from cache) ──
  getStats() {
    const orders = this.getOrders();
    const completed = orders.filter(o => o.status === 'completed');
    const totalRevenue = completed.reduce((s, o) => s + (Number(o.sellPrice) || 0), 0);
    const totalCost = completed.reduce((s, o) => s + (Number(o.cost) || 0), 0);
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
