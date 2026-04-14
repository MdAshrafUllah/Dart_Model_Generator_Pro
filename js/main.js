/**
 * Main application entry point
 * Handles UI interactions and coordinates between modules
 */

import { copyWithFeedback, toggleCopyButton } from "./clipboard.js";
import { generateDartCode } from "./generator.js";
import { initTheme, setupSystemThemeListener, toggleTheme } from "./theme.js";
import { safeParseJSON, validateClassName } from "./utils.js";

// Application state
let lastOutput = "";

/**
 * Initialize the application
 */
function init() {
  initTheme();
  setupSystemThemeListener();
  setupEventListeners();
  initializeUI();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // Generate button
  document
    .getElementById("generateBtn")
    .addEventListener("click", handleGenerate);

  // Copy button
  document.getElementById("copyBtn").addEventListener("click", handleCopy);

  // Mode change
  document
    .getElementById("mode")
    .addEventListener("change", togglePrivateFieldOption);

  // JSON input auto-resize এবং error clear
  const jsonInput = document.getElementById("jsonInput");
  jsonInput.addEventListener("input", () => {
    clearError("jsonInput"); // ✅ JSON error clear হবে
    autoResizeTextarea.call(jsonInput);
  });

  // Class name validation এবং error clear
  const classNameInput = document.getElementById("className");
  classNameInput.addEventListener("input", () => {
    clearError("errorMsg"); // ✅ Class name error clear হবে
  });
}

/**
 * Initialize UI state
 */
function initializeUI() {
  togglePrivateFieldOption();
  autoResizeTextarea.call(document.getElementById("jsonInput"));
}

/**
 * Handle generate button click
 */
function handleGenerate() {
  const classNameInput = document.getElementById("className");
  const rootName = classNameInput.value.trim();

  // Validate class name
  const validation = validateClassName(rootName);
  if (!validation.valid) {
    showError(validation.message, "errorMsg");
    return;
  }

  clearError("errorMsg");

  // Parse JSON
  const jsonInput = document.getElementById("jsonInput").value.trim();
  if (!jsonInput) {
    showError("Please paste JSON data first!", "jsonInput");
    return;
  }

  clearError("jsonInput");
  const parseResult = safeParseJSON(jsonInput);

  if (!parseResult.success) {
    showError("Invalid JSON format! Please check your syntax.", "jsonInput");
    return;
  }

  // Get optional file name
  const fileNameInput = document.getElementById("fileName");
  const fileName = fileNameInput.value.trim();

  // Generate code
  const mode = document.getElementById("mode").value;
  lastOutput = generateDartCode(rootName, parseResult.data, mode, fileName);

  // Display output
  document.getElementById("output").textContent = lastOutput;
  toggleCopyButton(lastOutput.trim() !== "");
}

/**
 * Handle copy button click
 */
async function handleCopy() {
  const icon = document.getElementById("copyIcon");
  await copyWithFeedback(lastOutput, icon);
}

/**
 * Toggle private field option based on mode
 */
function togglePrivateFieldOption() {
  const mode = document.getElementById("mode").value;
  const privateContainer = document.getElementById("privateFieldContainer");
  const requiredContainer = document.getElementById("requiredFieldContainer");
  const fileNameContainer = document.getElementById("fileNameContainer");

  if (mode === "normal") {
    privateContainer.style.display = "flex";
    requiredContainer.style.display = "flex";
    fileNameContainer.style.display = "none";
    document.getElementById("fileName").value = "";
  } else {
    privateContainer.style.display = "none";
    requiredContainer.style.display = "none";
    fileNameContainer.style.display = "block";
    document.getElementById("usePrivateFields").checked = false;
  }
}

/**
 * Auto-resize textarea based on content
 */
function autoResizeTextarea() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

/**
 * Show error message
 * @param {string} message - Error message to display
 * @param {string} targetId - ID of the error element or 'jsonInput' for JSON error
 */
function showError(message, targetId) {
  if (targetId === "jsonInput") {
    // JSON input error - temporary visual feedback
    const jsonInput = document.getElementById("jsonInput");
    jsonInput.style.borderColor = "#ef4444";

    // Create temporary error message near JSON input
    const tempError = document.createElement("div");
    tempError.className = "temp-json-error";
    tempError.style.color = "#ef4444";
    tempError.style.fontSize = "12px";
    tempError.style.marginTop = "-10px";
    tempError.style.marginBottom = "10px";
    tempError.textContent = `❌ ${message}`;

    // Remove existing temp error
    const existingError = document.querySelector(".temp-json-error");
    if (existingError) existingError.remove();

    jsonInput.parentNode.insertBefore(tempError, jsonInput.nextSibling);
  } else {
    // Class name error
    const errorMsg = document.getElementById(targetId);
    const targetInput = document.getElementById("className");

    errorMsg.textContent = message;
    errorMsg.style.display = "block";
    targetInput.style.borderColor = "#ef4444";
  }
}

/**
 * Clear error message
 * @param {string} targetId - ID of the error element or 'jsonInput' for JSON
 */
function clearError(targetId) {
  if (targetId === "jsonInput") {
    const jsonInput = document.getElementById("jsonInput");
    jsonInput.style.borderColor = "var(--border)";

    // Remove temp error if exists
    const tempError = document.querySelector(".temp-json-error");
    if (tempError) tempError.remove();
  } else {
    const errorMsg = document.getElementById(targetId);
    const targetInput = document.getElementById("className");

    errorMsg.style.display = "none";
    targetInput.style.borderColor = "var(--border)";
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);
