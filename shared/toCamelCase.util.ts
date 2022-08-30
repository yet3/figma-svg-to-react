export const toCamelCase = (str: string) => {
  const arr = str.match(/[a-zA-Z0-9.]+/gm);
  if (!arr) return "svgComponent";
  arr.forEach((t, i) => {
    if (t[0]) {
      if (i > 0) arr[i] = t[0].toUpperCase() + t.substring(1, t.length);
      else arr[i] = t[0].toLowerCase() + t.substring(1, t.length);
    }
  });
  return arr.join("");
};

