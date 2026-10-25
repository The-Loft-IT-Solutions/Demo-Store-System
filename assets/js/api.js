/**
 * Store System Web Demo - Demo API Layer
 * Simulates all API endpoints using local JSON data (embedded inline)
 */

const DEMO_DATA = {
  "admins": [
    {
      "id": "52fbe1be-07b5-4bfa-bfa4-6403ec8fc173",
      "first_name": "Sample",
      "last_name": "Admin 1",
      "email": "admin1@companya.example",
      "is_verified": true,
      "created_at": "2024-01-15T08:30:00Z",
      "updated_at": "2024-03-20T10:15:00Z"
    },
    {
      "id": "c8c35a21-5eb7-4aec-87f9-d9741767b86a",
      "first_name": "Sample",
      "last_name": "Admin 2",
      "email": "admin2@companya.example",
      "is_verified": true,
      "created_at": "2024-02-10T14:20:00Z",
      "updated_at": "2024-04-05T09:45:00Z"
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "first_name": "Sample",
      "last_name": "Admin 3",
      "email": "admin3@companya.example",
      "is_verified": false,
      "created_at": "2024-05-01T11:00:00Z",
      "updated_at": "2024-05-01T11:00:00Z"
    }
  ],
  "owners": [
    {
      "id": "109b1da1-7e3c-4cca-8f41-85bc735ceef8",
      "first_name": "Sample",
      "last_name": "Owner 1",
      "email": "owner1@companya.example",
      "image": "",
      "is_active": true,
      "created_at": "2024-01-20T09:00:00Z"
    },
    {
      "id": "cab26453-3377-4992-93db-b583f209786c",
      "first_name": "Sample",
      "last_name": "Owner 2",
      "email": "owner2@store.com",
      "image": "",
      "is_active": true,
      "created_at": "2024-02-15T13:30:00Z"
    },
    {
      "id": "d4e5f6a7-b8c9-0123-d456-e7890f123456",
      "first_name": "Sample",
      "last_name": "Owner 3",
      "email": "owner3@store.com",
      "image": "",
      "is_active": false,
      "created_at": "2024-03-10T16:45:00Z"
    }
  ],
  "stores": [
    {
      "id": "53ccaede-d1f1-4247-9eb0-41ed9f31b914",
      "owner_id": "109b1da1-7e3c-4cca-8f41-85bc735ceef8",
      "store_name": "Store A",
      "location": "Sample City, Sample Province",
      "status": true,
      "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      "created_at": "2024-01-25T10:00:00Z"
    },
    {
      "id": "f1e2a876-c239-4df7-8cf6-d09ba007f194",
      "owner_id": "109b1da1-7e3c-4cca-8f41-85bc735ceef8",
      "store_name": "Store B",
      "location": "Sample City, Sample Province",
      "status": true,
      "image": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400",
      "created_at": "2024-02-05T14:30:00Z"
    },
    {
      "id": "fb683008-14ef-4c61-b4f7-31b2b97a2d47",
      "owner_id": "cab26453-3377-4992-93db-b583f209786c",
      "store_name": "Store C",
      "location": "Sample City, Metro Manila",
      "status": false,
      "image": "https://images.unsplash.com/photo-1550009158-9ebf690569ba?w=400",
      "created_at": "2024-03-01T11:15:00Z"
    }
  ],
  "categories": [
    {
      "id": "6a325cc7-3153-4e7f-8f9d-2a7bd5328539",
      "store_id": "53ccaede-d1f1-4247-9eb0-41ed9f31b914",
      "category_name": "Electronics",
      "status": true,
      "image": "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400",
      "created_at": "2024-01-26T09:00:00Z"
    },
    {
      "id": "29938546-7f00-4417-a9cf-8668463b1096",
      "store_id": "53ccaede-d1f1-4247-9eb0-41ed9f31b914",
      "category_name": "Groceries",
      "status": true,
      "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
      "created_at": "2024-01-27T10:30:00Z"
    },
    {
      "id": "d6177ee4-f48b-4d54-a19f-e158ec61021a",
      "store_id": "f1e2a876-c239-4df7-8cf6-d09ba007f194",
      "category_name": "Household Items",
      "status": true,
      "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      "created_at": "2024-02-06T08:00:00Z"
    },
    {
      "id": "e8f9a0b1-c2d3-4567-e890-f12345678901",
      "store_id": "fb683008-14ef-4c61-b4f7-31b2b97a2d47",
      "category_name": "Gadgets",
      "status": false,
      "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
      "created_at": "2024-03-02T12:00:00Z"
    }
  ],
  "products": [
    {
      "id": "53987212-cd39-4a06-8e52-cf8a8fa8ca68",
      "category_id": "6a325cc7-3153-4e7f-8f9d-2a7bd5328539",
      "product_name": "Wireless Earbuds",
      "stock_level": 45,
      "price": 1299.99,
      "status": true,
      "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
      "created_at": "2024-01-28T11:00:00Z"
    },
    {
      "id": "9934adad-18b0-4246-81b1-2f2efa3283b7",
      "category_id": "6a325cc7-3153-4e7f-8f9d-2a7bd5328539",
      "product_name": "Bluetooth Speaker",
      "stock_level": 28,
      "price": 899.50,
      "status": true,
      "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
      "created_at": "2024-01-29T13:30:00Z"
    },
    {
      "id": "489f633b-a6d5-4a37-8d1f-8c3bd8d90ad7",
      "category_id": "29938546-7f00-4417-a9cf-8668463b1096",
      "product_name": "Organic Rice (5kg)",
      "stock_level": 120,
      "price": 250.00,
      "status": true,
      "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      "created_at": "2024-01-30T09:15:00Z"
    },
    {
      "id": "b2aa2ba1-2bfd-4bed-86e4-defdf1a8b519",
      "category_id": "29938546-7f00-4417-a9cf-8668463b1096",
      "product_name": "Canned Sardines (Pack of 6)",
      "stock_level": 200,
      "price": 180.00,
      "status": false,
      "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      "created_at": "2024-02-01T10:00:00Z"
    },
    {
      "id": "c3d4e5f6-a7b8-9012-c345-d6789e012345",
      "category_id": "d6177ee4-f48b-4d54-a19f-e158ec61021a",
      "product_name": "Dishwashing Liquid (1L)",
      "stock_level": 75,
      "price": 95.00,
      "status": true,
      "image": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400",
      "created_at": "2024-02-07T14:00:00Z"
    }
  ],
  "sales": [
    {
      "id": "e9f9b0b4-809b-4023-95a4-87dee27dab33",
      "store_id": "53ccaede-d1f1-4247-9eb0-41ed9f31b914",
      "items": [
        {"product_id": "53987212-cd39-4a06-8e52-cf8a8fa8ca68", "quantity": 2, "unit_price": 1299.99},
        {"product_id": "9934adad-18b0-4246-81b1-2f2efa3283b7", "quantity": 1, "unit_price": 899.50}
      ],
      "total_amount": 3499.48,
      "created_at": "2024-03-15T14:30:00Z"
    },
    {
      "id": "f0a1b2c3-d4e5-6789-f012-345678901234",
      "store_id": "53ccaede-d1f1-4247-9eb0-41ed9f31b914",
      "items": [
        {"product_id": "489f633b-a6d5-4a37-8d1f-8c3bd8d90ad7", "quantity": 3, "unit_price": 250.00}
      ],
      "total_amount": 750.00,
      "created_at": "2024-03-16T10:15:00Z"
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567891",
      "store_id": "f1e2a876-c239-4df7-8cf6-d09ba007f194",
      "items": [
        {"product_id": "c3d4e5f6-a7b8-9012-c345-d6789e012345", "quantity": 5, "unit_price": 95.00}
      ],
      "total_amount": 475.00,
      "created_at": "2024-03-17T16:45:00Z"
    }
  ]
};

