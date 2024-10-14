import { makeId } from "@shared/lib";
import { Show, createEffect, onMount } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

interface IProps {
	label?: string;
	placeholder?: string;
	suffix?: string;
	errors?: string | null;

	labelClass?: string;
	topClass?: string;

	value?: string;
	defaultValue?: string;
	onInput?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>;

	actionContent?: string | null;
	onAction?: (input: HTMLInputElement) => void;
}

export const Input = (props: IProps) => {
	const id = makeId();
	let inputEl: HTMLInputElement | null = null;

	onMount(() => {
		if (props.defaultValue != null) {
			inputEl.value = props.defaultValue;
		}
	});

	const handleAction = () => {
		if (props.onAction) props.onAction(inputEl);
	};

	return (
		<div
			classList={{
				[props.topClass]: true,
				"grid grid-cols-[1fr_auto] items-center content-start": true,
			}}
		>
			<Show when={!!props.label || !!props.actionContent}>
				<div class="col-span-full flex">
					<Show when={!!props.label}>
						<label
							for={id}
							classList={{
								[props.labelClass]: true,
								"text-gray-600 font-medium text-sm": true,
							}}
						>
							{props.label}
						</label>
					</Show>
					<Show when={!!props.actionContent}>
						<button
							type="button"
							onClick={props.onAction ? handleAction : undefined}
							class="ml-auto text-blue-500 text-sm"
						>
							{props.actionContent}
						</button>
					</Show>
				</div>
			</Show>
			<input
				id={id}
				ref={(el) => {
					inputEl = el;
				}}
				placeholder={props.placeholder}
				value={props.value}
				onInput={props.onInput}
				classList={{
					peer: true,
					"rounded-l-sm w-full p-1 border border-gray-300": true,
					"focus:border-blue-400 outline-none": true,
					"rounded-r-sm": !props.suffix,
				}}
			/>
			<Show when={!!props.suffix}>
				<div
					classList={{
						"h-full rounded-r-sm py-1 px-2 border border-l-0 border-gray-300 bg-gray-100": true,
						"peer-focus:border-blue-400": true,
					}}
				>
					{props.suffix}
				</div>
			</Show>
			<Show when={!!props.errors}>
				<div class="col-span-full text-red-400 text-sm">{props.errors}</div>
			</Show>
		</div>
	);
};
