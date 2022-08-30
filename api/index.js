const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const { transform } = require("@svgr/core");

require("@svgr/plugin-svgo")
require("@svgr/plugin-jsx")
require("@svgr/plugin-prettier")

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// server svg
// {
// id: string;
// compName: string
// nodeName: string;
// typescript: boolean
// includeImportReact: boolean
// asIcon: boolean
// forReactNative: boolean
// forwardRef: boolean
// propsInterface: boolean
// withProps: boolean
// withViewbox: boolean
// }

app.post("/", async (req, res) => {
  const { svgs, options } = req.body;

  try {
    const promises = [];

    const {
      includeImportReact,
      asIcon,
      forReactNative,
      namedExport,
      withProps,
      withViewbox,
      typescript,
      forwardRef,
      propsInterface,
    } = options;

    svgs.forEach((svg) => {
      promises.push(
        new Promise(async (resolve) => {
          const code = String.fromCharCode(...svg.bytes);
          let data = await transform(
            code,
            {
              jsxRuntime: includeImportReact ? "classic" : "automatic",
              icon: asIcon,
              native: forReactNative,
              typescript: typescript,
              exportType: namedExport ? "named" : "default",
              namedExport: 'COMP_NAME',
              expandProps: withProps ? "end" : false,
              ref: forwardRef,
              prettier: true,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "removeViewBox",
                    active: !withViewbox,
                  },
                ],
              },
              template: (variables, { tpl }) => {
                return tpl`
          ${variables.imports};
          ${variables.interfaces};

          const ${variables.componentName} = ([props]) => (
            ${variables.jsx}
          );
           
          ${variables.exports};
        `;
              },
              plugins: [
                "@svgr/plugin-svgo",
                "@svgr/plugin-jsx",
                "@svgr/plugin-prettier",
              ],
            },
            { componentName: 'COMP_NAME' }
          );

          let interfacesStr = "";
          let typesPrefix = "";
          let propsArg = "";
          let propsType = "";

          if (withProps) {
            if (typescript) {
              if (!includeImportReact) {
                // data = `import { SVGProps } from 'react';\n` + data;
              }

              propsArg = "props";
              if (propsInterface) {
                interfacesStr += `\ninterface Props extends SVGProps<SVGSVGElement> {\n\n}\n`;

                propsType = "Props";
              } else propsType = `SVGProps<SVGSVGElement>`;
            } else {
              propsArg = "props";
            }
          } else {
            propsArg = "";
            propsType = "";
          }

          if (withProps) {
            if (forwardRef) {
              data = data.replace("([props])", `(props, ref)`);
              if (propsType) {
                data = data.replace(
                  "forwardRef(",
                  `forwardRef<SVGSVGElement, ${propsType}>(`
                );
              } else
                data = data.replace(
                  "forwardRef(",
                  `forwardRef<SVGSVGElement>(`
                );
            } else {
              if (propsType) {
                data = data.replace("([props])", `(${propsArg}: ${propsType})`);
              } else data = data.replace("([props])", `(${propsArg})`);
            }
          } else if (forwardRef) {
            data = data.replace("([props])", `(_, ref)`);
            if (typescript) {
              data = data.replace("forwardRef(", `forwardRef<SVGSVGElement>(`);
            }
          } else data = data.replace("([props])", `(props)`);
          // data = data.replace("[interfaces];", interfacesStr);

          const split = data.split("\n");
          if (interfacesStr) {
            for (let i = 0; i < split.length; i++) {
              const line = split[i];
              if (line === "") {
                split[i] = interfacesStr;
                break;
              } else if (i === 0 && line.includes("const")) {
                data = interfacesStr + data;
                break;
              }
            }
          }

          resolve({
            id: svg.id,
            compName: svg.compName,
            data: split.join("\n"),
          });
        })
      );
    });
    res.status(200).json({ svgs: (await Promise.all(promises)) ?? [] });
  } catch (e) {
    console.log("error", e);
    res.status(500).send({
      svgs: [],
      errors: "Couldn't parse SVG",
    });
  }
});

app.listen(3000);
