export const strToComponentName = (str: string) => {
	const matches = str.trim().match(/[a-zA-Z][a-zA-Z0-9_]*/gm);
	if (!matches) return "SvgComponent";

	for (const [i, match] of matches.entries()) {
		matches[i] = match.charAt(0).toUpperCase() + match.slice(1);
	}

	return matches.join("");
};

export const isComponentNameValid = (str: string): boolean => {
	return /^[a-zA-Z][a-zA-Z0-9_]*$/gm.test(str);
};
