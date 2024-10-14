interface IProps {
	class?: string;
	value: boolean;
	onChange?: (value: boolean) => void;

	isDisabled?: boolean;
}

export const Checkbox = (props: IProps) => {
	return (
		<button
			type="button"
			onClick={props.onChange ? () => props.onChange(!props.value) : undefined}
			classList={{
				[props.class]: true,
				"size-6 rounded-sm text-xs flex items-center justify-center text-white font-medium": true,
				"bg-gray-400": props.isDisabled,
				"bg-green-400": !props.isDisabled && props.value,
				"bg-red-400": !props.isDisabled && !props.value,
			}}
		>
			{props.value ? "ON" : "OFF"}
		</button>
	);
};
