/**
 * Utility functions for string manipulation and type detection
 */

/**
 * Convert string to PascalCase class name
 * @param {string} str - Input string
 * @returns {string} PascalCase string
 */
export function toClassName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 */
export function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Detect Dart type from JavaScript value
 * @param {*} value - JavaScript value
 * @param {string} key - Property key
 * @param {boolean} isNormal - Is normal class mode
 * @param {boolean} useRequired - Use required keyword
 * @returns {string} Dart type
 */
export function detectType(value, key, isNormal = false, useRequired = false) {
  let type = "dynamic";

  if (typeof value === "string") {
    type = "String";
  } else if (typeof value === "number") {
    type = Number.isInteger(value) ? "int" : "double";
  } else if (typeof value === "boolean") {
    type = "bool";
  } else if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object") {
      type = `List<${toClassName(key)}Item>`;
    } else if (value.length > 0) {
      type = `List<${detectType(value[0], key, isNormal, useRequired).replace("?", "")}>`;
    } else {
      type = "List<dynamic>";
    }
  } else if (typeof value === "object" && value !== null) {
    type = toClassName(key);
  }

  if (isNormal && useRequired) {
    return type;
  } else {
    return type + "?";
  }
}

/**
 * Validate PascalCase class name
 * @param {string} className - Class name to validate
 * @returns {Object} Validation result
 */
export function validateClassName(className) {
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;

  if (!className) {
    return { valid: false, message: "Class name cannot be empty!" };
  }

  if (!pascalCaseRegex.test(className)) {
    return {
      valid: false,
      message:
        "Invalid format! Use PascalCase (e.g., MyClassName). No spaces or special characters.",
    };
  }

  return { valid: true, message: "" };
}

/**
 * Parse JSON safely
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parse result
 */
export function safeParseJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return { success: true, data: parsed };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
