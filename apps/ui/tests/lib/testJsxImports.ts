import { expect } from "vitest";

interface IOpts {
	code: string;
	from: string;
	default?: string;
	named?: Array<string | { name: string; asType?: boolean }>;
}

export const testJsxImports = (opts: IOpts) => {
	const importLines = opts.code.match(
		new RegExp(`(?<=import)(.*?)(?=from\\s+"${opts.from}";)`, "gm"),
	);

	const namedToImport: string[] = [];
	for (const imp of opts.named ?? []) {
		let name = "";
		if (typeof imp === "object") {
			if (imp.asType) name = "type ";
			name += imp.name;
		} else name = imp;
		namedToImport.push(name);
	}

	const hasNamed = namedToImport.length > 0;
	for (let line of importLines) {
		line = line.trim();

		if (opts.default) {
			expect(
				line.startsWith(opts.default + (hasNamed ? "," : "")),
				`Should have default import "${opts.default}" from "${opts.from}"`,
			).toBe(true);
		}

		const lineNamedMatch = line.match(/(?<=\{)(.*?)(?=\})/gm);
		const importedNamed: string[] = [];
		if (lineNamedMatch) {
			let lineNamed = lineNamedMatch[0] ?? "";
			lineNamed = lineNamed.trim();
			const split = lineNamed.split(",");

			for (const named of split) {
				importedNamed.push(named.trim());
			}
		}

		expect(importedNamed.sort()).toEqual(namedToImport.sort());
	}
};
