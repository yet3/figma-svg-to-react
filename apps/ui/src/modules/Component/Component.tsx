import { LabeldContainer } from "@common/LabeldContainer";
import { Highlight, Language } from "solid-highlight";
import "prismjs/themes/prism.min.css";
import "prismjs/components/prism-jsx.min.js";
import "prismjs/components/prism-tsx.min.js";
import { Spinner } from "@common/Spinner";
import {
	ComponentStatus,
	type DeepPartial,
	type IComponent,
} from "@shared/types";
import { Match, Show, Switch, createSignal } from "solid-js";
import { useAppCtx } from "src/AppCtx";
import { ComponentActions } from "./Actions";
import { ComponentCtxProvider } from "./ComponentCtx";
import { ComponentInputs } from "./Inputs";
import { SvgTransformationInfo } from "./SvgTransformationInfo";

export interface ICompnentProps {
	data: IComponent;
	updateComponent: (
		comp: DeepPartial<IComponent>,
		regenreate?: boolean,
	) => void;
}

export const Component = (props: ICompnentProps) => {
	const appCtx = useAppCtx();
	const [isCodeShown, setIsCodeShown] = createSignal(false);

	const data = () => props.data;

	const originalSvg = () => {
		return appCtx.originalSvgs[data().svgId];
	};

	const isStatus = (status: ComponentStatus) => {
		return status === data().status;
	};

	return (
		<ComponentCtxProvider data={data()} updateComponent={props.updateComponent}>
			<li>
				<LabeldContainer label={originalSvg().nodeName} class="relative">
					<Show
						when={
							isStatus(ComponentStatus.GENERATING) ||
							isStatus(ComponentStatus.ERROR)
						}
					>
						<div
							classList={{
								"absolute inset-0 w-full h-full z-10 backdrop-blur-md flex items-center justify-center flex-col": true,
								"bg-blue-500/10": isStatus(ComponentStatus.GENERATING),
								"bg-red-500/10": isStatus(ComponentStatus.ERROR),
							}}
						>
							<Switch>
								<Match when={isStatus(ComponentStatus.GENERATING)}>
									<Spinner size="48px" thickness="6px" />
								</Match>
								<Match when={isStatus(ComponentStatus.ERROR)}>
									<span class="mb-1 text-2xl text-red-950">
										Error during generation
									</span>
									<span class="text-lg text-red-950">{data().genError}</span>
								</Match>
							</Switch>
						</div>
					</Show>

					<ComponentInputs />
					<ComponentActions />
					<SvgTransformationInfo />

					<LabeldContainer
						isCollapsed={isCodeShown()}
						onToggle={(v) => setIsCodeShown(v)}
						class="mt-6"
						label="Code preview"
						labelClass="z-0 text-base"
					>
						<Show when={isCodeShown() && props.data.code}>
							<Highlight
								class="!text-wrap !text-sm"
								language={Language.REACT_TSX}
							>
								{props.data.code}
							</Highlight>
						</Show>
					</LabeldContainer>
				</LabeldContainer>
			</li>
		</ComponentCtxProvider>
	);
};
