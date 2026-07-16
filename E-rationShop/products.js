
(function () {
  "use strict";

  const CART_KEY = "rs_cart";

  const PRODUCTS = [
    {
       id: "rice", 
       name: "Rice", 
       category: "grains", 
       icon: "🍚", 
       price: 3, 
       unit: "kg", 
       stock: 25, 
       badge: "Staple" 
      },
    { 
      id: "wheat", 
      name: "Wheat", 
      category: "grains", 
      icon: "🌾", 
      price: 2, 
      unit: "kg", 
      stock: 30, 
      badge: "Staple" 
    },
    { 
      id: "sugar", 
      name: "Sugar", 
      category: "essentials", 
      icon: "🧂", price: 18, 
      unit: "kg", stock: 10, 
      badge: "Limited" 
    },
    { 
      id: "oil", 
      name: "Cooking Oil", 
      category: "essentials", 
      icon: "🛢️", price: 95, 
      unit: "litre", 
      stock: 8, 
      badge: "Limited" 
    },
    { 
      id: "salt", 
      name: "Salt", 
      category: "essentials", 
      icon: "🧂", 
      price: 8, 
      unit: "kg", 
      stock: 20, 
      badge: "Staple" 
    },
    { 
      id: "kerosene", 
      name: "Kerosene", 
      category: "fuel", 
      icon: "🛢️", 
      price: 32, 
      unit: "litre", 
      stock: 5, 
      badge: "Limited" 
    },
  ];

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }
  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".js-cart-count").forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
  }

  function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      if (existing.qty < product.stock) existing.qty += 1;
      else {
        window.RS.showToast(`Only ${product.stock} ${product.unit} of ${product.name} available.`, "warning");
        return;
      }
    } else {
      cart.push({ id: product.id, name: product.name, icon: product.icon, price: product.price, unit: product.unit, qty: 1 });
    }
    saveCart(cart);
    window.RS.showToast(`${product.name} added to cart.`, "success");
  }

  function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    if (list.length === 0) {
      grid.innerHTML = `<div class="col-12"><div class="alert alert-rs alert-warning text-center">No products match your search.</div></div>`;
      return;
    }
    grid.innerHTML = list
      .map(
        (p) => `
      <div class="col-sm-6 col-lg-4 col-xl-3 product-item" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
        <div class="rs-card product-card">
          <div class="product-thumb">${p.icon}</div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <h5 class="mb-0">${p.name}</h5>
              <span class="qty-badge">${p.badge}</span>
            </div>
            <p class="price mb-1">₹${p.price} <small>/ ${p.unit}</small></p>
            <p class="text-muted small mb-3">Available: <strong>${p.stock} ${p.unit}</strong></p>
            <button class="btn btn-rs-primary w-100 js-add-cart" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    grid.querySelectorAll(".js-add-cart").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.id));
    });
  }

  function applyFilters() {
    const searchTerm = (document.getElementById("productSearch")?.value || "").toLowerCase().trim();
    const category = document.getElementById("categoryFilter")?.value || "all";
    const filtered = PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm);
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    });
    renderProducts(filtered);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("productGrid")) {
      updateCartBadge();
      return;
    }
    renderProducts(PRODUCTS);
    updateCartBadge();

    document.getElementById("productSearch")?.addEventListener("input", applyFilters);
    document.getElementById("categoryFilter")?.addEventListener("change", applyFilters);
  });

  // Update badge on every page load
  updateCartBadge();
})();
