import { SetStateAction } from "react";
import { IOptions, OptionsKeys } from "../../shared/custom";
import { Checkbox } from "../common/checkbox";
import { Section } from "../common/section";

interface Props {
  options: IOptions;
  setOptions: (options: SetStateAction<IOptions>) => void;
}

const OptionsSecition = ({ options, setOptions }: Props) => {
  const handleOptionChange = (key: OptionsKeys, value: boolean) => {
    setOptions((p) => {
      const cloned = { ...p };

      cloned[key] = { ...cloned[key], value: value };
      parent.postMessage(
        { pluginMessage: { type: "saveOptions", options: { [key]: value } } },
        "*"
      );
      return cloned;
    });
  };

  return (
    <Section title="Options" noBorder>
      <div className="grid gap-2 grid-cols-2">
        {Object.keys(options).map((key) => {
          const opt = options[key as OptionsKeys];
          let isDisabled = false;
          if (opt.onlyIf) {
            opt.onlyIf.some((k) => {
              if (!options[k].value) {
                isDisabled = true;
                return false;
              }
            });
          }

          return (
            <Checkbox
              value={isDisabled ? false : opt.value}
              onChange={(v) => handleOptionChange(key as OptionsKeys, v)}
              disabled={isDisabled}
              label={opt.label}
            />
          );
        })}
      </div>
    </Section>
  );
};

export { OptionsSecition };
