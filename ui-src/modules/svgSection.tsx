import { IOptions, ISvg, SvgChangable } from "../../shared/custom";
import { Section } from "../common/section";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import { svgToString } from "../utils/svgToString.util";
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "../common/button";
import { toCamelCase } from "../../shared/toCamelCase.util";
import { saveAsFiles } from "../../shared/saveAsFiles.util";
import copy from "copy-to-clipboard";
import { CopyButton } from "../common/copyButton";
import { Input } from "../common/input";

interface Props {
  svg: ISvg;
  options: IOptions;
  handleChangeSvg: (d: SvgChangable) => void;
}

const SvgSection = ({ svg, options, handleChangeSvg }: Props) => {
  const [isFileNameTouched, setIsFileNameTouched] = useState(false);
  const [compName, setCompName] = useState(svg.compName);
  const [fileName, setFileName] = useState(svg.fileName);
  const codeRef = useRef<HTMLElement | null>(null);

  const handleChangeCompName = (e: ChangeEvent<HTMLInputElement>) => {
    setCompName(e.target.value);
    handleChangeSvg({ compName: e.target.value });
  };

  const handleChangeFileName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isFileNameTouched) setIsFileNameTouched(true);
    setFileName(e.target.value);
    handleChangeSvg({ fileName: e.target.value });
  };

  return (
    <Section title={svg.nodeName} size="sm">
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Component name"
          value={compName}
          onChange={handleChangeCompName}
        />
        <Input
          label="File name"
          value={isFileNameTouched ? fileName : toCamelCase(compName)}
          onChange={handleChangeFileName}
          sufix={`.${options.typescript.value ? "t" : "j"}sx`}
        />
        <CopyButton
          onCopy={() => {
            if (codeRef.current?.textContent) {
              copy(codeRef.current.textContent);
              return true;
            }
            return false;
          }}
        />
        <Button
          content="Save as file"
          onClick={() => {
            saveAsFiles([svg], options);
          }}
        />
        <Section
          title="Preview"
          size="xs"
          noBorder
          className="col-span-full"
          labelClassName="text-gray-600"
          arrowClassName="text-gray-600"
        >
          <SyntaxHighlighter
            language="tsx"
            style={prism}
            codeTagProps={{ ref: codeRef }}
          >
            {svgToString(svg)}
          </SyntaxHighlighter>
        </Section>
      </div>
    </Section>
  );
};

export { SvgSection };
