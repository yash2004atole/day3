(function () {
  "use strict";

  const CART_KEY = "rs_cart";
  const tableBody = document.getElementById("cartTableBody");
  if (!tableBody) return; // Not on cart page

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function currency(n) {
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function render() {
    const cart = getCart();
    const emptyState = document.getElementById("cartEmptyState");
    const cartWrapper = document.getElementById("cartTableWrapper");

    if (cart.length === 0) {
      if (emptyState) emptyState.classList.remove("d-none");
      if (cartWrapper) cartWrapper.classList.add("d-none");
      updateTotals(cart);
      return;
    }
    if (emptyState) emptyState.classList.add("d-none");
    if (cartWrapper) cartWrapper.classList.remove("d-none");

    tableBody.innerHTML = cart
      .map(
        (item, index) => `
      <tr data-index="${index}">
        <td>
          <div class="d-flex align-items-center gap-2">
            <span style="font-size:1.6rem;">${item.icon}</span>
            <div>
              <div class="fw-semibold">${item.name}</div>
              <div class="text-muted small">${currency(item.price)} / ${item.unit}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="qty-control">
            <button type="button" class="js-decrease" aria-label="Decrease quantity">−</button>
            <input type="text" readonly value="${item.qty}" aria-label="Quantity">
            <button type="button" class="js-increase" aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td class="fw-semibold">${currency(item.price * item.qty)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger js-remove" aria-label="Remove ${item.name}">Remove</button>
        </td>
      </tr>`
      )
      .join("");

    tableBody.querySelectorAll(".js-increase").forEach((btn) =>
      btn.addEventListener("click", (e) => changeQty(e, 1))
    );
    tableBody.querySelectorAll(".js-decrease").forEach((btn) =>
      btn.addEventListener("click", (e) => changeQty(e, -1))
    );
    tableBody.querySelectorAll(".js-remove").forEach((btn) =>
      btn.addEventListener("click", (e) => removeItem(e))
    );

    updateTotals(cart);
  }

  function changeQty(e, delta) {
    const row = e.target.closest("tr");
    const index = Number(row.dataset.index);
    const cart = getCart();
    if (!cart[index]) return;
    const newQty = cart[index].qty + delta;
    if (newQty < 1) {
      cart.splice(index, 1);
      window.RS.showToast("Item removed from cart.", "primary");
    } else {
      cart[index].qty = newQty;
    }
    saveCart(cart);
    render();
  }

  function removeItem(e) {
    const row = e.target.closest("tr");
    const index = Number(row.dataset.index);
    const cart = getCart();
    const removed = cart.splice(index, 1);
    saveCart(cart);
    if (removed[0]) window.RS.showToast(`${removed[0].name} removed from cart.`, "primary");
    render();
  }

  function updateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = subtotal > 0 ? 10 : 0;
    const total = subtotal + deliveryFee;

    const subtotalEl = document.getElementById("cartSubtotal");
    const deliveryEl = document.getElementById("cartDelivery");
    const totalEl = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (subtotalEl) subtotalEl.textContent = currency(subtotal);
    if (deliveryEl) deliveryEl.textContent = currency(deliveryFee);
    if (totalEl) totalEl.textContent = currency(total);
    if (checkoutBtn) checkoutBtn.classList.toggle("disabled", cart.length === 0);

    document.querySelectorAll(".js-cart-count").forEach((el) => {
      const count = cart.reduce((s, i) => s + i.qty, 0);
      el.textContent = count;
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
  }

  render();
})();
