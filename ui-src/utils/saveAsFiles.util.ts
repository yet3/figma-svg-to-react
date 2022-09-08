import { IOptionsWithDetails, ISvg } from '../../shared/custom';
import { svgToString } from './svgToString.util';
import JSZip from 'jszip';

export const saveAsFiles = (svgs: ISvg[], options: IOptionsWithDetails) => {
  const extension = `.${options.typescript.value ? 't' : 'j'}sx`;

  if (svgs.length === 1) {
    const svg = svgs[0];
    const blobURL = window.URL.createObjectURL(new Blob([svgToString(svg)]));
    const link = document.createElement('a');
    link.href = blobURL;
    link.setAttribute('download', `${svg.fileName}${extension}`);
    link.click();
    return;
  }

  return new Promise<void>((resolve) => {
    let zip = new JSZip();

    for (let svg of svgs) {
      const blob = new Blob([svgToString(svg)]);
      zip.file(`${svg.fileName}${extension}`, blob, {
        base64: true,
      });
    }

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const blobURL = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = blobURL;
      link.setAttribute('download', 'generated_svgs' + '.zip');
      link.click();
      resolve();
    });
  });
};
