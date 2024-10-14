export const strToFileName = (_str: string) => {
	const str = _str.trim();
	if (!str) return "SvgComponent";

	const split = str.split(" ");

	for (const [i, match] of split.entries()) {
		if (i > 0) {
			split[i] = match.charAt(0).toUpperCase() + match.slice(1);
		}
	}

	return split.join("");
};

export const isFileNameValid = (str: string): boolean => {
	return /^[a-zA-Z][a-zA-Z0-9_\-]*$/gm.test(str);
};
