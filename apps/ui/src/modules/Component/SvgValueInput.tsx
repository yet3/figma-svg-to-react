import { Input } from "@common/Input";
import type { ISvgValues } from "@shared/types";
import { useComponentCtx } from "./ComponentCtx";

interface IProps {
	kind: keyof ISvgValues;
}

export const SvgValueInput = (props: IProps) => {
	const ctx = useComponentCtx();

	const value = () => ctx.data.svgValues[props.kind];
	const defaultValue = () => ctx.data.svgDefaultValues[props.kind];

	const actionContent = () => {
		return Object.hasOwn(ctx.data.svgValues, props.kind) ? "Reset" : null;
	};

	const updateValue = (value: string | undefined) => {
		ctx.updateComponent({ svgValues: { [props.kind]: value } }, true);
	};

	return (
		<Input
			label={props.kind}
			labelClass="capitalize"
			placeholder={defaultValue()}
			value={value() ?? ""}
			onInput={(e) => updateValue(e.target.value)}
			actionContent={actionContent()}
			onAction={(input) => {
				updateValue(undefined);
				input.value = "";
			}}
		/>
	);
};
