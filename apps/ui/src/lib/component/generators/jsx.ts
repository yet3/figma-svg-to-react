import { SVG_PLACEHOLDERS } from "@lib";
import { REACT_FRAMEWORKS } from "@shared/lib";
import { FrameworkEnum, type IComponentGenerator } from "@shared/types";

export type IJsxCompImports = Map<
	string,
	{ named: Set<string>; default?: string | null }
>;

export const makeJsxImportsMap = () => {
	const importsMap: IJsxCompImports = new Map();

	type INamedImport = string | { name: string; asType?: boolean };
	const namedImportToString = (imp: INamedImport): string => {
		let name = "";
		if (typeof imp === "object") {
			if (imp.asType) {
				name = "type ";
			}
			name += imp.name;
		} else name = imp;
		return name;
	};

	return {
		importsMap,
		importsToString: () => {
			const imports: string[] = [];
			if (importsMap.size > 0) {
				for (const [from, toImport] of importsMap) {
					let defaultImport = "";
					if (toImport.default) {
						defaultImport = `${toImport.default}, `;
					}
					if (toImport.named.size > 0) {
						imports.push(
							`import ${defaultImport}{ ${[...toImport.named].join(",")} } from "${from}";`,
						);
					}
				}
			}
			return imports.join("\n");
		},
		addImport: (
			from: string,
			data: {
				named?: INamedImport[];
				default?: string;
			},
		) => {
			if (importsMap.has(from)) {
				const current = importsMap.get(from);
				if (data.default) {
					current.default = data.default;
				}

				if (data.named) {
					for (const imp of data.named) {
						current.named.add(namedImportToString(imp));
					}
				}
			} else {
				importsMap.set(from, {
					named: new Set(data.named.map(namedImportToString)),
					default: data.default,
				});
			}
		},
	};
};

export const makeJsxComponentGenerator = (
	framework: FrameworkEnum,
): IComponentGenerator => {
	return async (data) => {
		const { svgTransformationInfo, genOptions, componentName } = data;
		let svgCode = data.svgCode;
		const { importsToString, addImport } = makeJsxImportsMap();

		const replacePlaceholder = (placeholder: string, value: string) => {
			svgCode = svgCode.replace(new RegExp(`${placeholder}=""`, "gm"), value);
		};

		let reactImport = "";
		if (REACT_FRAMEWORKS.includes(framework)) {
			if (genOptions.importAllAsReact) {
				reactImport = "import * as React from 'react';";
			}

			if (framework === FrameworkEnum.REACT_NATIVE) {
				addImport("react-native-svg", {
					default: "Svg",
					named: svgTransformationInfo.usedReactNativeElements.filter(
						(e) => e !== "Svg",
					),
				});
			}
		}

		let propsInterface = "";
		let propsType = "";
		let svgType = "";
		if (genOptions.typescript) {
			svgType = "SVGProps<SVGSVGElement>";

			switch (framework) {
				case FrameworkEnum.REACT:
					addImport("react", { named: ["SVGProps"] });
					svgType = "SVGProps<SVGSVGElement>";
					break;
				case FrameworkEnum.REACT_NATIVE:
					addImport("react-native-svg", {
						named: [{ name: "SvgProps", asType: genOptions.allowImportAsType }],
					});
					svgType = "SvgProps";
					break;
				case FrameworkEnum.SOLID:
					addImport("solid-js/jsx-runtime", { named: ["JSX"] });
					svgType = "JSX.SvgSVGAttributes<SVGSVGElement>";
					break;
			}

			if (genOptions.props) {
				propsType = `${svgType}`;

				if (genOptions.propsInterface) {
					propsInterface = `interface IProps extends ${svgType} {}`;
					propsType = "IProps";
				}
			}
		}

		if (genOptions.props && genOptions.spreadProps) {
			replacePlaceholder(SVG_PLACEHOLDERS.ATTRS.SPREAD_PROPS, "{...props}");
		}

		let funcStart = "";
		let funcEnd = "";

		let afterProp = "";
		if (propsType.length > 0) {
			afterProp = `: ${propsType}`;
		}

		if (genOptions.forwardRef) {
			if (framework === FrameworkEnum.SOLID) {
				replacePlaceholder(SVG_PLACEHOLDERS.ATTRS.REF, "ref={props.ref}");
			} else if (REACT_FRAMEWORKS.includes(framework)) {
				addImport("react", { named: ["forwardRef"] });
				afterProp = "";

				funcStart = "forwardRef";

				if (genOptions.typescript) {
					funcStart += `<SVGSVGElement, ${propsType}>`;
				}

				funcStart += "(";
				funcEnd = ")";

				replacePlaceholder(SVG_PLACEHOLDERS.ATTRS.REF, "ref={ref}");

				if (!genOptions.props) afterProp += "_";
				afterProp += ", ref";
			}
		}

		return {
			code: `
        ${reactImport}
        ${importsToString()}

        ${propsInterface}

        ${genOptions.namedExport ? "export" : ""} const ${componentName} = ${funcStart}(${genOptions.props ? "props" : ""}${afterProp}) => {
          return (
            ${svgCode}
          ) 
        }${funcEnd};

        ${!genOptions.namedExport ? `export default ${componentName};` : ""}
        `.trim(),
		};
	};
};
