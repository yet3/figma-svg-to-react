import { ActionButton } from "@common/ActionButton";
import { CopyButton } from "@common/CopyButton";
import { extractSvgCodeFromCompCode, saveComponentsAsFiles } from "@lib";
import { useAppCtx } from "src/AppCtx";
import { useComponentCtx } from "./ComponentCtx";

export const ComponentActions = () => {
	const appCtx = useAppCtx();
	const compCtx = useComponentCtx();

	return (
		<div class="mt-2 grid grid-cols-[auto_auto_auto] gap-2">
			<CopyButton
				content="Copy only svg"
				getCopyContent={() => extractSvgCodeFromCompCode(compCtx.data.code)}
			/>
			<CopyButton
				content="Copy code"
				getCopyContent={() => compCtx.data.code}
			/>
			<ActionButton
				content="Save as file"
				onAction={async () => {
					await saveComponentsAsFiles({
						components: [compCtx.data],
						framework: appCtx.selectedFramework(),
						genOptions: appCtx.genOptions,
					});
				}}
			/>
		</div>
	);
};
