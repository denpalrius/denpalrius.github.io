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
  // Anchor‐link jumps with navbar offset (no smooth scroll)
  // ────────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        const navbarH = document.querySelector('.navbar').offsetHeight;
        if (targetEl) {
          e.preventDefault();
          // instant jump to (element top minus navbar height)
          window.scrollTo({
            top: targetEl.offsetTop - navbarH
            // no 'behavior' property => defaults to 'auto'
          });
        }
      }
    });
  });


  // ────────────────────────────────────────────────────────────────────────────
  // CONTACT FORM SUBMISSION
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
  // GOOGLE CALENDAR SCHEDULING BUTTON
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

  // ────────────────────────────────────────────────────────────────────────────
  // FOOTER YEAR AUTO-FILL
  // ────────────────────────────────────────────────────────────────────────────
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // RESUME MODAL POPUP
  // ────────────────────────────────────────────────────────────────────────────
  const resumeBtn = document.getElementById("resume-btn");
  const resumeModal = document.getElementById("resume-modal");
  const resumeModalClose = document.getElementById("resume-modal-close");

  if (resumeBtn && resumeModal && resumeModalClose) {
    resumeBtn.addEventListener("click", () => {
      resumeModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
    resumeModalClose.addEventListener("click", () => {
      resumeModal.classList.add("hidden");
      document.body.style.overflow = "";
      resumeBtn.focus();
    });
  }
});
