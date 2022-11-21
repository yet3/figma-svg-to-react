import { IOptionsWithDetails, ISvg, SvgEditable } from '../../shared/custom';
import { Section } from '../common/section';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
import { svgToString } from '../utils/svgToString.util';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Button } from '../common/button';
import { toCamelCase } from '../utils/toCamelCase.util';
import { saveAsFiles } from '../utils/saveAsFiles.util';
import copy from 'copy-to-clipboard';
import { Loader } from '../common/loader';
import { CopyButton } from '../common/copyButton';
import { Input } from '../common/input';
import clsx from 'clsx';

interface Props {
  svg: ISvg;
  options: IOptionsWithDetails;
  handleChangeSvg: (d: SvgEditable) => void;

  isLoading?: boolean;
}

const SvgSection = ({ svg, options, handleChangeSvg, isLoading }: Props) => {
  const [isFileNameTouched, setIsFileNameTouched] = useState(false);
  const [compName, setCompName] = useState(svg.compName);
  const [fileName, setFileName] = useState(svg.fileName);
  const codeRef = useRef<HTMLElement | null>(null);

  const handleChangeCompName = (e: ChangeEvent<HTMLInputElement>) => {
    if (isFileNameTouched) handleChangeSvg({ compName: e.target.value });
    else {
      const fileName = toCamelCase(e.target.value);
      handleChangeSvg({ compName: e.target.value, fileName });
      setFileName(fileName);
    }

    setCompName(e.target.value);
  };

  const handleChangeFileName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isFileNameTouched) setIsFileNameTouched(true);
    setFileName(e.target.value);
    handleChangeSvg({ fileName: e.target.value });
  };

  return (
    <Section title={svg.nodeName} size="sm">
      <div className="grid grid-cols-2 gap-2">
        <Input label="Component name" value={compName} onChange={handleChangeCompName} />
        <Input
          label="File name"
          value={fileName}
          className={clsx(!isFileNameTouched && 'border-yellow-300')}
          onChange={handleChangeFileName}
          sufix={`.${options.typescript.value ? 't' : 'j'}sx`}
        />
        <CopyButton
          disabled={isLoading}
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
          disabled={isLoading}
          onClick={() => {
            saveAsFiles([svg], options);
          }}
        />
        <Section
          title={'Preview' + (isLoading ? ' (Loading)' : '')}
          size="xs"
          noBorder
          className="col-span-full"
          labelClassName="text-gray-600"
          arrowClassName="text-gray-600"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <SyntaxHighlighter language="tsx" style={prism} codeTagProps={{ ref: codeRef }}>
              {svgToString(svg)}
            </SyntaxHighlighter>
          )}
        </Section>
      </div>
    </Section>
  );
};

export { SvgSection };
