import { expect } from "vitest";

interface IOpts {
	code: string;
	from: string;
	default?: string;
	named?: string[];
}

export const testJsxImports = (opts: IOpts) => {
	const parts: string[] = ["import\\s*"];
	if (opts.default) {
		parts.push(`\\b${opts.default}\\b,\\s*`);
	}

	if (opts.named && opts.named.length > 0) {
		let named = "";
		for (const name of opts.named) {
			named += `(?=.*\\b${name}\\b)`;
		}
		parts.push(`\\{${named}.*\\}\\s*`);
	}

	parts.push(`from\\s*['"]${opts.from}['"]`);

	expect(opts.code).match(
		new RegExp(parts.join(""), "gm"),
		`should import [ default: ${opts.default ?? "none"}, named: [${opts.named.join(", ")}] ] from ${opts.from}\n`,
	);
};
