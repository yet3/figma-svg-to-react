import { LabeldContainer } from "@common/LabeldContainer";
import { GEN_OPTIONS_METADATA } from "@shared/lib";
import type { IFrameworkGenOptions, IGenOptionsMetaKeys } from "@shared/types";
import { For } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { useAppCtx } from "src/AppCtx";
import { GenOption } from "./GenOption";

interface IProps {
	setFrameworkGenOptions: SetStoreFunction<IFrameworkGenOptions>;
}

export const GenOptions = (props: IProps) => {
	const appCtx = useAppCtx();

	return (
		<LabeldContainer label="Generation options">
			<ul class="grid grid-cols-[1fr_1fr] gap-2">
				<For each={Object.keys(GEN_OPTIONS_METADATA)}>
					{(optKey: IGenOptionsMetaKeys) => (
						<GenOption
							optionKey={optKey}
							updateGenOption={(value) => {
								props.setFrameworkGenOptions(
									appCtx.selectedFramework(),
									optKey,
									value,
								);
							}}
						/>
					)}
				</For>
			</ul>
		</LabeldContainer>
	);
};
