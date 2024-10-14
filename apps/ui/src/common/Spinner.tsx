interface IProps {
	class?: string;
	size?: string;
	thickness?: string;
}

export const Spinner = (props: IProps) => {
	return (
		<div
			classList={{ spinner: true, [props.class]: true }}
			style={{
				"border-width": props.thickness,
				width: props.size,
				height: props.size,
			}}
		/>
	);
};
