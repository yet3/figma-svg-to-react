import { Spinner } from "@common/Spinner";
import { GenOptions } from "@modules/GenOptions";
import { Tabs } from "@modules/Tabs";
import { makeFrameworkGenOptions, mergeFrameworkGenOptions } from "@shared/lib";
import {
	ComponentStatus,
	FrameworkEnum,
	type IFrameworkComponents,
	type IFrameworkGenOptions,
	type IOriginalSvg,
	type IOriginalSvgs,
	type IPluginMessageEvent,
	PluginMessageKind,
} from "@shared/types";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import {
	makeDefaultComponent,
	postPluginMessage,
	regenerateComponent,
} from "@lib";
import { ComponentsList } from "@modules/ComponentsList";
import { SaveAllSvgs } from "@modules/SaveAllSvgs";
import { trackStore } from "@solid-primitives/deep";
import { AppCtxProvider } from "./AppCtx";

export const App = () => {
	let prevSelectedFramework: FrameworkEnum | null = null;
	const [selectedFramework, setSelectedFramework] =
		createSignal<FrameworkEnum | null>(null);

	const [originalSvgs, setOriginalSvgs] = createStore<IOriginalSvgs>({});
	const [frameworkComponents, setFrameworkComponents] =
		createStore<IFrameworkComponents | null>(null);

	let prevGenOptions: IFrameworkGenOptions;
	const [frameworkGenOptions, setFrameworkGenOptions] =
		createStore<IFrameworkGenOptions>(makeFrameworkGenOptions());

	onMount(() => {
		window.onmessage = async (e: IPluginMessageEvent) => {
			if (!e.data.pluginMessage) return;

			const msg = e.data.pluginMessage;
			switch (msg.kind) {
				case PluginMessageKind.INIT: {
					const exportedSvgs = [...msg.svgs].sort();
					const decoder = new TextDecoder("utf-8");

					const tmpFrameworkGenOptions = mergeFrameworkGenOptions(
						frameworkGenOptions,
						msg.genOptions,
					);

					const tmpFrameworkSvgs: Partial<IFrameworkComponents> = {};
					for (const key of Object.values(FrameworkEnum)) {
						tmpFrameworkSvgs[key] = [];
					}

					const ogSvgs: IOriginalSvgs = {};
					const promises: Promise<void>[] = [];
					for (const svg of exportedSvgs) {
						const ogSvg: IOriginalSvg = {
							id: svg.id,
							nodeName: svg.nodeName,
							data: decoder.decode(svg.bytes),
						};
						ogSvgs[svg.id] = ogSvg;

						for (const frameworkKey in tmpFrameworkSvgs) {
							const comp = makeDefaultComponent(ogSvg);
							const compIdx = tmpFrameworkSvgs[frameworkKey].push(comp) - 1;

							if (frameworkKey === msg.framework) {
								promises.push(
									new Promise(async (resolve, reject) => {
										try {
											const regeneratedComp = await regenerateComponent({
												originalSvg: ogSvg,
												currentComponent: comp,
												genOptions: tmpFrameworkGenOptions[msg.framework],
												framework: msg.framework,
											});
											tmpFrameworkSvgs[frameworkKey][compIdx] = regeneratedComp;
											resolve();
										} catch (e) {
											tmpFrameworkSvgs[frameworkKey][compIdx].status =
												ComponentStatus.ERROR;
											tmpFrameworkSvgs[frameworkKey][compIdx].genError =
												e.toString();

											console.log(e);
											reject(e);
										}
									}),
								);
							}
						}
					}

					await Promise.allSettled(promises);

					setOriginalSvgs(ogSvgs);
					setFrameworkGenOptions(tmpFrameworkGenOptions);
					setFrameworkComponents(tmpFrameworkSvgs);
					setSelectedFramework(msg.framework);
					break;
				}
			}
		};
	});

	const regenerateAllCurrentComponents = async () => {
		const framework = selectedFramework();
		const genOptions = frameworkGenOptions[framework];

		const promises: Promise<void>[] = [];
		const components = unwrap(frameworkComponents[framework]);

		for (const i in components) {
			const comp = components[i];
			const ogSvg = originalSvgs[comp.svgId];

			setFrameworkComponents(framework, (c) => c === comp, {
				status: ComponentStatus.GENERATING,
			});

			promises.push(
				new Promise(async (resolve, reject) => {
					try {
						const regeneratedComp = await regenerateComponent({
							originalSvg: ogSvg,
							currentComponent: comp,
							genOptions: genOptions,
							framework: framework,
						});
						setFrameworkComponents(
							framework,
							(c) => c === comp,
							regeneratedComp,
						);
						resolve();
					} catch (e) {
						reject(e);
						console.log(e);
						setFrameworkComponents(framework, (c) => c === comp, {
							genError: e.toString(),
							status: ComponentStatus.ERROR,
						});
					}
				}),
			);
		}

		await Promise.allSettled(promises);
	};

	createEffect(async () => {
		const framework = selectedFramework();
		if (!framework) {
			return;
		}

		trackStore(frameworkGenOptions);

		if (framework !== prevSelectedFramework) {
			postPluginMessage({
				kind: PluginMessageKind.SAVE_SELECTED_FRAMEWORK,
				framework: framework,
			});
		}

		if (prevGenOptions == null) {
			prevGenOptions = structuredClone(unwrap(frameworkGenOptions));
			return;
		}

		let hasAnyOptionChanged =
			prevGenOptions == null || framework !== prevSelectedFramework;

		if (!hasAnyOptionChanged) {
			for (const key in frameworkGenOptions[framework]) {
				const newVal = frameworkGenOptions[framework][key];
				const oldVal = prevGenOptions[framework][key];
				if (newVal !== oldVal) {
					hasAnyOptionChanged = true;
					break;
				}
			}
		}

		if (hasAnyOptionChanged) {
			regenerateAllCurrentComponents();
		}

		postPluginMessage({
			kind: PluginMessageKind.SAVE_GEN_OPTIONS,
			genOptions: unwrap(frameworkGenOptions),
		});

		prevSelectedFramework = framework;
		prevGenOptions = structuredClone(unwrap(frameworkGenOptions));
	});

	const isLoading = () => {
		return selectedFramework() == null || !frameworkComponents;
	};

	return (
		<>
			<Show when={isLoading()}>
				<div class="flex h-screen w-screen flex-col items-center justify-center space-y-1">
					<Spinner size="36px" />
					<h2 class="text-xl">Loading svgs</h2>
				</div>
			</Show>

			<Show when={!isLoading()}>
				<AppCtxProvider
					originalSvgs={originalSvgs}
					components={frameworkComponents[selectedFramework()]}
					genOptions={frameworkGenOptions[selectedFramework()]}
					selectedFramework={selectedFramework}
					setSelectedFramework={setSelectedFramework}
				>
					<Tabs />
					<main class="p-2">
						<GenOptions setFrameworkGenOptions={setFrameworkGenOptions} />
						<SaveAllSvgs />
						<ComponentsList setFrameworkComponents={setFrameworkComponents} />
					</main>
				</AppCtxProvider>
			</Show>
		</>
	);
};
