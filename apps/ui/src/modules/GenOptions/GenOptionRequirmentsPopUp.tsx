import { Checkbox } from "@common/Checkbox";
import { GEN_OPTIONS_METADATA } from "@shared/lib";
import type { IGenOptionDisabledData, IGenOptionMeta } from "@shared/types";
import { For, type JSXElement, createMemo } from "solid-js";

interface IProps {
	disabledData: IGenOptionDisabledData;
}

export const GenOptionRequirmentsPopUp = (props: IProps) => {
	const reasons = createMemo(() => {
		const items: JSXElement[][] = [];

		for (const reason of props.disabledData.reasons) {
			const parts = reason.split(/(<ON>|<OFF>|{[^}]+})/).filter(Boolean);
			const item: JSXElement[] = [];

			for (const part of parts) {
				if (part === "<ON>") {
					item.push(<Checkbox value={true} />);
				} else if (part === "<OFF>") {
					item.push(<Checkbox value={false} />);
				} else if (part.startsWith("{") && part.endsWith("}")) {
					const opt = GEN_OPTIONS_METADATA[part.replaceAll(/{|}/gm, "")] as
						| IGenOptionMeta
						| undefined;

					item.push(
						<div class="flex items-center justify-center rounded bg-gray-200 px-1.5 py-0.5">
							{opt ? opt.displayName : part}
						</div>,
					);
				} else {
					item.push(part);
				}
			}

			items.push(item);
		}

		return items;
	}, [props.disabledData.reasons]);

	return (
		<aside class="absolute top-0 left-0 z-10 hidden w-72 flex-col rounded-sm border border-gray-300 bg-white p-1 text-black text-sm shadow-md group-hover:flex">
			<span class="w-full text-left">Option is disabled:</span>
			<ul class="mt-1 grid gap-1 text-left">
				<For each={reasons()}>
					{(reason) => (
						<li class="flex flex-wrap items-center justify-start gap-1">
							- {reason}
						</li>
					)}
				</For>
			</ul>
		</aside>
	);
};
