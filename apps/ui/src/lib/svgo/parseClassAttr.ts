export const parseClassAttr = (className: string) => {
	let result = "";

	let canAddNumbers = false;
	for (let i = 0; i < className.length; i++) {
		const char = className[i];

		if (/[0-9]/.test(char)) {
			if (canAddNumbers) {
				result += char;
			}
		} else if (/[_a-zA-Z-]/.test(char)) {
			canAddNumbers = true;
			result += char;
		} else if (char !== " ") {
			result += `\\${char}`;
		}
	}

	return result;
};
