import { useEffect, useMemo, useState } from 'react';
import { IExportSvg, IOptionsWithDetails, ISvg, OptionsKeys, SvgEditable } from '../shared/custom';
import { OptionsSection } from './modules/optionsSection';
import { Button } from './common/button';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import { OPTIONS } from '../shared/options.const';
import { SvgSection } from './modules/svgSection';
import { toCamelCase } from './utils/toCamelCase.util'
import { toCompName } from './utils/toCompName.util';
import { saveAsFiles } from './utils/saveAsFiles.util';
import { fetchSvgs } from './api/fetchSvgs.api';

SyntaxHighlighter.registerLanguage('tsx', tsx);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<IOptionsWithDetails>(OPTIONS);
  const [svgs, setSvgs] = useState<ISvg[]>([]);
  const [errors, setErrors] = useState<null | string>(null);

  useEffect(() => {
    window.onmessage = async (e: any) => {
      const data = JSON.parse(e.data.pluginMessage);

      const opts = {
        ...options,
      };
      Object.keys(data.options).forEach((key) => {
        opts[key as OptionsKeys] = {
          ...opts[key as OptionsKeys],
          value: data.options[key] ?? OPTIONS[key as OptionsKeys].value,
        };
      });

      setOptions(opts);
      setSvgs(
        data.svgs.map((s: IExportSvg) => ({
          id: s.id,
          compName: toCompName(s.nodeName),
          fileName: toCamelCase(s.nodeName),
          nodeName: s.nodeName,
          originalBytes: s.bytes,
          data: '',
        }))
      );
    };
  }, []);

  const parseSvgs = async () => {
    if (svgs.length === 0) {
      setErrors("There aren't any nodes to parse");
      setLoading(false);
      return;
    }

    setErrors(null);
    setLoading(true);
    const res = await fetchSvgs(
      svgs.map((s) => ({
        id: s.id,
        bytes: s.originalBytes,
      })),
      options
    );

    if (res.errors) {
      setErrors(res.errors);
    } else {
      setSvgs((p) => {
        const tmp = p.slice();

        res.svgs.forEach((newSvg) => {
          const ogIndex = tmp.findIndex((s) => s.id === newSvg.id);
          if (ogIndex >= 0) {
            tmp[ogIndex] = {
              ...tmp[ogIndex],
              ...newSvg,
            };
          }
        });
        return tmp;
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    parseSvgs();
  }, [options]);

  const handleChangeSvg = (svgId: string, d: SvgEditable) => {
    const svgIndex = svgs.findIndex((s) => s.id === svgId);
    if (svgIndex < 0) return;

    const cloned = svgs.slice();
    cloned[svgIndex] = {
      ...cloned[svgIndex],
      ...d,
    };
    setSvgs(cloned);
  };

  const nodes = useMemo(() => {
    return svgs.map((svg) => (
      <li key={svg.id}>
        <SvgSection isLoading={loading} svg={svg} options={options} handleChangeSvg={(d) => handleChangeSvg(svg.id, d)} />
      </li>
    ));
  }, [options, svgs, loading]);

  return (
    <div>
      <main className="grid gap-4">
        {errors && (
          <p className="text-lg text-red-500 py-2 text-center w-10/12 mx-auto">
            {errors}{' '}
            <button onClick={parseSvgs} className="text-blue-500">
              (<span className="underline text-inherit">Try Again</span>)
            </button>
          </p>
        )}
        <OptionsSection options={options} setOptions={setOptions} />
        <Button
          content={`Save all as files (${svgs.length})`}
          disabled={loading}
          onClick={() => {
            saveAsFiles(svgs, options);
          }}
        />
        <ul className="grid gap-4 relative">
          {/* {loading && <li className="w-full h-full bg-black/75 absolute top-0 left-0" />} */}
          {nodes}
        </ul>
      </main>
    </div>
  );
};

export { App };
