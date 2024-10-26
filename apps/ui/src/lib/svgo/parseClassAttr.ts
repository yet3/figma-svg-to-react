export const parseClassAttr = (className: string) => {
	return className.replaceAll(" ", "").replaceAll(/^[0-9]+/gm, "");
};
