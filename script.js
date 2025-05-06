document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────────────────
  // 1) NAVBAR & THEME TOGGLE
  // ────────────────────────────────────────────────────────────────────────────
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const themeBtn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  const initial = saved === "dark" ? "dark" : "light";

  // Initialize theme
  document.body.dataset.theme = initial;

  // Hamburger menu toggle (mobile)
  if (toggle && navbar) {
    toggle.addEventListener("click", () => {
      navbar.classList.toggle("open");
    });
  }

  // Theme switcher
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = document.body.dataset.theme === "light" ? "dark" : "light";
      document.body.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 2) FOOTER YEAR AUTO-FILL
  // ────────────────────────────────────────────────────────────────────────────
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 3) CONTACT FORM SUBMISSION
  // ────────────────────────────────────────────────────────────────────────────
  const form = document.getElementById("contact-form");
  const modal = document.getElementById("form-success-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  if (form && modal && closeBtn) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const resp = await fetch("https://formspree.io/f/xyzwwokp", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (resp.ok) {
          form.reset();
          modal.classList.remove("hidden");
        } else {
          const data = await resp.json().catch(() => ({}));
          alert(data.error || "Oops! Something went wrong.");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 4) GOOGLE CALENDAR SCHEDULING BUTTON
  // ────────────────────────────────────────────────────────────────────────────
  document.querySelectorAll(".appointment-btn").forEach((container) => {
    if (window.calendar && calendar.schedulingButton) {
      try {
        calendar.schedulingButton.load({
          url: container.dataset.scheduleUrl,
          label: container.dataset.label,
          color: container.dataset.color,
          target: container,
        });
      } catch (err) {
        console.error("Calendar widget failed to load:", err);
      }
      // Poll until injected button appears, then restyle
      (function restyle() {
        const btn = container.nextElementSibling;
        if (btn && btn.classList) {
          btn.classList.add("gc-appointment-button");
        } else {
          setTimeout(restyle, 200);
        }
      })();
    }
  });
});
