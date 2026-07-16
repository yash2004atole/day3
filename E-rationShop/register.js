
(function () {
  "use strict";

  const form = document.getElementById("registerForm");
  if (!form) return;

  const fields = {
    fullName: document.getElementById("fullName"),
    fatherName: document.getElementById("fatherName"),
    mobile: document.getElementById("mobile"),
    email: document.getElementById("email"),
    address: document.getElementById("address"),
    aadhaar: document.getElementById("aadhaar"),
    familyMembers: document.getElementById("familyMembers"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
  };

  function setError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    const fb = input.parentElement.querySelector(".invalid-feedback");
    if (fb) fb.textContent = message;
  }
  function setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }
  function required(input, label) {
    if (input.value.trim() === "") {
      setError(input, `${label} is required.`);
      return false;
    }
    setValid(input);
    return true;
  }

  function validateMobile() {
    const v = fields.mobile.value.trim();
    if (v === "") return setError(fields.mobile, "Mobile number is required."), false;
    if (!/^[6-9]\d{9}$/.test(v)) {
      setError(fields.mobile, "Enter a valid 10-digit mobile number.");
      return false;
    }
    setValid(fields.mobile);
    return true;
  }

  function validateEmail() {
    const v = fields.email.value.trim();
    if (v === "") return setError(fields.email, "Email is required."), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError(fields.email, "Enter a valid email address.");
      return false;
    }
    setValid(fields.email);
    return true;
  }

  function validateAadhaar() {
    const v = fields.aadhaar.value.trim().replace(/\s+/g, "");
    if (v === "") return setError(fields.aadhaar, "Aadhaar number is required."), false;
    if (!/^\d{12}$/.test(v)) {
      setError(fields.aadhaar, "Aadhaar number must be exactly 12 digits.");
      return false;
    }
    setValid(fields.aadhaar);
    return true;
  }

  function validateFamilyMembers() {
    const v = fields.familyMembers.value.trim();
    if (v === "") return setError(fields.familyMembers, "Number of family members is required."), false;
    if (!/^\d+$/.test(v) || Number(v) < 1 || Number(v) > 25) {
      setError(fields.familyMembers, "Enter a number between 1 and 25.");
      return false;
    }
    setValid(fields.familyMembers);
    return true;
  }

  function validatePassword() {
    const v = fields.password.value;
    if (v === "") return setError(fields.password, "Password is required."), false;
    if (v.length < 6) {
      setError(fields.password, "Password must be at least 6 characters.");
      return false;
    }
    setValid(fields.password);
    return true;
  }

  function validateConfirmPassword() {
    const v = fields.confirmPassword.value;
    if (v === "") return setError(fields.confirmPassword, "Please confirm your password."), false;
    if (v !== fields.password.value) {
      setError(fields.confirmPassword, "Passwords do not match.");
      return false;
    }
    setValid(fields.confirmPassword);
    return true;
  }

  fields.mobile.addEventListener("input", validateMobile);
  fields.email.addEventListener("input", validateEmail);
  fields.aadhaar.addEventListener("input", validateAadhaar);
  fields.familyMembers.addEventListener("input", validateFamilyMembers);
  fields.password.addEventListener("input", () => {
    validatePassword();
    if (fields.confirmPassword.value) validateConfirmPassword();
  });
  fields.confirmPassword.addEventListener("input", validateConfirmPassword);
  fields.fullName.addEventListener("input", () => required(fields.fullName, "Full name"));
  fields.fatherName.addEventListener("input", () => required(fields.fatherName, "Father's name"));
  fields.address.addEventListener("input", () => required(fields.address, "Address"));

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const checks = [
      required(fields.fullName, "Full name"),
      required(fields.fatherName, "Father's name"),
      validateMobile(),
      validateEmail(),
      required(fields.address, "Address"),
      validateAadhaar(),
      validateFamilyMembers(),
      validatePassword(),
      validateConfirmPassword(),
    ];

    if (checks.includes(false)) {
      window.RS.showToast("Please correct the errors in the form.", "danger");
      return;
    }

    window.RS.showSpinner("Creating your account...");
    setTimeout(() => {
      window.RS.hideSpinner();
      window.RS.showToast("Registration successful! You can now log in.", "success");
      form.reset();
      form.querySelectorAll(".is-valid").forEach((el) => el.classList.remove("is-valid"));
      setTimeout(() => (window.location.href = "login.html"), 1000);
    }, 1000);
  });
})();
