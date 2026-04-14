/**
 * Clipboard operations management
 */

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

/**
 * Copy with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} iconElement - Icon element for feedback
 */
export async function copyWithFeedback(text, iconElement) {
  const success = await copyToClipboard(text);

  if (success && iconElement) {
    showCopySuccess(iconElement);
  }

  return success;
}

/**
 * Show success feedback on copy button
 * @param {HTMLElement} iconElement - Icon element
 */
function showCopySuccess(iconElement) {
  const originalText = iconElement.textContent;
  const originalColor = iconElement.style.color;

  iconElement.textContent = "check_circle";
  iconElement.style.color = "#10b981";

  setTimeout(() => {
    iconElement.textContent = originalText;
    iconElement.style.color = originalColor;
  }, 1000);
}

/**
 * Show copy button when content is available
 * @param {boolean} hasContent - Whether content is available
 */
export function toggleCopyButton(hasContent) {
  const btn = document.getElementById("copyBtn");
  if (btn) {
    btn.style.display = hasContent ? "block" : "none";
  }
}
