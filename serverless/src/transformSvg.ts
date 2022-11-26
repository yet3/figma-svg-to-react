import { IOptions } from '../../serverless/schemas/options.schema';
import { ISvgNode } from '../../serverless/schemas/svg.schema';

import { transform } from '@svgr/core';
import { SvgrTemplate } from './template';

import '@svgr/plugin-svgo';
import '@svgr/plugin-jsx';
import '@svgr/plugin-prettier';
import { handleClassNames } from './handleClassNames.svgo';


const transformSvg = async (svg: ISvgNode, options: IOptions): Promise<string | null> => {
  const {
    removeAllFill,
    removeAllStroke,
    includeImportReact,
    asIcon,
    forReactNative,
    namedExport,
    withProps,
    withViewbox,
    typescript,
    forwardRef,
    propsInterface,
    addClassNames,
    makeClassNamesExact,
  } = options;

  let data = '';
  try {
    const code = String.fromCharCode(...svg.bytes);
    const attrsToRemove: string[] = [];
    if (removeAllFill) attrsToRemove.push('fill');
    if (removeAllStroke) attrsToRemove.push('stroke');
    if (!addClassNames) attrsToRemove.push('id');

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
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'removeViewBox',
              active: !withViewbox,
            },
            {
              name: 'handleClassNames',
              type: 'full',
              fn: (root: any) => handleClassNames(root, { onlyRemoveFirstGroup: !addClassNames, makeExactClassNames: makeClassNamesExact }),
            },
            {
              name: 'removeAttrs',
              active: attrsToRemove.length > 0,
              params: {
                attrs: `(${attrsToRemove.join('|')})`,
              },
            },
          ],
        },
        template: SvgrTemplate,
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
        interfacesStr = `interface Props extends SVGProps<SVGSVGElement> {\n\n}`;
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
  let constsI = 0;
  for (let i = 0; i < split.length; i++) {
    const line = split[i];
    if (constsI === 0 && line.includes('const')) {
      constsI++;
      split.splice(i, 0, '');

      if (interfacesStr) {
        split.splice(i, 0, '\n' + interfacesStr);
      }
    }

    if (line === ');') {
      split.splice(i + 1, 0, '');
    }
  }

  return split.join('\n');
};

export { transformSvg };
