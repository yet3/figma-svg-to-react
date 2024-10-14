import { type JSX, children, splitProps } from "solid-js";

export enum ButtonVariant {
	PRIMARY = 0,
	DANGER = 1,
	SUCCESS = 2,
}

export interface IButtonProps
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	content?: JSX.Element;
	variant?: ButtonVariant;
}

export const Button = (props: IButtonProps) => {
	const [local, other] = splitProps(props, ["children", "content", "variant"]);
	const c = children(() => local.children ?? local.content);

	const isVariant = (variant: ButtonVariant) => {
		return (local.variant ?? ButtonVariant.PRIMARY) === variant;
	};

	return (
		<button
			type="button"
			{...other}
			classList={{
				...props.classList,
				[props.class]: true,
				"button-base": true,
				"button-primary": isVariant(ButtonVariant.PRIMARY),
				"button-success": isVariant(ButtonVariant.SUCCESS),
				"button-danger": isVariant(ButtonVariant.DANGER),
			}}
		>
			{c()}
		</button>
	);
};
