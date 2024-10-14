import {
	type ParentProps,
	createContext,
	splitProps,
	useContext,
} from "solid-js";
import type { ICompnentProps } from "./Component";

export interface IComponentCtx extends ICompnentProps {}

export const ComponentCtx = createContext<IComponentCtx>();

type IProps = ParentProps<IComponentCtx>;

export const ComponentCtxProvider = (props: IProps) => {
	const [local, others] = splitProps(props, ["children"]);

	return (
		<ComponentCtx.Provider value={others}>
			{local.children}
		</ComponentCtx.Provider>
	);
};

export const useComponentCtx = () => {
	const ctx = useContext(ComponentCtx);
	if (!ctx) {
		throw Error("useComponentCtx: ComponentCtx is not defined");
	}
	return ctx;
};
