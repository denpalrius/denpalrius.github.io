document.getElementById("theme-toggle").addEventListener("click", () => {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute(
    "data-theme",
    theme === "light" ? "dark" : "light"
  );
});
