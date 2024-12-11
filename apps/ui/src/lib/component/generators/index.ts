import { FrameworkEnum, type IComponentGenerator } from "@shared/types";
import {
	REACT18_COMPONENT_GENERATOR,
	REACT_COMPONENT_GENERATOR,
	REACT_NATIVE_COMPONENT_GENERATOR,
} from "./react";
import { SOLID_COMPONENT_GENERATOR } from "./solid";

export const COMPONENT_GENERATORS: Partial<
	Record<FrameworkEnum, IComponentGenerator>
> = {
	[FrameworkEnum.REACT]: REACT_COMPONENT_GENERATOR,
	[FrameworkEnum.REACT18]: REACT18_COMPONENT_GENERATOR,
	[FrameworkEnum.REACT_NATIVE]: REACT_NATIVE_COMPONENT_GENERATOR,
	[FrameworkEnum.SOLID]: SOLID_COMPONENT_GENERATOR,
};
