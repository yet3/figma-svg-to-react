import { API_Options, API_Request, API_Response, ExportSvg, IOptions, ISvg, OptionsKeys } from "../../shared/custom";

export const fetchSvgs = async (
  _svgs: ExportSvg[],
  opts: IOptions
): Promise<ISvg[]> => {
  try {
    const optionsToSend: Partial<API_Options> = {};
    Object.keys(opts).forEach((key) => {
      optionsToSend[key as OptionsKeys] = opts[key as OptionsKeys].value;
    });
    const res = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        svgs: _svgs,
        options: optionsToSend,
      } as API_Request),
    });
    const data = (await res.json()) as API_Response;
    return data.svgs;
  } catch (e) {
    console.log(e);
    return [];
  }
};
