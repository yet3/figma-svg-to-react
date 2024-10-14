import { BiSolidRightArrow } from "solid-icons/bi";
import {
	type JSX,
	Match,
	type ParentProps,
	Show,
	Switch,
	children,
} from "solid-js";

type IProps = ParentProps<{
	label?: JSX.Element;
	class?: string;
	labelClass?: string;

	isCollapsed?: boolean | null;
	onToggle?: (value: boolean) => void;
}>;

export const LabeldContainer = (props: IProps) => {
	const c = children(() => props.children);

	const isCollapsible = () => props.isCollapsed != null;

	return (
		<section
			data-has-content-and-label={!!props.label && !!c()}
			classList={{
				[props.class]: true,
				"labeld-container": true,
			}}
		>
			<Show when={!!props.label}>
				<h2
					onClick={
						isCollapsible()
							? () => props.onToggle(!props.isCollapsed)
							: undefined
					}
					classList={{
						[props.labelClass]: true,
						"labeld-container-label": true,
						"cursor-pointer": isCollapsible(),
					}}
				>
					<Switch>
						<Match when={isCollapsible()}>
							<BiSolidRightArrow
								classList={{
									"mr-1": true,
									"rotate-90": props.isCollapsed,
								}}
							/>
							{props.label}
						</Match>
						<Match when={!isCollapsible()}>{props.label}</Match>
					</Switch>
				</h2>
			</Show>

			<Show when={!!c()}>
				<div class="p-2">{c()}</div>
			</Show>
		</section>
	);
};
