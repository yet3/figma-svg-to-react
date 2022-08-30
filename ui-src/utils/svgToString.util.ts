import { ISvg } from "../../shared/custom";

const svgToString = ({ data, compName }: ISvg) => {
  return data.replaceAll("COMP_NAME", compName);
};

export { svgToString };
