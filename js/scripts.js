function showSection(id) {
  document.querySelectorAll("main section").forEach((sec) => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function applyTheme(mode) {
  const body = document.body;
  body.classList.remove("light", "dark");

  const icon = document.getElementById("themeIcon");

  if (mode === "auto") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    body.classList.add(prefersDark ? "dark" : "light");
    icon.textContent = "brightness_auto";
  } else {
    body.classList.add(mode);
    icon.textContent = mode === "dark" ? "dark_mode" : "light_mode";
  }
}

function setTheme(mode) {
  localStorage.setItem("theme", mode);
  applyTheme(mode);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "auto";
  document.getElementById("themeMode").value = saved;
  applyTheme(saved);
}

// Set dynamic year
document.getElementById("year").textContent = new Date().getFullYear();

// Initialize theme on page load
initTheme();
