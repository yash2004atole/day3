(function () {
  "use strict";

  const form = document.getElementById("complaintForm");
  if (!form) return;

  const subject = document.getElementById("complaintSubject");
  const description = document.getElementById("complaintDescription");

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

  function validateSubject() {
    if (subject.value.trim() === "") {
      setError(subject, "Please enter a subject for your complaint.");
      return false;
    }
    setValid(subject);
    return true;
  }
  function validateDescription() {
    if (description.value.trim().length < 15) {
      setError(description, "Please describe your complaint in at least 15 characters.");
      return false;
    }
    setValid(description);
    return true;
  }

  subject.addEventListener("input", validateSubject);
  description.addEventListener("input", validateDescription);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok1 = validateSubject();
    const ok2 = validateDescription();
    if (!ok1 || !ok2) {
      window.RS.showToast("Please complete all required fields.", "danger");
      return;
    }
    window.RS.showSpinner("Submitting your complaint...");
    setTimeout(() => {
      window.RS.hideSpinner();
      const ticket = "RS" + Math.floor(100000 + Math.random() * 900000);
      const confirmBox = document.getElementById("complaintConfirmation");
      if (confirmBox) {
        confirmBox.classList.remove("d-none");
        confirmBox.querySelector(".js-ticket-id").textContent = ticket;
      }
      window.RS.showToast(`Complaint submitted. Ticket #${ticket}`, "success");
      form.reset();
      form.querySelectorAll(".is-valid").forEach((el) => el.classList.remove("is-valid"));
    }, 900);
  });
})();
