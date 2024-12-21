import { ReactIcon, SolidIcon, SvgIcon } from "@common/Icons";
import { FrameworkEnum } from "@shared/types";
import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useAppCtx } from "src/AppCtx";

interface IProps {
	framework: FrameworkEnum;
}

export const Tab = (props: IProps) => {
	const ctx = useAppCtx();

	const content = createMemo(() => {
		let text: string;
		let Icon: typeof ReactIcon | null = null;
		switch (props.framework) {
			case FrameworkEnum.REACT:
				Icon = ReactIcon;
				text = "React";
				break;
			case FrameworkEnum.REACT_NATIVE:
				Icon = ReactIcon;
				text = "React Native";
				break;
			case FrameworkEnum.SOLID:
				Icon = SolidIcon;
				text = "Solid";
				break;
			case FrameworkEnum.SVG:
				Icon = SvgIcon;
				text = "SVG";
				break;
		}

		return (
			<>
				<Dynamic component={Icon} height="auto" width="100%" />
				{text}
			</>
		);
	});

	return (
		<li
			classList={{
				"flex-1 border-b border-r border-r-gray-300 last-of-type:border-r-0": true,
				"bg-white border-b-white": ctx.selectedFramework() === props.framework,
				"bg-gray-100 border-b-gray-300":
					ctx.selectedFramework() !== props.framework,
			}}
		>
			<button
				type="button"
				class="grid h-full w-full cursor-pointer grid-cols-[28px_auto] place-content-center items-center gap-x-2"
				onClick={() => ctx.setSelectedFramework(props.framework)}
			>
				{content()}
			</button>
		</li>
	);
};
