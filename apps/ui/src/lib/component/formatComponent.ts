import { FrameworkEnum } from "@shared/types";
import estreePlugin from "prettier/plugins/estree";
import htmlPlugin from "prettier/plugins/html";
import tsPlugin from "prettier/plugins/typescript";
import { format } from "prettier/standalone";
import { figmaNotifyError } from "../figmaNotify";

export const formatComponent = async (
	data: string,
	framework: FrameworkEnum,
): Promise<string> => {
	try {
		const formatted = await format(data, {
			printWidth: 80,
			parser: framework === FrameworkEnum.SVG ? "html" : "typescript",
			jsxSingleQuote: false,
			singleQuote: false,
			semi: true,
			plugins: [estreePlugin, htmlPlugin, tsPlugin],
		});
		return formatted;
	} catch (e) {
		console.log(e);
		figmaNotifyError("Formatting code", e);
	}

	return data;
};
