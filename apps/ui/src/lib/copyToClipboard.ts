export const copyToClipboard = (content: string): boolean => {
	const textEl = document.createElement("textarea");
	textEl.textContent = content;
	textEl.className = "copy-textarea";
	document.body.appendChild(textEl);
	textEl.select();

	return document.execCommand("copy");
};
