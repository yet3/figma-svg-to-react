import { useEffect, useMemo, useState } from "react";
import {
  ExportSvg,
  IOptions,
  ISvg,
  OptionsKeys,
  SvgChangable,
} from "../shared/custom";
import { OptionsSecition } from "./modules/optionsSection";
import { Button } from "./common/button";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import { OPTIONS } from "../shared/options.const";
import { SvgSection } from "./modules/svgSection";
import { toCamelCase } from "../shared/toCamelCase.util";
import { toCompName } from "../shared/toCompName.util";
import { saveAsFiles } from "../shared/saveAsFiles.util";
import { fetchSvgs } from "./modules/fetchSvgs.api";

SyntaxHighlighter.registerLanguage("tsx", tsx);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<IOptions>(OPTIONS);
  const [svgs, setSvgs] = useState<ISvg[]>([]);

  useEffect(() => {
    window.onmessage = async (e) => {
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
        data.svgs.map((s: ExportSvg) => ({
          id: s.id,
          compName: toCompName(s.nodeName),
          fileName: toCamelCase(s.nodeName),
          nodeName: s.nodeName,
          originalBytes: s.bytes,
          data: "",
        }))
      );
    };
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const generated = await fetchSvgs(
        svgs.map((s) => ({
          id: s.id,
          bytes: s.originalBytes,
          nodeName: s.nodeName,
        })),
        options
      );
      setSvgs((p) => {
        const tmp = p.slice();

        generated.forEach((newSvg) => {
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
      setLoading(false);
    })();
  }, [options]);

  const handleChangeSvg = (svgId: string, d: SvgChangable) => {
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
        <SvgSection
          svg={svg}
          options={options}
          handleChangeSvg={(d) => handleChangeSvg(svg.id, d)}
        />
      </li>
    ));
  }, [options, svgs]);

  return (
    <div>
      <main className="grid gap-4">
        <OptionsSecition options={options} setOptions={setOptions} />
        <Button
          content={`Save all as files (${svgs.length})`}
          disabled={loading}
          onClick={() => {
            saveAsFiles(svgs, options);
          }}
        />
        <ul className="grid gap-4 relative">
          {loading && (
            <li className="w-full h-full bg-black/75 absolute top-0 left-0" />
          )}
          {nodes}
        </ul>
      </main>
    </div>
  );
};

export { App };
