import { Checkbox } from "@common/Checkbox";
import { GEN_OPTIONS_METADATA } from "@shared/lib";
import type {
	IGenOptionDisabledData,
	IGenOptionMeta,
	IGenOptionsKeys,
} from "@shared/types";
import { BiSolidLeftArrow } from "solid-icons/bi";
import { FiInfo } from "solid-icons/fi";
import { type ParentProps, Show, children } from "solid-js";
import { useAppCtx } from "src/AppCtx";
import { GenOptionRequirmentsPopUp } from "./GenOptionRequirmentsPopUp";

type IProps = ParentProps<{
	optionKey: IGenOptionsKeys;
	updateGenOption: (value: boolean) => void;
}>;

export interface IRequiredOption {
	optionKey: IGenOptionsKeys;
	value: boolean;
	meta: IGenOptionMeta;
}

export const GenOption = (props: IProps) => {
	const appCtx = useAppCtx();
	const c = children(() => props.children);

	const meta = () => {
		const optMeta = GEN_OPTIONS_METADATA[props.optionKey];
		if (optMeta == null) {
			throw Error(`Option "${props.optionKey}" metadata doesn't exist`);
		}
		return optMeta;
	};

	const value = () => {
		const optValue = appCtx.genOptions[props.optionKey];
		if (optValue == null) {
			throw Error(`Option "${props.optionKey}" doesn't exist`);
		}
		return optValue;
	};

	const disabledData = () => {
		let data: IGenOptionDisabledData = {
			isDisabled: false,
			reasons: [],
		};

		if (meta().disabledWhen) {
			data = meta().disabledWhen({
				genOptions: appCtx.genOptions,
				framework: appCtx.selectedFramework(),
			});
		}

		return data;
	};

	const isDisabled = () => disabledData().isDisabled;

	const handleClick = () => {
		if (isDisabled()) return;
		props.updateGenOption(!value());
	};

	const hasChildren = () => !!c();

	return (
		<Show when={meta().frameworks.includes(appCtx.selectedFramework())}>
			<li>
				<button
					type="button"
					onClick={handleClick}
					classList={{
						"relative flex items-center": true,
						"cursor-pointer": !isDisabled(),
						"group text-gray-400 cursor-not-allowed": isDisabled(),
						"font-medium": meta().style?.isBold,
					}}
				>
					<Checkbox
						class="mr-1"
						value={isDisabled() ? false : value()}
						isDisabled={isDisabled()}
					/>
					{meta().displayName}

					<Show when={isDisabled()}>
						<GenOptionRequirmentsPopUp disabledData={disabledData()} />
						<FiInfo class="ml-1 size-5" />
					</Show>

					<Show when={hasChildren()}>
						<BiSolidLeftArrow
							classList={{
								"fill-gray-600 transition-transform ml-2": true,
								"-rotate-90": value(),
							}}
						/>
					</Show>
				</button>

				<Show when={hasChildren() && value()}>
					<ul class="mt-2 ml-6 grid gap-2">{c()}</ul>
				</Show>
			</li>
		</Show>
	);
};
