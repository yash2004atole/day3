

(function () {
  // "use strict";

  const form = document.getElementById("loginForm");
  if (!form) return;

  const aadhaar = document.getElementById("aadhaar");
  const password = document.getElementById("password");

  function setError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = message;
  }

  function setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  function validateAadhaar() {
    const value = aadhaar.value.trim().replace(/\s+/g, "");
    if (value === "") {
      setError(aadhaar, "Aadhaar number is required.");
      return false;
    }
    if (!/^\d{12}$/.test(value)) {
      setError(aadhaar, "Aadhaar number must be exactly 12 digits.");
      return false;
    }
    setValid(aadhaar);
    return true;
  }

  function validatePassword() {
    if (password.value.trim() === "") {
      setError(password, "Password is required.");
      return false;
    }
    if (password.value.trim().length < 4) {
      setError(password, "Password must be at least 4 characters.");
      return false;
    }
    setValid(password);
    return true;
  }

  aadhaar.addEventListener("input", validateAadhaar);
  password.addEventListener("input", validatePassword);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const aadhaarOk = validateAadhaar();
    const passwordOk = validatePassword();

    if (!aadhaarOk || !passwordOk) {
      window.RS.showToast("Please fix the highlighted fields.", "danger");
      return;
    }

    window.RS.showSpinner("Signing you in...");
    setTimeout(() => {
      window.RS.hideSpinner();
      window.RS.setSession({
        name: "Yash",
        aadhaar: aadhaar.value.trim(),
        loggedInAt: new Date().toISOString(),
        remember: document.getElementById("rememberMe")?.checked || false,
      });
      window.RS.showToast("Login successful. Redirecting...", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    }, 900);
  });
})();
