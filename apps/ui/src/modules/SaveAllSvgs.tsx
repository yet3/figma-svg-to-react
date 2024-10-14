import { ActionButton } from "@common/ActionButton";
import { LabeldContainer } from "@common/LabeldContainer";
import { saveComponentsAsFiles } from "@lib";
import { useAppCtx } from "src/AppCtx";

export const SaveAllSvgs = () => {
	const appCtx = useAppCtx();

	return (
		<LabeldContainer>
			<ActionButton
				class="w-full"
				content="Save all SVGs as files"
				onAction={async () => {
					await saveComponentsAsFiles({
						components: appCtx.components,
						framework: appCtx.selectedFramework(),
						genOptions: appCtx.genOptions,
					});
				}}
			/>
		</LabeldContainer>
	);
};
