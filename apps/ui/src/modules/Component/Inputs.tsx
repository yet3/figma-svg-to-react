import { Input } from "@common/Input";
import {
	isComponentNameValid,
	isFileNameValid,
	strToComponentName,
	strToFileName,
} from "@lib";
import type { OnInput } from "@shared/types";
import { createStore } from "solid-js/store";
import { useComponentCtx } from "./ComponentCtx";
import { SvgValueInput } from "./SvgValueInput";

interface IErrors {
	componentName: string | null;
	fileName: string | null;
}

export const ComponentInputs = () => {
	const compCtx = useComponentCtx();

	const [errors, setErrors] = createStore<IErrors>({
		componentName: null,
		fileName: null,
	});

	const updateFileName: OnInput = (e) => {
		const newValue = e.target.value;

		let error: string | null = null;
		if (!isFileNameValid(newValue)) {
			error = "Invalid file name";
		}
		setErrors("fileName", error);

		compCtx.updateComponent({ fileName: strToFileName(newValue) }, false);
	};

	const updateCompName: OnInput = (e) => {
		const newValue = e.target.value;

		let error: string | null = null;
		if (!isComponentNameValid(newValue)) {
			error = "Invalid component name";
		}
		setErrors("componentName", error);

		compCtx.updateComponent(
			{ componentName: strToComponentName(newValue) },
			true,
		);
	};

	return (
		<>
			<div class="grid grid-cols-[1fr_1fr] gap-2">
				<Input
					label="Component name"
					defaultValue={compCtx.data.componentName}
					onInput={updateCompName}
					errors={errors.componentName}
				/>
				<Input
					label="File name"
					value={compCtx.data.fileName}
					onInput={updateFileName}
					errors={errors.fileName}
				/>
			</div>

			<div class="mt-2 grid grid-cols-1 gap-2">
				<SvgValueInput kind="title" />
			</div>
			<div class="mt-2 grid grid-cols-[1fr_1fr_1fr] gap-2">
				<SvgValueInput kind="width" />
				<SvgValueInput kind="height" />
				<SvgValueInput kind="viewBox" />
			</div>
		</>
	);
};
