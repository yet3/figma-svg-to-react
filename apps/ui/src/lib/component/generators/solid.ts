import { FrameworkEnum } from "@shared/types";
import { makeJsxComponentGenerator } from "./jsx";

export const SOLID_COMPONENT_GENERATOR = makeJsxComponentGenerator(
	FrameworkEnum.SOLID,
);
