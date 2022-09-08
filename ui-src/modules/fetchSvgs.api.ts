import { IOptionsWithDetails, OptionsKeys } from '../../shared/custom';
import { IOptions } from '../../shared/schemas/options.schema';
import { ISvgNode } from '../../shared/schemas/svg.schema';
import { IApiReqBody, IApiReply } from '../../shared/schemas/api.schema';

const URL = process.env.IS_DEV ? 'http://localhost:3000/' : 'https://figma-svg-to-react-api.vercel.app/';
export const fetchSvgs = async (_svgs: ISvgNode[], opts: IOptionsWithDetails): Promise<IApiReply> => {
  try {
    const optionsToSend: Partial<IOptions> = {};
    Object.keys(opts).forEach((key) => {
      optionsToSend[key as OptionsKeys] = opts[key as OptionsKeys].value;
    });

    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        svgs: _svgs,
        options: optionsToSend,
      } as IApiReqBody),
    });
    return (await res.json()) as IApiReply;
  } catch (e) {
    console.log(e);
    return {
      errors: e.toString(),
    };
  }
};
