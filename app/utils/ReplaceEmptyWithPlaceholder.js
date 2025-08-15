export function replaceEmptyWithPlaceholder(obj, placeholder = "__EMPTY__") {
  if (Array.isArray(obj)) {
    // Replace empty array with placeholder
    if (obj.length === 0) return placeholder;
    return obj.map((item) =>
      item === "" ||
      item === null ||
      item === undefined ||
      (Array.isArray(item) && item.length === 0) ||
      (typeof item === "object" &&
        item !== null &&
        Object.keys(item).length === 0)
        ? placeholder
        : replaceEmptyWithPlaceholder(item, placeholder)
    );
  } else if (obj && typeof obj === "object") {
    // Replace empty object with placeholder
    if (Object.keys(obj).length === 0) return placeholder;
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          value !== null &&
          Object.keys(value).length === 0)
      ) {
        acc[key] = placeholder;
      } else {
        acc[key] = replaceEmptyWithPlaceholder(value, placeholder);
      }
      return acc;
    }, {});
  } else {
    // Replace empty string, null, or undefined with placeholder
    return obj === "" || obj === null || obj === undefined ? placeholder : obj;
  }
}
