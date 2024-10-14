import { FrameworkEnum } from "@shared/types";
import { makeJsxComponentGenerator } from "./jsx";

export const REACT_COMPONENT_GENERATOR = makeJsxComponentGenerator(
	FrameworkEnum.REACT,
);

export const REACT_NATIVE_COMPONENT_GENERATOR = makeJsxComponentGenerator(
	FrameworkEnum.REACT_NATIVE,
);
