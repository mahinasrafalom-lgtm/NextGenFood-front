const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const fetchProducts = async (category = null) => {
  const url = category && category !== 'All' 
    ? `${API_BASE}/products?category=${encodeURIComponent(category.toLowerCase())}`
    : `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return await res.json();
};

export const addProductReview = async (id, reviewData) => {
  const res = await fetch(`${API_BASE}/products/${id}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to add review');
  }
  return await res.json();
};

export const placeOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to place order');
  return await res.json();
};

export const trackOrder = async (orderId) => {
  const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(orderId)}`);
  if (!res.ok) throw new Error("Invalid Order ID");
  return await res.json();
};

export const getUserOrders = async (email) => {
  const res = await fetch(`${API_BASE}/orders/user/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return await res.json();
};

export const fetchStorefrontData = async () => {
  const res = await fetch(`${API_BASE}/storefront`);
  if (!res.ok) throw new Error('Failed to fetch storefront data');
  return await res.json();
};

export const fetchTopSales = async () => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch top sales');
  const products = await res.json();
  return products.filter(p => p.isTopSale).map(p => ({
    id: p._id || p.id,
    _id: p._id,
    name: p.name, 
    priceMin: p.priceMin, 
    priceMax: p.priceMax, 
    discount: p.discount, 
    rating: p.rating || 5, 
    reviewCount: p.reviewCount || Math.floor(Math.random() * 20), 
    image: p.image
  }));
};

// Chat API functions
export const createChat = async (userData) => {
  const res = await fetch(`${API_BASE}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }
  return await res.json();
};

export const getChat = async (chatId, role = 'user') => {
  const res = await fetch(`${API_BASE}/chats/${chatId}?role=${role}`);
  if (!res.ok) throw new Error('Failed to fetch chat');
  return await res.json();
};

export const sendMessage = async (chatId, sender, text, type = 'text', fileUrl = '') => {
  const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, text, type, fileUrl })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return await res.json();
};

export const uploadFile = async (chatId, sender, file, type, text = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sender', sender);
  formData.append('type', type);
  if (text) formData.append('text', text);

  const res = await fetch(`${API_BASE}/chats/${chatId}/files`, {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to upload file: ${errorText}`);
  }
  return await res.json();
};

// User Profile sync API
export const syncUserProfile = async (userData, token) => {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  
  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch(e) {
      const errorText = await res.text();
      errorData = { message: errorText };
    }
    
    // If it's a 400 with "already exists", we treat it as a successful sync for existing logins
    if (res.status === 400 && errorData.message && errorData.message.includes('already exists')) {
      return { message: 'User profile already exists' };
    }
    throw new Error(errorData.message || 'Failed to sync user profile');
  }
  return await res.json();
};
