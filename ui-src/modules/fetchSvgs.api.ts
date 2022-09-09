import { IOptionsWithDetails, OptionsKeys } from '../../shared/custom';
import { IOptions } from '../../api/schemas/options.schema';
import { ISvgNode } from '../../api/schemas/svg.schema';
import { IApiReqBody, IApiReply } from '../../api/schemas/api.schema';

console.log('IS_DEV', process.env.IS_DEV === 'true')
const URL = process.env.IS_DEV === 'true' ? 'http://localhost:3000/' : 'https://figma-svg-to-react-api.vercel.app/';
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
