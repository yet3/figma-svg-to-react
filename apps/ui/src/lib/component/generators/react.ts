import { FrameworkEnum } from "@shared/types";
import { makeJsxComponentGenerator } from "./jsx";

export const REACT18_COMPONENT_GENERATOR = makeJsxComponentGenerator(
	FrameworkEnum.REACT18,
);

export const REACT_COMPONENT_GENERATOR = makeJsxComponentGenerator(
	FrameworkEnum.REACT,
);

export const REACT_NATIVE_COMPONENT_GENERATOR = makeJsxComponentGenerator(
	FrameworkEnum.REACT_NATIVE,
);
