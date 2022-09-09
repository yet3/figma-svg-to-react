import { IOptions } from '../../api/schemas/options.schema';
import { ISvgNode } from '../../api/schemas/svg.schema';

import { transform } from '@svgr/core';
import { SvgrTemplate } from './template';
import '@svgr/plugin-svgo';
import '@svgr/plugin-jsx';
import '@svgr/plugin-prettier';

const transformSvg = async (svg: ISvgNode, options: IOptions): Promise<string | null> => {
  const { includeImportReact, asIcon, forReactNative, namedExport, withProps, withViewbox, typescript, forwardRef, propsInterface } =
    options;

  let data = '';
  try {
    const code = String.fromCharCode(...svg.bytes);
    data = await transform(
      code,
      {
        jsxRuntime: includeImportReact ? 'classic' : 'automatic',
        icon: asIcon,
        native: forReactNative,
        typescript: typescript,
        exportType: namedExport ? 'named' : 'default',
        namedExport: 'COMP_NAME',
        expandProps: withProps ? 'end' : false,
        ref: forwardRef,
        prettier: true,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'removeViewBox',
              active: !withViewbox,
            },
          ],
        },
        template: SvgrTemplate,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
      },
      { componentName: 'COMP_NAME' }
    );
  } catch (e) {
    console.log(e);
    return null;
  }

  let interfacesStr = null;
  data = data.replace('[args]', '[props][ref]');

  if (withProps) {
    if (typescript) {
      if (propsInterface) {
        interfacesStr = `\ninterface Props extends SVGProps<SVGSVGElement> {\n\n}\n`;
      }
      data = data.replace('[props]', 'props[propsType]');
    } else data = data.replace('[props]', 'props');
  } else {
    if (forwardRef) {
      data = data.replace('[props]', '_');
    } else data = data.replace('[props]', '');
  }

  if (forwardRef) {
    data = data.replace('[ref]', ', ref');

    if (typescript) {
      if (withProps) {
        if (propsInterface) {
          data = data.replace('[propsType]', '');
          data = data.replace('forwardRef(', `forwardRef<SVGSVGElement, Props>(`);
        } else {
          data = data.replace('[propsType]', '');
          data = data.replace('forwardRef(', `forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(`);
        }
      } else data = data.replace('forwardRef(', `forwardRef<SVGSVGElement>(`);
    }
  } else {
    data = data.replace('[ref]', '');

    if (propsInterface && interfacesStr) {
      data = data.replace('[propsType]', ': Props');
    } else data = data.replace('[propsType]', ': SVGProps<SVGSVGElement>');
  }

  const split = data.split('\n');
  if (interfacesStr) {
    for (let i = 0; i < split.length; i++) {
      const line = split[i];
      if (line === '') {
        split[i] = interfacesStr;
        break;
      } else if (i === 0 && line.includes('const')) {
        data = interfacesStr + data;
        break;
      }
    }
  }

  return split.join('\n');
};

export { transformSvg };
