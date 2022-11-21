import { Template } from '@svgr/babel-plugin-transform-svg-component';

const SvgrTemplate: Template = (variables, { tpl }) => {
  return tpl`
    ${variables.imports};

    ${variables.interfaces};

    const ${variables.componentName} = ([args]) => (
      ${variables.jsx}
    );
     
    ${variables.exports};
  `;
};

export { SvgrTemplate };
