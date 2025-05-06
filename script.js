document.getElementById("theme-toggle").addEventListener("click", () => {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute(
    "data-theme",
    theme === "light" ? "dark" : "light"
  );
});

// Contact Form Submission

const form = document.getElementById("contact-form");
const modal = document.getElementById("form-success-modal");
const closeBtn = document.getElementById("modal-close-btn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = new FormData(form);

  try {
    const resp = await fetch("https://formspree.io/f/xyzwwokp", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (resp.ok) {
      form.reset();
      modal.classList.remove("hidden");
    } else {
      const { error } = await resp.json();
      alert(error || "Oops! Something went wrong.");
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Calendar Scheduling Button
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".appointment-btn").forEach((container) => {
    // load the Google widget
    calendar.schedulingButton.load({
      url: container.dataset.scheduleUrl,
      label: container.dataset.label,
      color: container.dataset.color,
      target: container,
    });

    // once it's injected, restyle it
    setTimeout(() => {
      // the widget appends an element *after* your container
      const btn = container.nextElementSibling;
      if (!btn) return;

      // give it your own class
      btn.classList.add("gc-appointment-button");
    }, 500);
  });
});
