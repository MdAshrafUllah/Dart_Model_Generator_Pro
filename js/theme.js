/**
 * Theme management for light/dark mode
 */

const THEME_KEY = "theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

/**
 * Initialize theme based on localStorage or system preference
 */
export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  let themeToSet;

  if (saved) {
    themeToSet = saved;
  } else {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    themeToSet = systemDark ? DARK_THEME : LIGHT_THEME;
  }

  applyTheme(themeToSet);
  updateThemeIcon(themeToSet);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const targetTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

  applyTheme(targetTheme);
  localStorage.setItem(THEME_KEY, targetTheme);
  updateThemeIcon(targetTheme);
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Update theme icon based on current theme
 */
function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.textContent = theme === DARK_THEME ? "dark_mode" : "light_mode";
  }
}

/**
 * Setup system theme change listener
 */
export function setupSystemThemeListener() {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        const newTheme = e.matches ? DARK_THEME : LIGHT_THEME;
        applyTheme(newTheme);
        updateThemeIcon(newTheme);
      }
    });
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || LIGHT_THEME;
}
