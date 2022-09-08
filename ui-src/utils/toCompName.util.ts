export const toCompName = (str: string) => {
  const arr = str.match(/[a-zA-Z0-9_]+/gm);
  if (!arr) return "SvgComponent";
  arr.forEach((t, i) => {
    if (t[0]) {
      arr[i] = t[0].toUpperCase() + t.substring(1, t.length);
    }
  });
  return arr.join("");
};
