/**
 * ShopHub Web Demo - Main Application
 */

class App {
  constructor() {
    this.currentPage = 'dashboard';
    this.sidebarOpen = false;
    this.init();
  }

  init() {
    // Check session
    const session = api.getSession();
    if (session) {
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  showLogin() {
    document.body.innerHTML = '';
    document.body.className = '';

    const loginPage = document.createElement('div');
    loginPage.className = 'login-page';
    loginPage.innerHTML = `
      <div class="login-card">
        <div class="logo">
          <div class="logo-icon">S</div>
          <h2>ShopHub</h2>
          <p class="subtitle">Web Demo</p>
        </div>

        <div class="role-tabs">
          <button class="role-tab active" data-role="owner">Owner</button>
          <button class="role-tab" data-role="admin">Admin</button>
        </div>

        <form id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="loginEmail" placeholder="Enter email" required 
              value="owner1@store.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="loginPassword" placeholder="Enter password" required
              value="demo1234">
          </div>
          <button type="submit" class="btn btn-primary w-full" style="margin-top: 0.5rem;">
            Sign In
          </button>
        </form>

        <div class="text-center mt-2">
          <p class="text-xs text-muted">Demo credentials pre-filled. Click Sign In.</p>
        </div>
      </div>
    `;

    document.body.appendChild(loginPage);

    // Role tabs
    let selectedRole = (typeof window.dcwPreferredRole === 'string') ? window.dcwPreferredRole : 'owner';
    if (selectedRole !== 'owner') {
      loginPage.querySelectorAll('.role-tab').forEach(t => t.classList.toggle('active', t.dataset.role === selectedRole));
      document.getElementById('loginEmail').value = selectedRole === 'admin' ? 'admin1@yourbrand.com' : 'owner1@store.com';
    }
    loginPage.querySelectorAll('.role-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        loginPage.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedRole = tab.dataset.role;

        // Update demo email
        const emailInput = document.getElementById('loginEmail');
        if (selectedRole === 'owner') {
          emailInput.value = 'owner1@store.com';
        } else {
          emailInput.value = 'admin1@yourbrand.com';
        }
      });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      let result;
      if (selectedRole === 'admin') {
        result = api.loginAdmin(email, password);
      } else {
        result = api.loginOwner(email, password);
      }

      if (result.success) {
        Toast.show('Welcome back, ' + result.data.first_name + '!', 'success');
        this.showDashboard();
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  showDashboard() {
    const user = api.currentUser;
    if (!user) {
      this.showLogin();
      return;
    }

    document.body.innerHTML = '';
    document.body.className = '';

    // Build layout
    const container = document.createElement('div');
    container.className = 'app-container';
    container.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="logo">S</div>
          <h1>ShopHub</h1>
        </div>
        <nav class="sidebar-nav" id="sidebarNav"></nav>
        <div class="sidebar-footer">
          <p>v1.0 Demo</p>
        </div>
      </aside>
      <main class="main-content">
        <header class="top-bar">
          <div class="top-bar-left">
            <button class="btn btn-ghost btn-icon menu-toggle" id="menuToggle" style="display:none;">☰</button>
            <h1 class="page-title" id="pageTitle">Dashboard</h1>
          </div>
          <div class="top-bar-right">
            <div class="user-badge">
              <img src="${user.image || 'https://i.pravatar.cc/150?u=' + user.id}" alt="" onerror="this.src='https://i.pravatar.cc/150?u=default'">
              <span>${user.first_name} ${user.last_name}</span>
              <span class="badge badge-info">${user.role}</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="app.logout()">Logout</button>
          </div>
        </header>
        <div class="content-area" id="contentArea"></div>
      </main>
    `;

    document.body.appendChild(container);

    // Build navigation based on role
    this.buildNavigation(user.role);

    // Show default page
    this.navigateTo('dashboard');

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
      });
    }
  }

  buildNavigation(role) {
    const nav = document.getElementById('sidebarNav');

    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'stores', label: 'Stores', icon: '🏪' },
      { id: 'categories', label: 'Categories', icon: '📁' },
      { id: 'products', label: 'Products', icon: '📦' },
      { id: 'sales', label: 'Sales', icon: '💰' }
    ];

    const adminItems = [
      { id: 'admins', label: 'Admins', icon: '👤' },
      { id: 'owners', label: 'Owners', icon: '👔' }
    ];

    const ownerItems = [
      { id: 'profile', label: 'My Profile', icon: '⚙️' }
    ];

    let items = [...commonItems];
    if (role === 'admin') items = [...items, ...adminItems];
    if (role === 'owner') items = [...items, ...ownerItems];

    nav.innerHTML = `
      <div class="nav-section">
        <div class="nav-section-title">Menu</div>
        ${items.map(item => `
          <button class="nav-item" data-page="${item.id}" onclick="app.navigateTo('${item.id}')">
            <span class="icon">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  navigateTo(page) {
    this.currentPage = page;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      stores: 'Stores',
      categories: 'Categories',
      products: 'Products',
      sales: 'Sales',
      admins: 'Admins',
      owners: 'Owners',
      profile: 'My Profile'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    // Render content
    const content = document.getElementById('contentArea');
    content.innerHTML = '<div style="display:flex;justify-content:center;padding:3rem;"><div class="spinner"></div></div>';

    setTimeout(() => {
      switch(page) {
        case 'dashboard': this.renderDashboard(content); break;
        case 'stores': this.renderStores(content); break;
        case 'categories': this.renderCategories(content); break;
        case 'products': this.renderProducts(content); break;
        case 'sales': this.renderSales(content); break;
        case 'admins': this.renderAdmins(content); break;
        case 'owners': this.renderOwners(content); break;
        case 'profile': this.renderProfile(content); break;
        default: content.innerHTML = '<div class="empty-state"><h3>Page not found</h3></div>';
      }
    }, 300);
  }

  // ============ DASHBOARD ============
  renderDashboard(container) {
    const stats = api.getDashboardStats().data;
    const isAdmin = api.currentUser.role === 'admin';

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🏪</div>
          <div class="stat-info">
            <h3>${stats.totalStores}</h3>
            <p>Total Stores</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">📦</div>
          <div class="stat-info">
            <h3>${stats.totalProducts}</h3>
            <p>Products</p>
            <div class="stat-change ${stats.lowStock > 0 ? 'negative' : 'positive'}">
              ${stats.lowStock > 0 ? stats.lowStock + ' low stock' : 'All good'}
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">📁</div>
          <div class="stat-info">
            <h3>${stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">💰</div>
          <div class="stat-info">
            <h3>${formatCurrency(stats.totalSales)}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        ${isAdmin ? `
        <div class="stat-card">
          <div class="stat-icon cyan">👔</div>
          <div class="stat-info">
            <h3>${stats.totalOwners}</h3>
            <p>Active Owners</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">👤</div>
          <div class="stat-info">
            <h3>${stats.totalAdmins}</h3>
            <p>Admins</p>
          </div>
        </div>
        ` : ''}
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Recent Sales</h2>
          <button class="btn btn-sm btn-primary" onclick="app.navigateTo('sales')">View All</button>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Store</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${stats.recentSales.map(sale => `
                  <tr>
                    <td><code>${sale.id.slice(0, 8)}...</code></td>
                    <td>${sale.store?.store_name || 'N/A'}</td>
                    <td>${sale.items.length} items</td>
                    <td class="font-bold text-primary">${formatCurrency(sale.total_amount)}</td>
                    <td>${timeAgo(sale.created_at)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ============ STORES ============
  renderStores(container) {
    const result = api.getAllStores();
    const stores = result.data;
    const isAdmin = api.currentUser.role === 'admin';

    container.innerHTML = `
      <div class="filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="storeSearch" placeholder="Search stores..." 
            oninput="app.filterStores(this.value)">
        </div>
        ${isAdmin ? `<button class="btn btn-primary" onclick="app.openStoreModal()">+ Add Store</button>` : ''}
      </div>

      <div class="grid-3" id="storesGrid">
        ${stores.map(store => this.renderStoreCard(store)).join('')}
      </div>

      ${stores.length === 0 ? `
        <div class="empty-state">
          <div class="icon">🏪</div>
          <h3>No stores found</h3>
          <p>Get started by adding your first store.</p>
        </div>
      ` : ''}
    `;
  }

  renderStoreCard(store) {
    return `
      <div class="item-card">
        <img src="${store.image || getImagePlaceholder(store.store_name)}" 
          class="item-card-image" alt="${store.store_name}" 
          onerror="this.src='${getImagePlaceholder(store.store_name)}'">
        <div class="item-card-body">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">
            <div>
              <div class="item-card-title">${store.store_name}</div>
              <div class="item-card-subtitle">📍 ${store.location}</div>
            </div>
            <span class="badge ${store.status ? 'badge-success' : 'badge-danger'}">
              ${store.status ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div class="item-card-meta">
            <span class="text-sm text-muted">Owner: ${store.owner?.first_name || 'N/A'} ${store.owner?.last_name || ''}</span>
          </div>
        </div>
        <div class="item-card-actions">
          <button class="btn btn-sm btn-secondary" onclick="app.viewStore('${store.id}')">View</button>
          <button class="btn btn-sm btn-ghost" onclick="app.editStore('${store.id}')">Edit</button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteStore('${store.id}')">Delete</button>
        </div>
      </div>
    `;
  }

  filterStores(query) {
    const result = api.getAllStores();
    const filtered = filterData(result.data, query, ['store_name', 'location']);
    document.getElementById('storesGrid').innerHTML = filtered.map(s => this.renderStoreCard(s)).join('');
  }

  openStoreModal(store = null) {
    const isEdit = !!store;
    const modalId = 'storeModal';

    let modalHtml = `
      <div class="modal-overlay ${isEdit ? 'active' : ''}" id="${modalId}">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Store' : 'Add Store'}</h3>
            <button class="modal-close" onclick="Modal.close('${modalId}')">×</button>
          </div>
          <div class="modal-body">
            <form id="storeForm">
              <div class="form-group">
                <label>Store Name</label>
                <input type="text" id="storeName" value="${store?.store_name || ''}" required>
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" id="storeLocation" value="${store?.location || ''}" required>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select id="storeStatus">
                  <option value="true" ${store?.status ? 'selected' : ''}>Active</option>
                  <option value="false" ${!store?.status ? 'selected' : ''}>Inactive</option>
                </select>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="text" id="storeImage" value="${store?.image || ''}" placeholder="https://...">
                <p class="hint">Leave empty for placeholder image</p>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.close('${modalId}')">Cancel</button>
            <button class="btn btn-primary" onclick="app.saveStore('${store?.id || ''}')">
              ${isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (!isEdit) Modal.open(modalId);
  }

  saveStore(id) {
    const data = {
      store_name: document.getElementById('storeName').value,
      location: document.getElementById('storeLocation').value,
      status: document.getElementById('storeStatus').value === 'true',
      image: document.getElementById('storeImage').value || undefined
    };

    let result;
    if (id) {
      result = api.updateStore(id, data);
    } else {
      result = api.createStore(data);
    }

    if (result.success) {
      Toast.show(id ? 'Store updated!' : 'Store created!', 'success');
      Modal.close('storeModal');
      this.navigateTo('stores');
    } else {
      Toast.show(result.message, 'error');
    }
  }

  viewStore(id) {
    const result = api.getStoreById(id);
    if (!result.success) return;
    const store = result.data;

    const cats = api.getCategoriesByStore(id).data;

    const content = document.getElementById('contentArea');
    content.innerHTML = `
      <div class="mb-2">
        <button class="btn btn-ghost btn-sm" onclick="app.navigateTo('stores')">← Back to Stores</button>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-body">
            <img src="${store.image || getImagePlaceholder(store.store_name)}" 
              style="width:100%;height:200px;object-fit:cover;border-radius:var(--radius);margin-bottom:1rem;"
              onerror="this.src='${getImagePlaceholder(store.store_name)}'">
            <h2 style="font-size:1.5rem;margin-bottom:0.5rem;">${store.store_name}</h2>
            <p class="text-muted mb-1">📍 ${store.location}</p>
            <p class="text-muted mb-2">👤 Owner: ${store.owner?.first_name} ${store.owner?.last_name}</p>
            <span class="badge ${store.status ? 'badge-success' : 'badge-danger'}">
              ${store.status ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2>Categories (${cats.length})</h2></div>
          <div class="card-body">
            ${cats.length > 0 ? `
              <div class="grid-2">
                ${cats.map(cat => `
                  <div class="item-card" style="cursor:pointer;" onclick="app.navigateTo('categories')">
                    <img src="${cat.image || getImagePlaceholder(cat.category_name)}" 
                      style="width:100%;height:100px;object-fit:cover;"
                      onerror="this.src='${getImagePlaceholder(cat.category_name)}'">
                    <div class="item-card-body">
                      <div class="item-card-title">${cat.category_name}</div>
                      <span class="badge ${cat.status ? 'badge-success' : 'badge-danger'}">
                        ${cat.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="text-muted text-center">No categories yet</p>'}
          </div>
        </div>
      </div>
    `;
  }

  editStore(id) {
    const result = api.getStoreById(id);
    if (result.success) {
      this.openStoreModal(result.data);
      Modal.open('storeModal');
    }
  }

  deleteStore(id) {
    confirmAction('Are you sure you want to delete this store?', () => {
      const result = api.deleteStore(id);
      if (result.success) {
        Toast.show('Store deleted', 'success');
        this.navigateTo('stores');
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  // ============ CATEGORIES ============
  renderCategories(container) {
    const result = api.getAllCategories();
    const categories = result.data;

    container.innerHTML = `
      <div class="filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search categories..." 
            oninput="app.filterCategories(this.value)">
        </div>
        <button class="btn btn-primary" onclick="app.openCategoryModal()">+ Add Category</button>
      </div>

      <div class="grid-4" id="categoriesGrid">
        ${categories.map(cat => this.renderCategoryCard(cat)).join('')}
      </div>

      ${categories.length === 0 ? `
        <div class="empty-state">
          <div class="icon">📁</div>
          <h3>No categories found</h3>
        </div>
      ` : ''}
    `;
  }

  renderCategoryCard(cat) {
    return `
      <div class="item-card">
        <img src="${cat.image || getImagePlaceholder(cat.category_name)}" 
          style="width:100%;height:120px;object-fit:cover;"
          onerror="this.src='${getImagePlaceholder(cat.category_name)}'">
        <div class="item-card-body">
          <div class="item-card-title">${cat.category_name}</div>
          <div class="item-card-subtitle">🏪 ${cat.store?.store_name || 'N/A'}</div>
          <span class="badge ${cat.status ? 'badge-success' : 'badge-danger'}">
            ${cat.status ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div class="item-card-actions">
          <button class="btn btn-sm btn-ghost" onclick="app.editCategory('${cat.id}')">Edit</button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteCategory('${cat.id}')">Delete</button>
        </div>
      </div>
    `;
  }

  filterCategories(query) {
    const result = api.getAllCategories();
    const filtered = filterData(result.data, query, ['category_name', 'store_name']);
    document.getElementById('categoriesGrid').innerHTML = filtered.map(c => this.renderCategoryCard(c)).join('');
  }

  openCategoryModal(category = null) {
    const isEdit = !!category;
    const stores = api.getAllStores().data;

    const modalHtml = `
      <div class="modal-overlay ${isEdit ? 'active' : ''}" id="categoryModal">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Category' : 'Add Category'}</h3>
            <button class="modal-close" onclick="Modal.close('categoryModal')">×</button>
          </div>
          <div class="modal-body">
            <form id="categoryForm">
              <div class="form-group">
                <label>Store</label>
                <select id="catStoreId" required>
                  ${stores.map(s => `<option value="${s.id}" ${category?.store_id === s.id ? 'selected' : ''}>${s.store_name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Category Name</label>
                <input type="text" id="catName" value="${category?.category_name || ''}" required>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select id="catStatus">
                  <option value="true" ${category?.status ? 'selected' : ''}>Active</option>
                  <option value="false" ${!category?.status ? 'selected' : ''}>Inactive</option>
                </select>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="text" id="catImage" value="${category?.image || ''}" placeholder="https://...">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.close('categoryModal')">Cancel</button>
            <button class="btn btn-primary" onclick="app.saveCategory('${category?.id || ''}')">
              ${isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('categoryModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (!isEdit) Modal.open('categoryModal');
  }

  saveCategory(id) {
    const data = {
      store_id: document.getElementById('catStoreId').value,
      category_name: document.getElementById('catName').value,
      status: document.getElementById('catStatus').value === 'true',
      image: document.getElementById('catImage').value || undefined
    };

    let result;
    if (id) {
      result = api.updateCategory(id, data);
    } else {
      result = api.createCategory(data);
    }

    if (result.success) {
      Toast.show(id ? 'Category updated!' : 'Category created!', 'success');
      Modal.close('categoryModal');
      this.navigateTo('categories');
    } else {
      Toast.show(result.message, 'error');
    }
  }

  editCategory(id) {
    const result = api.getCategoryById(id);
    if (result.success) {
      this.openCategoryModal(result.data);
      Modal.open('categoryModal');
    }
  }

  deleteCategory(id) {
    confirmAction('Delete this category? All products in this category will also be removed.', () => {
      const result = api.deleteCategory(id);
      if (result.success) {
        Toast.show('Category deleted', 'success');
        this.navigateTo('categories');
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  // ============ PRODUCTS ============
  renderProducts(container) {
    const result = api.getAllProducts();
    const products = result.data;

    container.innerHTML = `
      <div class="filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search products..." 
            oninput="app.filterProducts(this.value)">
        </div>
        <button class="btn btn-primary" onclick="app.openProductModal()">+ Add Product</button>
      </div>

      <div class="grid-4" id="productsGrid">
        ${products.map(p => this.renderProductCard(p)).join('')}
      </div>

      ${products.length === 0 ? `
        <div class="empty-state">
          <div class="icon">📦</div>
          <h3>No products found</h3>
        </div>
      ` : ''}
    `;
  }

  renderProductCard(product) {
    const lowStock = product.stock_level < 30;
    return `
      <div class="item-card">
        <img src="${product.image || getImagePlaceholder(product.product_name)}" 
          style="width:100%;height:140px;object-fit:cover;"
          onerror="this.src='${getImagePlaceholder(product.product_name)}'">
        <div class="item-card-body">
          <div class="item-card-title">${product.product_name}</div>
          <div class="item-card-subtitle">📁 ${product.category?.category_name || 'N/A'}</div>
          <div class="item-card-meta">
            <span class="item-card-price">${formatCurrency(product.price)}</span>
            <span class="item-card-stock ${lowStock ? 'text-danger' : ''}">
              ${lowStock ? '⚠️' : ''} Stock: ${product.stock_level}
            </span>
          </div>
          <span class="badge ${product.status ? 'badge-success' : 'badge-danger'}" style="margin-top:0.5rem;">
            ${product.status ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div class="item-card-actions">
          <button class="btn btn-sm btn-ghost" onclick="app.editProduct('${product.id}')">Edit</button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteProduct('${product.id}')">Delete</button>
        </div>
      </div>
    `;
  }

  filterProducts(query) {
    const result = api.getAllProducts();
    const filtered = filterData(result.data, query, ['product_name', 'category_name', 'store_name']);
    document.getElementById('productsGrid').innerHTML = filtered.map(p => this.renderProductCard(p)).join('');
  }

  openProductModal(product = null) {
    const isEdit = !!product;
    const categories = api.getAllCategories().data;

    const modalHtml = `
      <div class="modal-overlay ${isEdit ? 'active' : ''}" id="productModal">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Product' : 'Add Product'}</h3>
            <button class="modal-close" onclick="Modal.close('productModal')">×</button>
          </div>
          <div class="modal-body">
            <form id="productForm">
              <div class="form-group">
                <label>Category</label>
                <select id="prodCategoryId" required>
                  ${categories.map(c => `<option value="${c.id}" ${product?.category_id === c.id ? 'selected' : ''}>${c.category_name} (${c.store?.store_name || 'N/A'})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Product Name</label>
                <input type="text" id="prodName" value="${product?.product_name || ''}" required>
              </div>
              <div class="grid-2">
                <div class="form-group">
                  <label>Price (₱)</label>
                  <input type="number" id="prodPrice" value="${product?.price || ''}" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                  <label>Stock Level</label>
                  <input type="number" id="prodStock" value="${product?.stock_level || ''}" min="0" required>
                </div>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select id="prodStatus">
                  <option value="true" ${product?.status ? 'selected' : ''}>Active</option>
                  <option value="false" ${!product?.status ? 'selected' : ''}>Inactive</option>
                </select>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="text" id="prodImage" value="${product?.image || ''}" placeholder="https://...">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.close('productModal')">Cancel</button>
            <button class="btn btn-primary" onclick="app.saveProduct('${product?.id || ''}')">
              ${isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('productModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (!isEdit) Modal.open('productModal');
  }

  saveProduct(id) {
    const data = {
      category_id: document.getElementById('prodCategoryId').value,
      product_name: document.getElementById('prodName').value,
      price: parseFloat(document.getElementById('prodPrice').value),
      stock_level: parseInt(document.getElementById('prodStock').value),
      status: document.getElementById('prodStatus').value === 'true',
      image: document.getElementById('prodImage').value || undefined
    };

    let result;
    if (id) {
      result = api.updateProduct(id, data);
    } else {
      result = api.createProduct(data);
    }

    if (result.success) {
      Toast.show(id ? 'Product updated!' : 'Product created!', 'success');
      Modal.close('productModal');
      this.navigateTo('products');
    } else {
      Toast.show(result.message, 'error');
    }
  }

  editProduct(id) {
    const result = api.getProductById(id);
    if (result.success) {
      this.openProductModal(result.data);
      Modal.open('productModal');
    }
  }

  deleteProduct(id) {
    confirmAction('Delete this product?', () => {
      const result = api.deleteProduct(id);
      if (result.success) {
        Toast.show('Product deleted', 'success');
        this.navigateTo('products');
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  // ============ SALES ============
  renderSales(container) {
    const result = api.getAllSales();
    const sales = result.data;

    container.innerHTML = `
      <div class="filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search sales..." 
            oninput="app.filterSales(this.value)">
        </div>
        <button class="btn btn-primary" onclick="app.openSaleModal()">+ New Sale</button>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Store</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="salesTable">
                ${sales.map(sale => this.renderSaleRow(sale)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      ${sales.length === 0 ? `
        <div class="empty-state">
          <div class="icon">💰</div>
          <h3>No sales yet</h3>
          <p>Create your first sale to get started.</p>
        </div>
      ` : ''}
    `;
  }

  renderSaleRow(sale) {
    return `
      <tr>
        <td><code>${sale.id.slice(0, 8)}...</code></td>
        <td>${sale.store?.store_name || 'N/A'}</td>
        <td>
          <div style="display:flex;flex-direction:column;gap:0.25rem;">
            ${sale.items.map(item => `
              <span class="text-sm">${item.product?.product_name || 'N/A'} × ${item.quantity}</span>
            `).join('')}
          </div>
        </td>
        <td class="font-bold text-primary">${formatCurrency(sale.total_amount)}</td>
        <td>${timeAgo(sale.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteSale('${sale.id}')">Delete</button>
        </td>
      </tr>
    `;
  }

  filterSales(query) {
    const result = api.getAllSales();
    const filtered = filterData(result.data, query, ['store_name', 'product_name']);
    document.getElementById('salesTable').innerHTML = filtered.map(s => this.renderSaleRow(s)).join('');
  }

  openSaleModal() {
    const products = api.getAllProducts().data.filter(p => p.status && p.stock_level > 0);
    const stores = api.getAllStores().data.filter(s => s.status);

    const modalHtml = `
      <div class="modal-overlay" id="saleModal">
        <div class="modal" style="max-width:600px;">
          <div class="modal-header">
            <h3>New Sale</h3>
            <button class="modal-close" onclick="Modal.close('saleModal')">×</button>
          </div>
          <div class="modal-body">
            <form id="saleForm">
              <div class="form-group">
                <label>Store</label>
                <select id="saleStoreId" required>
                  ${stores.map(s => `<option value="${s.id}">${s.store_name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Products</label>
                <div id="saleItems" style="display:flex;flex-direction:column;gap:0.5rem;">
                  <div class="sale-item-row" style="display:flex;gap:0.5rem;align-items:center;">
                    <select class="sale-product" style="flex:1;" required>
                      <option value="">Select product...</option>
                      ${products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.product_name} - ${formatCurrency(p.price)} (Stock: ${p.stock_level})</option>`).join('')}
                    </select>
                    <input type="number" class="sale-qty" value="1" min="1" style="width:80px;" required>
                    <button type="button" class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">×</button>
                  </div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm mt-1" onclick="app.addSaleItem()">+ Add Item</button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.close('saleModal')">Cancel</button>
            <button class="btn btn-primary" onclick="app.saveSale()">Create Sale</button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('saleModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    Modal.open('saleModal');
  }

  addSaleItem() {
    const products = api.getAllProducts().data.filter(p => p.status && p.stock_level > 0);
    const container = document.getElementById('saleItems');
    const row = document.createElement('div');
    row.className = 'sale-item-row';
    row.style.cssText = 'display:flex;gap:0.5rem;align-items:center;';
    row.innerHTML = `
      <select class="sale-product" style="flex:1;" required>
        <option value="">Select product...</option>
        ${products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.product_name} - ${formatCurrency(p.price)} (Stock: ${p.stock_level})</option>`).join('')}
      </select>
      <input type="number" class="sale-qty" value="1" min="1" style="width:80px;" required>
      <button type="button" class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(row);
  }

  saveSale() {
    const storeId = document.getElementById('saleStoreId').value;
    const rows = document.querySelectorAll('.sale-item-row');
    const sales = [];

    rows.forEach(row => {
      const productId = row.querySelector('.sale-product').value;
      const qty = parseInt(row.querySelector('.sale-qty').value);
      if (productId && qty > 0) {
        sales.push({ product_id: productId, quantity: qty });
      }
    });

    if (sales.length === 0) {
      Toast.show('Please add at least one product', 'warning');
      return;
    }

    const result = api.createSale({ store_id: storeId, sales });
    if (result.success) {
      Toast.show('Sale created successfully!', 'success');
      Modal.close('saleModal');
      this.navigateTo('sales');
    } else {
      Toast.show(result.message, 'error');
    }
  }

  deleteSale(id) {
    confirmAction('Delete this sale?', () => {
      const result = api.deleteSale(id);
      if (result.success) {
        Toast.show('Sale deleted', 'success');
        this.navigateTo('sales');
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  // ============ ADMINS ============
  renderAdmins(container) {
    const result = api.getAllAdmins();
    const admins = result.data;

    container.innerHTML = `
      <div class="filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search admins..." 
            oninput="app.filterAdmins(this.value)">
        </div>
        <button class="btn btn-primary" onclick="app.openAdminModal()">+ Add Admin</button>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="adminsTable">
                ${admins.map(admin => this.renderAdminRow(admin)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminRow(admin) {
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div class="avatar-initials">${getInitials(admin.first_name, admin.last_name)}</div>
            <div>
              <div class="font-medium">${admin.first_name} ${admin.last_name}</div>
            </div>
          </div>
        </td>
        <td>${admin.email}</td>
        <td>
          <span class="badge ${admin.is_verified ? 'badge-success' : 'badge-warning'}">
            ${admin.is_verified ? 'Verified' : 'Pending'}
          </span>
        </td>
        <td>${formatDate(admin.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-ghost" onclick="app.editAdmin('${admin.id}')">Edit</button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteAdmin('${admin.id}')">Delete</button>
        </td>
      </tr>
    `;
  }

  filterAdmins(query) {
    const result = api.getAllAdmins();
    const filtered = filterData(result.data, query, ['first_name', 'last_name', 'email']);
    document.getElementById('adminsTable').innerHTML = filtered.map(a => this.renderAdminRow(a)).join('');
  }

  openAdminModal(admin = null) {
    const isEdit = !!admin;

    const modalHtml = `
      <div class="modal-overlay ${isEdit ? 'active' : ''}" id="adminModal">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Admin' : 'Add Admin'}</h3>
            <button class="modal-close" onclick="Modal.close('adminModal')">×</button>
          </div>
          <div class="modal-body">
            <form id="adminForm">
              <div class="grid-2">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" id="adminFirstName" value="${admin?.first_name || ''}" required>
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" id="adminLastName" value="${admin?.last_name || ''}" required>
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="adminEmail" value="${admin?.email || ''}" required>
              </div>
              ${!isEdit ? `
              <div class="form-group">
                <label>Password</label>
                <input type="password" id="adminPassword" placeholder="Set password" required>
              </div>
              ` : ''}
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.close('adminModal')">Cancel</button>
            <button class="btn btn-primary" onclick="app.saveAdmin('${admin?.id || ''}')">
              ${isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('adminModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (!isEdit) Modal.open('adminModal');
  }

  saveAdmin(id) {
    const data = {
      first_name: document.getElementById('adminFirstName').value,
      last_name: document.getElementById('adminLastName').value,
      email: document.getElementById('adminEmail').value
    };

    let result;
    if (id) {
      result = api.updateAdmin(id, data);
    } else {
      data.password = document.getElementById('adminPassword').value;
      result = api.createAdmin(data);
    }

    if (result.success) {
      Toast.show(id ? 'Admin updated!' : 'Admin created!', 'success');
      Modal.close('adminModal');
      this.navigateTo('admins');
    } else {
      Toast.show(result.message, 'error');
    }
  }

  editAdmin(id) {
    const result = api.getAdminById(id);
    if (result.success) {
      this.openAdminModal(result.data);
      Modal.open('adminModal');
    }
  }

  deleteAdmin(id) {
    confirmAction('Delete this admin?', () => {
      const result = api.deleteAdmin(id);
      if (result.success) {
        Toast.show('Admin deleted', 'success');
        this.navigateTo('admins');
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  // ============ OWNERS ============
  renderOwners(container) {
    const result = api.getAllOwners();
    const owners = result.data;

    container.innerHTML = `
      <div class="filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search owners..." 
            oninput="app.filterOwners(this.value)">
        </div>
        <button class="btn btn-primary" onclick="app.openOwnerModal()">+ Add Owner</button>
      </div>

      <div class="card">
        <div class="card-body" style="padding:0;">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Stores</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="ownersTable">
                ${owners.map(owner => this.renderOwnerRow(owner)).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderOwnerRow(owner) {
    const storeCount = api.getStoresByOwner(owner.id).data.length;
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <img src="${owner.image || 'https://i.pravatar.cc/150?u=' + owner.id}" 
              class="avatar avatar-sm" onerror="this.src='https://i.pravatar.cc/150?u=default'">
            <div>
              <div class="font-medium">${owner.first_name} ${owner.last_name}</div>
            </div>
          </div>
        </td>
        <td>${owner.email}</td>
        <td>
          <span class="badge ${owner.is_active ? 'badge-success' : 'badge-danger'}">
            ${owner.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>${storeCount} store${storeCount !== 1 ? 's' : ''}</td>
        <td>
          <button class="btn btn-sm btn-ghost" onclick="app.editOwner('${owner.id}')">Edit</button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="app.deleteOwner('${owner.id}')">Delete</button>
        </td>
      </tr>
    `;
  }

  filterOwners(query) {
    const result = api.getAllOwners();
    const filtered = filterData(result.data, query, ['first_name', 'last_name', 'email']);
    document.getElementById('ownersTable').innerHTML = filtered.map(o => this.renderOwnerRow(o)).join('');
  }

  openOwnerModal(owner = null) {
    const isEdit = !!owner;

    const modalHtml = `
      <div class="modal-overlay ${isEdit ? 'active' : ''}" id="ownerModal">
        <div class="modal">
          <div class="modal-header">
            <h3>${isEdit ? 'Edit Owner' : 'Add Owner'}</h3>
            <button class="modal-close" onclick="Modal.close('ownerModal')">×</button>
          </div>
          <div class="modal-body">
            <form id="ownerForm">
              <div class="grid-2">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" id="ownerFirstName" value="${owner?.first_name || ''}" required>
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" id="ownerLastName" value="${owner?.last_name || ''}" required>
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="ownerEmail" value="${owner?.email || ''}" required>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="text" id="ownerImage" value="${owner?.image || ''}" placeholder="https://...">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.close('ownerModal')">Cancel</button>
            <button class="btn btn-primary" onclick="app.saveOwner('${owner?.id || ''}')">
              ${isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('ownerModal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (!isEdit) Modal.open('ownerModal');
  }

  saveOwner(id) {
    const data = {
      first_name: document.getElementById('ownerFirstName').value,
      last_name: document.getElementById('ownerLastName').value,
      email: document.getElementById('ownerEmail').value,
      image: document.getElementById('ownerImage').value || undefined
    };

    let result;
    if (id) {
      result = api.updateOwnerProfile(data); // This is admin-managed update
      // For demo, we'll use a simple approach
      const index = api.data.owners.findIndex(o => o.id === id);
      if (index !== -1) {
        api.data.owners[index] = { ...api.data.owners[index], ...data };
        result = { success: true, data: api.data.owners[index] };
      } else {
        result = { success: false, message: 'Owner not found' };
      }
    } else {
      result = api.createOwner(data);
    }

    if (result.success) {
      Toast.show(id ? 'Owner updated!' : 'Owner created!', 'success');
      Modal.close('ownerModal');
      this.navigateTo('owners');
    } else {
      Toast.show(result.message, 'error');
    }
  }

  editOwner(id) {
    const result = api.getOwnerById(id);
    if (result.success) {
      this.openOwnerModal(result.data);
      Modal.open('ownerModal');
    }
  }

  deleteOwner(id) {
    confirmAction('Delete this owner? All associated stores will be removed.', () => {
      const result = api.deleteOwner(id);
      if (result.success) {
        Toast.show('Owner deleted', 'success');
        this.navigateTo('owners');
      } else {
        Toast.show(result.message, 'error');
      }
    });
  }

  // ============ PROFILE ============
  renderProfile(container) {
    const user = api.currentUser;
    const result = api.getOwnerDetails();
    const owner = result.success ? result.data : user;

    container.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h2>Profile Information</h2></div>
          <div class="card-body">
            <div style="text-align:center;margin-bottom:1.5rem;">
              <img src="${owner.image || 'https://i.pravatar.cc/150?u=' + owner.id}" 
                class="avatar avatar-lg" style="width:100px;height:100px;"
                onerror="this.src='https://i.pravatar.cc/150?u=default'">
              <h3 style="margin-top:0.75rem;">${owner.first_name} ${owner.last_name}</h3>
              <p class="text-muted">${owner.email}</p>
              <span class="badge badge-info">${user.role}</span>
            </div>

            <form id="profileForm">
              <div class="grid-2">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" id="profileFirstName" value="${owner.first_name}">
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" id="profileLastName" value="${owner.last_name}">
                </div>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="profileEmail" value="${owner.email}" disabled>
              </div>
              <div class="form-group">
                <label>Profile Image URL</label>
                <input type="text" id="profileImage" value="${owner.image || ''}">
              </div>
              <button type="button" class="btn btn-primary" onclick="app.saveProfile()">Update Profile</button>
            </form>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h2>Security</h2></div>
          <div class="card-body">
            <form id="passwordForm">
              <div class="form-group">
                <label>Current Password</label>
                <input type="password" id="currentPassword" placeholder="Enter current password">
              </div>
              <div class="form-group">
                <label>New Password</label>
                <input type="password" id="newPassword" placeholder="Enter new password">
              </div>
              <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm new password">
              </div>
              <button type="button" class="btn btn-primary" onclick="app.changePassword()">Change Password</button>
            </form>

            <div class="divider"></div>

            <div style="display:flex;gap:0.75rem;">
              <button class="btn btn-secondary" onclick="app.resetPassword()">Reset Password</button>
              <button class="btn btn-danger" onclick="app.deactivateAccount()">Deactivate Account</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  saveProfile() {
    const data = {
      first_name: document.getElementById('profileFirstName').value,
      last_name: document.getElementById('profileLastName').value,
      image: document.getElementById('profileImage').value || undefined
    };

    const result = api.updateOwnerProfile(data);
    if (result.success) {
      Toast.show('Profile updated!', 'success');
      // Update top bar
      const user = api.currentUser;
      document.querySelector('.user-badge span').textContent = `${user.first_name} ${user.last_name}`;
      document.querySelector('.user-badge img').src = user.image || 'https://i.pravatar.cc/150?u=' + user.id;
    } else {
      Toast.show(result.message, 'error');
    }
  }

  changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!current || !newPass || !confirm) {
      Toast.show('Please fill all password fields', 'warning');
      return;
    }
    if (newPass !== confirm) {
      Toast.show('Passwords do not match', 'error');
      return;
    }

    Toast.show('Password changed successfully!', 'success');
    document.getElementById('passwordForm').reset();
  }

  resetPassword() {
    Toast.show('Password reset link sent to your email', 'info');
  }

  deactivateAccount() {
    confirmAction('Are you sure? This will deactivate your account.', () => {
      const result = api.deactivateOwner();
      if (result.success) {
        Toast.show('Account deactivated', 'warning');
        this.logout();
      }
    });
  }

  logout() {
    api.logout();
    Toast.show('Logged out successfully', 'info');
    this.showLogin();
  }
}

// Initialize app
const app = new App();
