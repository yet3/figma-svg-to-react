import type {
	FrameworkEnum,
	IComponent,
	IGenOptions,
	IOriginalSvgs,
} from "@shared/types";
import {
	type Accessor,
	type ParentProps,
	type Setter,
	createContext,
	splitProps,
	useContext,
} from "solid-js";

interface IAppCtx {
	originalSvgs: IOriginalSvgs;
	selectedFramework: Accessor<FrameworkEnum>;
	genOptions: IGenOptions;
	components: IComponent[];
	setSelectedFramework: Setter<FrameworkEnum>;
}

const AppCtx = createContext<IAppCtx>();

type IProps = ParentProps<IAppCtx>;

export const AppCtxProvider = (props: IProps) => {
	const [local, others] = splitProps(props, ["children"]);
	return <AppCtx.Provider value={others}>{local.children}</AppCtx.Provider>;
};

export const useAppCtx = () => {
	const ctx = useContext(AppCtx);
	if (!ctx) {
		throw Error("useAppCtx: AppCtx is not defined");
	}
	return ctx;
};
