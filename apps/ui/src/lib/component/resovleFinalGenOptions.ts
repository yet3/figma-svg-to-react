import { GEN_OPTIONS_METADATA } from "@shared/lib";
import type {
	FrameworkEnum,
	IGenOptions,
	IGenOptionsMetaKeys,
} from "@shared/types";

interface IOpts {
	genOptions: IGenOptions;
	framework: FrameworkEnum;
}

export const resolveFinalGenOptions = ({
	genOptions: currentGenOptions,
	framework,
}: IOpts): IGenOptions => {
	const genOptions: Partial<IGenOptions> = {};

	for (const _optKey in GEN_OPTIONS_METADATA) {
		const optKey = _optKey as IGenOptionsMetaKeys;
		const meta = GEN_OPTIONS_METADATA[optKey];

		genOptions[optKey] = false;

		if (currentGenOptions[optKey]) {
			if (meta.frameworks.includes(framework)) {
				if (
					!meta.disabledWhen ||
					!meta.disabledWhen({ genOptions: currentGenOptions, framework })
						.isDisabled
				) {
					genOptions[optKey] = true;
				}
			}
		}
	}

	return genOptions as IGenOptions;
};
