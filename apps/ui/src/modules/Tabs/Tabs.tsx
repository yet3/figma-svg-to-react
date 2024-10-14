import { FrameworkEnum } from "@shared/types";
import { Index, createMemo } from "solid-js";
import { Tab } from "./Tab";

export const Tabs = () => {
	const frameworks = createMemo(() => {
		return Object.values(FrameworkEnum);
	});
	return (
		<ul class="mb-2 flex h-12">
			<Index each={frameworks()}>
				{(framework) => <Tab framework={framework()} />}
			</Index>
		</ul>
	);
};
