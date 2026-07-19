/**
 * StoresAPI Web Demo - Utilities
 */

// Format currency
function formatCurrency(amount) {
  return '₱' + parseFloat(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Format date
function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr);
  const opts = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return date.toLocaleDateString('en-PH', opts);
}

function formatDateTime(dateStr) {
  return formatDate(dateStr, { hour: '2-digit', minute: '2-digit' });
}

// Format relative time
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return formatDate(dateStr);
}

// Generate UUID (simple version)
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Debounce
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Get initials from name
function getInitials(firstName, lastName) {
  return (firstName?.[0] || '') + (lastName?.[0] || '');
}

// Toast notifications
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', title = '') {
    this.init();
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title || titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Modal helper
const Modal = {
  open(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  },

  close(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }
};

// Confirm dialog
function confirmAction(message, onConfirm) {
  if (confirm(message)) {
    onConfirm();
  }
}

// Table sort helper
function sortTable(data, key, direction = 'asc') {
  return [...data].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Search filter
function filterData(data, query, keys) {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

// Pagination helper
function paginate(data, page = 1, perPage = 10) {
  const total = data.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = data.slice(start, start + perPage);

  return {
    data: paginated,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

// Render pagination controls
function renderPagination(pagination, onPageChange) {
  const { page, totalPages, hasNext, hasPrev } = pagination;
  if (totalPages <= 1) return '';

  let html = '<div class="pagination">';
  html += `<button ${!hasPrev ? 'disabled' : ''} onclick="${onPageChange}(${page - 1})">←</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      html += `<button class="${i === page ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
    } else if (i === page - 2 || i === page + 2) {
      html += '<button disabled>...</button>';
    }
  }

  html += `<button ${!hasNext ? 'disabled' : ''} onclick="${onPageChange}(${page + 1})">→</button>`;
  html += '</div>';
  return html;
}

// Local storage helpers
const Storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// Image placeholder
function getImagePlaceholder(text) {
  return `https://placehold.co/400x300/4f46e5/ffffff?text=${encodeURIComponent(text)}`;
}

// Export for global use
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.timeAgo = timeAgo;
window.generateId = generateId;
window.debounce = debounce;
window.escapeHtml = escapeHtml;
window.getInitials = getInitials;
window.Toast = Toast;
window.Modal = Modal;
window.confirmAction = confirmAction;
window.sortTable = sortTable;
window.filterData = filterData;
window.paginate = paginate;
window.renderPagination = renderPagination;
window.Storage = Storage;
window.getImagePlaceholder = getImagePlaceholder;
