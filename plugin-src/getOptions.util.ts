import { OptionsKeys } from "../shared/custom";
import { OPTIONS_KEYS } from "../shared/options.const";

export const getOptions = async () => {
  const options: Record<string, any> = {};
  const optionsKeys = await figma.clientStorage.keysAsync();
  const promises: Promise<void>[] = [];

  for (const key of optionsKeys) {
    if (OPTIONS_KEYS.includes(key as OptionsKeys)) {
      promises.push(
        new Promise(async (resolve) => {
          try {
            options[key] = await figma.clientStorage.getAsync(key);
          } catch (e) {
            console.log(e);
          }
          resolve();
        })
      );
    }
  }

  await Promise.all(promises);
  return options;
};
