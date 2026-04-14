/**
 * Dart Model Generator
 * Handles generation of Dart classes from JSON
 */

import { detectType, toCamelCase, toClassName } from "./utils.js";

/**
 * Build Dart class from JSON object
 * @param {string} name - Class name
 * @param {Object} obj - JSON object
 * @param {Array} classes - Array to store generated classes
 * @param {string} mode - Generation mode
 */
export function buildClass(name, obj, classes, mode) {
  let className = toClassName(name);

  let isFreezed = mode === "freezed" || mode === "both";
  let isJson = mode === "json" || mode === "both";
  let isNormal = mode === "normal";

  let usePrivate =
    isNormal && document.getElementById("usePrivateFields").checked;
  let useRequired = isNormal && document.getElementById("useRequired").checked;

  let str = "";

  // 1. Annotations
  if (isFreezed) {
    str += `@freezed\n`;
  } else if (isJson) {
    str += `@JsonSerializable(explicitToJson: true)\n`;
  }

  // 2. Class Start
  if (isFreezed) {
    str += `abstract class ${className} with _\$${className} {\n`;
  } else {
    str += `class ${className} {\n`;
  }

  // 3. Fields
  if (!isFreezed) {
    for (let key in obj) {
      let type = detectType(obj[key], key, isNormal, useRequired);
      let dartKey = toCamelCase(key);
      let fieldName = usePrivate ? `_${dartKey}` : dartKey;
      str += `  final ${type} ${fieldName};\n`;
    }
    str += `\n`;
  }

  // 4. Constructor
  if (isFreezed) {
    str += `  const factory ${className}({\n`;
  } else {
    str += `  ${className}({\n`;
  }

  for (let key in obj) {
    let value = obj[key];
    let dartKey = toCamelCase(key);
    let type = detectType(value, key);

    let annotation =
      isJson && key !== dartKey ? `@JsonKey(name: '${key}') ` : "";

    if (isFreezed) {
      str += `    ${annotation}${type} ${dartKey},\n`;
    } else {
      let fieldRef = usePrivate ? `this._${dartKey}` : `this.${dartKey}`;
      let requiredPrefix = useRequired ? "required " : "";
      str += `    ${requiredPrefix}${fieldRef},\n`;
    }
  }

  if (isFreezed) {
    str += `  }) = _${className};\n`;
  } else {
    str += `  });\n`;
  }

  // 5. factory fromJson
  if (isFreezed || isJson) {
    str += `\n  factory ${className}.fromJson(Map<String, dynamic> json) => _\$${className}FromJson(json);\n`;
  }

  // 6. toJson (JsonSerializable)
  if (isJson && !isFreezed) {
    str += `  Map<String, dynamic> toJson() => _\$${className}ToJson(this);\n`;
  }

  // 7. Normal Dart Model Logic
  if (isNormal) {
    str += generateNormalFromJson(className, obj, usePrivate);
    str += generateNormalToJson(obj, usePrivate);
  }

  str += `}\n\n`;

  if (!classes.some((c) => c.includes(`class ${className}`))) {
    classes.push(str);
  }

  // 8. Recursive nested class generation
  generateNestedClasses(obj, classes, mode);
}

/**
 * Generate fromJson method for normal class
 */
function generateNormalFromJson(className, obj, usePrivate) {
  let str = `\n  factory ${className}.fromJson(Map<String, dynamic> json) {\n`;
  str += `    return ${className}(\n`;

  for (let key in obj) {
    let value = obj[key];
    let dartKey = toCamelCase(key);

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      str += `      ${dartKey}: json['${key}'] != null ? ${toClassName(key)}.fromJson(json['${key}']) : null,\n`;
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      str += `      ${dartKey}: json['${key}'] != null ? (json['${key}'] as List).map((e) => ${toClassName(key)}Item.fromJson(e)).toList() : null,\n`;
    } else {
      str += `      ${dartKey}: json['${key}'],\n`;
    }
  }

  str += `    );\n  }\n`;
  return str;
}

/**
 * Generate toJson method for normal class
 */
function generateNormalToJson(obj, usePrivate) {
  let str = `\n  Map<String, dynamic> toJson() {\n`;
  str += `    final Map<String, dynamic> data = <String, dynamic>{};\n`;

  for (let key in obj) {
    let value = obj[key];
    let dartKey = toCamelCase(key);
    let fieldRef = usePrivate ? `this._${dartKey}` : `this.${dartKey}`;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      str += `    if (${fieldRef} != null) data['${key}'] = ${fieldRef}!.toJson();\n`;
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      str += `    if (${fieldRef} != null) data['${key}'] = ${fieldRef}!.map((e) => e.toJson()).toList();\n`;
    } else {
      str += `    data['${key}'] = ${fieldRef};\n`;
    }
  }

  str += `    return data;\n  }\n`;
  return str;
}

/**
 * Generate nested classes recursively
 */
function generateNestedClasses(obj, classes, mode) {
  for (let key in obj) {
    let value = obj[key];
    if (typeof value === "object" && value && !Array.isArray(value)) {
      buildClass(key, value, classes, mode);
    }
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      buildClass(key + "Item", value[0], classes, mode);
    }
  }
}

/**
 * Generate imports and parts header
 */
export function generateHeader(mode, fileName = "") {
  let imports = "";
  let parts = "";

  // File name setup (remove .dart extension if user adds it)
  const baseFileName = fileName
    ? fileName.replace(/\.dart$/, "").trim()
    : "model";

  if (mode === "freezed" || mode === "both") {
    imports += `import 'package:freezed_annotation/freezed_annotation.dart';\n`;
    parts += `part '${baseFileName}.freezed.dart';\n`;
  }

  if (mode === "json" || mode === "both") {
    imports += `import 'package:json_annotation/json_annotation.dart';\n`;
    parts += `part '${baseFileName}.g.dart';\n`;
  }

  if (imports !== "") {
    return imports + "\n" + parts + "\n";
  }

  return "";
}

/**
 * Main generation function
 */
export function generateDartCode(rootName, json, mode, fileName = "") {
  let classes = [];
  let header = generateHeader(mode, fileName);

  buildClass(rootName, json, classes, mode);

  return header + classes.join("\n");
}
