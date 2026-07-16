(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Active nav link ---------- */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".rs-navbar .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });

  /* ---------- Dark mode ---------- */
  const darkToggleBtns = document.querySelectorAll(".dark-toggle");
  const applyDarkMode = (on) => {
    document.body.classList.toggle("dark-mode", on);
    darkToggleBtns.forEach((btn) => {
      btn.innerHTML = on ? "☀️" : "🌙";
    });
  };
  const savedMode = localStorage.getItem("rs_dark_mode") === "1";
  applyDarkMode(savedMode);
  darkToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("dark-mode");
      applyDarkMode(isDark);
      localStorage.setItem("rs_dark_mode", isDark ? "1" : "0");
    });
  });

  /* ---------- Toast helper ----------
     window.RS.showToast("Message", "success" | "danger" | "warning" | "primary")
  */
  function showToast(message, type = "success") {
    const wrap = document.createElement("div");
    wrap.className = "toast-rs toast align-items-center text-bg-" + type + " border-0 show";
    wrap.setAttribute("role", "alert");
    wrap.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
      </div>`;
    document.body.appendChild(wrap);
    wrap.querySelector(".btn-close").addEventListener("click", () => wrap.remove());
    setTimeout(() => wrap.remove(), 3500);
  }

  /* ---------- Spinner helper ----------
     window.RS.showSpinner("Loading...")
     window.RS.hideSpinner()
  */
  let spinnerEl = null;
  function showSpinner(message = "Please wait...") {
    if (spinnerEl) return;
    spinnerEl = document.createElement("div");
    spinnerEl.className = "spinner-overlay";
    spinnerEl.innerHTML = `<div class="spinner-border" role="status"></div><p>${message}</p>`;
    document.body.appendChild(spinnerEl);
  }
  function hideSpinner() {
    if (spinnerEl) {
      spinnerEl.remove();
      spinnerEl = null;
    }
  }

  /* ---------- Demo session helper (frontend only) ---------- */
  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("rs_session") || "null");
    } catch (e) {
      return null;
    }
  }
  function setSession(data) {
    localStorage.setItem("rs_session", JSON.stringify(data));
  }
  function clearSession() {
    localStorage.removeItem("rs_session");
  }

  /* ---------- Logout buttons ---------- */
  document.querySelectorAll(".js-logout").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      clearSession();
      showToast("You have been logged out.", "primary");
      setTimeout(() => (window.location.href = "login.html"), 700);
    });
  });

  /* Expose small public API */
  window.RS = {
    showToast,
    showSpinner,
    hideSpinner,
    getSession,
    setSession,
    clearSession,
  };
})();
