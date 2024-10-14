import { mergeComponents, regenerateComponent } from "@lib";
import type { IFrameworkComponents } from "@shared/types";
import { For } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import { useAppCtx } from "src/AppCtx";
import { Component } from "./Component";

interface IProps {
	setFrameworkComponents: SetStoreFunction<IFrameworkComponents>;
}

export const ComponentsList = (props: IProps) => {
	const appCtx = useAppCtx();

	return (
		<ul class="grid w-full list-none grid-cols-1 gap-4">
			<For each={appCtx.components}>
				{(comp) => (
					<Component
						data={comp}
						updateComponent={async (changes, regenerate) => {
							const framework = appCtx.selectedFramework();
							let newComp = mergeComponents(comp, changes);

							if (regenerate) {
								newComp = await regenerateComponent({
									originalSvg: appCtx.originalSvgs[newComp.svgId],
									currentComponent: newComp,
									genOptions: appCtx.genOptions,
									framework,
								});
							}

							props.setFrameworkComponents(
								framework,
								(c) => c.svgId === comp.svgId,
								newComp,
							);
						}}
					/>
				)}
			</For>
		</ul>
	);
};
