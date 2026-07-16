(function () {
  "use strict";

  const CART_KEY = "rs_cart";
  const summaryBody = document.getElementById("checkoutSummaryBody");
  if (!summaryBody) return;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function currency(n) {
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function render() {
    const cart = getCart();
    const proceedBtn = document.getElementById("proceedPaymentBtn");

    if (cart.length === 0) {
      summaryBody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-4">Your cart is empty. Please add products before checking out.</td></tr>`;
      if (proceedBtn) proceedBtn.classList.add("disabled");
      document.getElementById("checkoutTotal").textContent = currency(0);
      return;
    }

    summaryBody.innerHTML = cart
      .map(
        (item) => `
      <tr>
        <td>${item.icon} ${item.name} <span class="text-muted small">× ${item.qty} ${item.unit}</span></td>
        <td class="text-end">${currency(item.price * item.qty)}</td>
      </tr>`
      )
      .join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = 10;
    const total = subtotal + deliveryFee;

    summaryBody.innerHTML += `
      <tr><td class="text-muted">Delivery Fee</td><td class="text-end text-muted">${currency(deliveryFee)}</td></tr>
    `;
    document.getElementById("checkoutTotal").textContent = currency(total);
    if (proceedBtn) proceedBtn.classList.remove("disabled");
  }

  render();

  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) {
        window.RS.showToast("Your cart is empty.", "danger");
        return;
      }
      const name = document.getElementById("checkoutName");
      const address = document.getElementById("checkoutAddress");
      let valid = true;
      if (!name.value.trim()) {
        name.classList.add("is-invalid");
        valid = false;
      } else {
        name.classList.remove("is-invalid");
        name.classList.add("is-valid");
      }
      if (!address.value.trim()) {
        address.classList.add("is-invalid");
        valid = false;
      } else {
        address.classList.remove("is-invalid");
        address.classList.add("is-valid");
      }
      if (!valid) {
        window.RS.showToast("Please fill in your name and address.", "danger");
        return;
      }

      window.RS.showSpinner("Redirecting to payment gateway...");
      setTimeout(() => {
        window.RS.hideSpinner();
        localStorage.removeItem(CART_KEY);
        window.RS.showToast("Order placed! Payment gateway will connect here after backend integration.", "success");
        setTimeout(() => (window.location.href = "dashboard.html"), 1400);
      }, 1200);
    });
  }
})();
