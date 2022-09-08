import { ISvg } from "../../shared/custom";

const svgToString = ({ data, compName }: ISvg) => {
  return data.replace(/COMP_NAME/gm, compName);
};

export { svgToString };
