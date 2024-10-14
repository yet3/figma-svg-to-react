import { For, Show } from "solid-js";
import { useComponentCtx } from "./ComponentCtx";

export const SvgTransformationInfo = () => {
	const ctx = useComponentCtx();

	const removedAttributes = () => {
		return ctx.data.svgTransformationInfo.removedAttributes;
	};
	const removedElements = () => {
		return ctx.data.svgTransformationInfo.removedElements;
	};

	return (
		<Show when={removedElements().length + removedAttributes.length > 0}>
			<div class="mt-4 grid content-start gap-y-2">
				<List label="Removed elements" items={removedElements()} />
				<List label="Removed attributes" items={removedAttributes()} />
			</div>
		</Show>
	);
};

interface IListProps {
	label: string;
	items: string[];
}

const List = (props: IListProps) => {
	return (
		<Show when={props.items.length > 0}>
			<ul class="flex flex-wrap items-center space-x-1 space-y-1">
				<li>
					<h3 class="mr-1 text-red-500">{props.label}:</h3>
				</li>

				<For each={props.items}>
					{(item) => (
						<li class="rounded-sm border border-gray-300 px-1 text-sm">
							{item}
						</li>
					)}
				</For>
			</ul>
		</Show>
	);
};
