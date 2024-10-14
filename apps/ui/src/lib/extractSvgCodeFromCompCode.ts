export const extractSvgCodeFromCompCode = (code: string): string => {
	const parts = /return\s*\(\s*([\s\S]*?)\s*\);/gm.exec(code);

	if (!parts) return code;

	return parts[1] ?? "";
};
