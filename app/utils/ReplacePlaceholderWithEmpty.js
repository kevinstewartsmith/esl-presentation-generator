export function replacePlaceholderWithEmpty(obj, placeholder = "__EMPTY__") {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      item === placeholder ? "" : replacePlaceholderWithEmpty(item, placeholder)
    );
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value === placeholder) {
        acc[key] = "";
      } else {
        acc[key] = replacePlaceholderWithEmpty(value, placeholder);
      }
      return acc;
    }, {});
  } else {
    return obj === placeholder ? "" : obj;
  }
}