class DemoAPI {
  constructor() {
    this.data = JSON.parse(JSON.stringify(DEMO_DATA));
    this.currentUser = null;
    this.getSession();
  }

  // ============ AUTH / SESSION ============

  loginAdmin(email, password) {
    const admin = this.data.admins.find(a => a.email === email);
    if (!admin) return { success: false, message: 'Admin not found' };
    this.currentUser = { ...admin, role: 'admin', token: 'demo_admin_token_' + admin.id };
    this.saveSession();
    return { success: true, data: this.currentUser };
  }

  loginOwner(email, password) {
    const owner = this.data.owners.find(o => o.email === email);
    if (!owner) return { success: false, message: 'Owner not found' };
    if (!owner.is_active) return { success: false, message: 'Account is deactivated' };
    this.currentUser = { ...owner, role: 'owner', token: 'demo_owner_token_' + owner.id };
    this.saveSession();
    return { success: true, data: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('storesapi_session');
    return { success: true };
  }

  saveSession() {
    localStorage.setItem('storesapi_session', JSON.stringify(this.currentUser));
  }

  getSession() {
    const session = localStorage.getItem('storesapi_session');
    if (session) {
      this.currentUser = JSON.parse(session);
      return this.currentUser;
    }
    return null;
  }

  // ============ ADMIN ENDPOINTS ============

  getAllAdmins() {
    return { success: true, data: this.data.admins };
  }

  getAdminById(id) {
    const admin = this.data.admins.find(a => a.id === id);
    if (!admin) return { success: false, message: 'Admin not found' };
    return { success: true, data: admin };
  }

  createAdmin(data) {
    const newAdmin = {
      id: 'admin_' + Date.now(),
      ...data,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.admins.push(newAdmin);
    return { success: true, data: newAdmin };
  }

  updateAdmin(id, data) {
    const index = this.data.admins.findIndex(a => a.id === id);
    if (index === -1) return { success: false, message: 'Admin not found' };
    this.data.admins[index] = { ...this.data.admins[index], ...data, updated_at: new Date().toISOString() };
    return { success: true, data: this.data.admins[index] };
  }

  deleteAdmin(id) {
    const index = this.data.admins.findIndex(a => a.id === id);
    if (index === -1) return { success: false, message: 'Admin not found' };
    this.data.admins.splice(index, 1);
    return { success: true };
  }

  // ============ OWNER ENDPOINTS (Admin-managed) ============

  getAllOwners() {
    return { success: true, data: this.data.owners };
  }

  getOwnerById(id) {
    const owner = this.data.owners.find(o => o.id === id);
    if (!owner) return { success: false, message: 'Owner not found' };
    return { success: true, data: owner };
  }

  createOwner(data) {
    const newOwner = {
      id: 'owner_' + Date.now(),
      ...data,
      image: data.image || 'https://i.pravatar.cc/150?u=' + Date.now(),
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.data.owners.push(newOwner);
    return { success: true, data: newOwner };
  }

  deleteOwner(id) {
    const index = this.data.owners.findIndex(o => o.id === id);
    if (index === -1) return { success: false, message: 'Owner not found' };
    this.data.owners.splice(index, 1);
    return { success: true };
  }

  resetOwnerPassword(id) {
    const owner = this.data.owners.find(o => o.id === id);
    if (!owner) return { success: false, message: 'Owner not found' };
    return { success: true, message: 'Password reset email sent to ' + owner.email };
  }

  // ============ OWNER SELF-SERVICE ============

  getOwnerDetails() {
    if (!this.currentUser || this.currentUser.role !== 'owner') {
      return { success: false, message: 'Unauthorized' };
    }
    const owner = this.data.owners.find(o => o.id === this.currentUser.id);
    return { success: true, data: owner };
  }

  updateOwnerProfile(data) {
    if (!this.currentUser || this.currentUser.role !== 'owner') {
      return { success: false, message: 'Unauthorized' };
    }
    const index = this.data.owners.findIndex(o => o.id === this.currentUser.id);
    if (index === -1) return { success: false, message: 'Owner not found' };
    this.data.owners[index] = { ...this.data.owners[index], ...data };
    this.currentUser = { ...this.currentUser, ...data };
    this.saveSession();
    return { success: true, data: this.data.owners[index] };
  }

  deactivateOwner() {
    if (!this.currentUser || this.currentUser.role !== 'owner') {
      return { success: false, message: 'Unauthorized' };
    }
    const index = this.data.owners.findIndex(o => o.id === this.currentUser.id);
    if (index === -1) return { success: false, message: 'Owner not found' };
    this.data.owners[index].is_active = false;
    this.logout();
    return { success: true, message: 'Account deactivated' };
  }

  // ============ STORES ============

  getAllStores() {
    const stores = this.data.stores.map(s => ({
      ...s,
      owner: this.data.owners.find(o => o.id === s.owner_id)
    }));
    return { success: true, data: stores };
  }

  getStoreById(id) {
    const store = this.data.stores.find(s => s.id === id);
    if (!store) return { success: false, message: 'Store not found' };
    return { success: true, data: { ...store, owner: this.data.owners.find(o => o.id === store.owner_id) } };
  }

  getStoresByOwner(ownerId) {
    const stores = this.data.stores
      .filter(s => s.owner_id === ownerId)
      .map(s => ({ ...s, owner: this.data.owners.find(o => o.id === s.owner_id) }));
    return { success: true, data: stores };
  }

  createStore(data) {
    const newStore = {
      id: 'store_' + Date.now(),
      owner_id: this.currentUser?.id,
      ...data,
      created_at: new Date().toISOString()
    };
    this.data.stores.push(newStore);
    return { success: true, data: newStore };
  }

  updateStore(id, data) {
    const index = this.data.stores.findIndex(s => s.id === id);
    if (index === -1) return { success: false, message: 'Store not found' };
    this.data.stores[index] = { ...this.data.stores[index], ...data };
    return { success: true, data: this.data.stores[index] };
  }

  deleteStore(id) {
    const index = this.data.stores.findIndex(s => s.id === id);
    if (index === -1) return { success: false, message: 'Store not found' };
    this.data.stores.splice(index, 1);
    this.data.categories = this.data.categories.filter(c => c.store_id !== id);
    this.data.products = this.data.products.filter(p => {
      const cat = this.data.categories.find(c => c.id === p.category_id);
      return cat;
    });
    return { success: true };
  }

  // ============ CATEGORIES ============

  getAllCategories() {
    const categories = this.data.categories.map(c => ({
      ...c,
      store: this.data.stores.find(s => s.id === c.store_id)
    }));
    return { success: true, data: categories };
  }

  getCategoryById(id) {
    const category = this.data.categories.find(c => c.id === id);
    if (!category) return { success: false, message: 'Category not found' };
    return { success: true, data: { ...category, store: this.data.stores.find(s => s.id === category.store_id) } };
  }

  getCategoriesByStore(storeId) {
    const categories = this.data.categories
      .filter(c => c.store_id === storeId)
      .map(c => ({ ...c, store: this.data.stores.find(s => s.id === c.store_id) }));
    return { success: true, data: categories };
  }

  createCategory(data) {
    const newCategory = {
      id: 'cat_' + Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    this.data.categories.push(newCategory);
    return { success: true, data: newCategory };
  }

  updateCategory(id, data) {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return { success: false, message: 'Category not found' };
    this.data.categories[index] = { ...this.data.categories[index], ...data };
    return { success: true, data: this.data.categories[index] };
  }

  deleteCategory(id) {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return { success: false, message: 'Category not found' };
    this.data.categories.splice(index, 1);
    this.data.products = this.data.products.filter(p => p.category_id !== id);
    return { success: true };
  }

  // ============ PRODUCTS ============

  getAllProducts() {
    const products = this.data.products.map(p => {
      const category = this.data.categories.find(c => c.id === p.category_id);
      const store = category ? this.data.stores.find(s => s.id === category.store_id) : null;
      return { ...p, category, store };
    });
    return { success: true, data: products };
  }

  getProductById(id) {
    const product = this.data.products.find(p => p.id === id);
    if (!product) return { success: false, message: 'Product not found' };
    const category = this.data.categories.find(c => c.id === product.category_id);
    const store = category ? this.data.stores.find(s => s.id === category.store_id) : null;
    return { success: true, data: { ...product, category, store } };
  }

  getProductsByCategory(categoryId) {
    const products = this.data.products
      .filter(p => p.category_id === categoryId)
      .map(p => {
        const category = this.data.categories.find(c => c.id === p.category_id);
        const store = category ? this.data.stores.find(s => s.id === category.store_id) : null;
        return { ...p, category, store };
      });
    return { success: true, data: products };
  }

  createProduct(data) {
    const newProduct = {
      id: 'prod_' + Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    this.data.products.push(newProduct);
    return { success: true, data: newProduct };
  }

  updateProduct(id, data) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return { success: false, message: 'Product not found' };
    this.data.products[index] = { ...this.data.products[index], ...data };
    return { success: true, data: this.data.products[index] };
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return { success: false, message: 'Product not found' };
    this.data.products.splice(index, 1);
    return { success: true };
  }

  // ============ SALES ============

  getAllSales() {
    const sales = this.data.sales.map(s => {
      const store = this.data.stores.find(st => st.id === s.store_id);
      const items = s.items.map(item => {
        const product = this.data.products.find(p => p.id === item.product_id);
        return { ...item, product };
      });
      return { ...s, store, items };
    });
    return { success: true, data: sales };
  }

  getSaleById(id) {
    const sale = this.data.sales.find(s => s.id === id);
    if (!sale) return { success: false, message: 'Sale not found' };
    const store = this.data.stores.find(st => st.id === sale.store_id);
    const items = sale.items.map(item => {
      const product = this.data.products.find(p => p.id === item.product_id);
      return { ...item, product };
    });
    return { success: true, data: { ...sale, store, items } };
  }

  getSalesByStore(storeId) {
    const sales = this.data.sales
      .filter(s => s.store_id === storeId)
      .map(s => {
        const store = this.data.stores.find(st => st.id === s.store_id);
        const items = s.items.map(item => {
          const product = this.data.products.find(p => p.id === item.product_id);
          return { ...item, product };
        });
        return { ...s, store, items };
      });
    return { success: true, data: sales };
  }

  getSalesByProduct(productId) {
    const sales = this.data.sales
      .filter(s => s.items.some(item => item.product_id === productId))
      .map(s => {
        const store = this.data.stores.find(st => st.id === s.store_id);
        const items = s.items.map(item => {
          const product = this.data.products.find(p => p.id === item.product_id);
          return { ...item, product };
        });
        return { ...s, store, items };
      });
    return { success: true, data: sales };
  }

  getTotalSalesPerProduct(startDate, endDate) {
    const totals = {};
    this.data.sales.forEach(sale => {
      if (startDate && endDate) {
        const saleDate = new Date(sale.created_at);
        if (saleDate < new Date(startDate) || saleDate > new Date(endDate)) return;
      }
      sale.items.forEach(item => {
        if (!totals[item.product_id]) {
          const product = this.data.products.find(p => p.id === item.product_id);
          totals[item.product_id] = { product, total_quantity: 0, total_revenue: 0 };
        }
        totals[item.product_id].total_quantity += item.quantity;
        totals[item.product_id].total_revenue += item.quantity * item.unit_price;
      });
    });
    return { success: true, data: Object.values(totals) };
  }

  createSale(data) {
    let total = 0;
    const items = data.sales.map(item => {
      const product = this.data.products.find(p => p.id === item.product_id);
      total += item.quantity * product.price;
      return { ...item, unit_price: product.price };
    });

    const newSale = {
      id: 'sale_' + Date.now(),
      store_id: data.store_id || this.currentUser?.id,
      items,
      total_amount: total,
      created_at: new Date().toISOString()
    };
    this.data.sales.push(newSale);
    return { success: true, data: newSale };
  }

  updateSale(id, data) {
    const index = this.data.sales.findIndex(s => s.id === id);
    if (index === -1) return { success: false, message: 'Sale not found' };
    this.data.sales[index] = { ...this.data.sales[index], ...data };
    return { success: true, data: this.data.sales[index] };
  }

  deleteSale(id) {
    const index = this.data.sales.findIndex(s => s.id === id);
    if (index === -1) return { success: false, message: 'Sale not found' };
    this.data.sales.splice(index, 1);
    return { success: true };
  }

  // ============ DASHBOARD STATS ============

  getDashboardStats() {
    const totalSales = this.data.sales.reduce((sum, s) => sum + s.total_amount, 0);
    const totalProducts = this.data.products.length;
    const totalStores = this.data.stores.length;
    const totalOwners = this.data.owners.filter(o => o.is_active).length;
    const lowStock = this.data.products.filter(p => p.stock_level < 30).length;

    return {
      success: true,
      data: {
        totalSales,
        totalProducts,
        totalStores,
        totalOwners,
        lowStock,
        totalCategories: this.data.categories.length,
        totalAdmins: this.data.admins.length,
        recentSales: this.data.sales.slice(-5).reverse()
      }
    };
  }
}

// Global instance
const api = new DemoAPI();
