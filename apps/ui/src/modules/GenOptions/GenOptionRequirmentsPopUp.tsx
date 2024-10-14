import { Checkbox } from "@common/Checkbox";
import { For } from "solid-js";
import type { IRequiredOption } from "./GenOption";

interface IProps {
	displayName: string;
	requiredOptions: IRequiredOption[];
}

export const GenOptionRequirmentsPopUp = (props: IProps) => {
	return (
		<aside class="absolute top-0 left-0 z-10 hidden w-64 flex-col rounded-sm border border-gray-300 bg-white p-1 text-black text-sm shadow-md group-hover:flex">
			<span class="text-left">"{props.displayName}" requires:</span>
			<ul class="mt-1 ml-2 grid gap-1 text-left">
				<For each={props.requiredOptions}>
					{(requiredOpt) => (
						<li class="flex items-center space-x-1">
							<span>{requiredOpt.meta.displayName}</span>
							<Checkbox value={requiredOpt.value} />
						</li>
					)}
				</For>
			</ul>
		</aside>
	);
};
