export const strToComponentName = (str: string) => {
	const matches = str
		.trim()
		.replaceAll(/^[0-9]+/gm, "")
		.match(/[a-zA-Z0-9_]+/gm);

	if (!matches) return "SvgComponent";

	for (const [i, match] of matches.entries()) {
		matches[i] = match.charAt(0).toUpperCase() + match.slice(1);
	}

	return matches.join("");
};

export const isComponentNameValid = (str: string): boolean => {
	return /^[A-Z]+/gm.test(str) && /^[a-zA-Z0-9_]+$/gm.test(str);
};
