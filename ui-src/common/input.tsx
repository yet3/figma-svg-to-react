import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: ReactNode;
  sufix?: string | null;
}

const Input = ({ label, sufix, className, ...props }: Props) => {
  return (
    <div className={clsx("grid", sufix ? "grid-cols-[1fr,auto]" : "grid-cols-1")}>
      <label className="col-span-full">{label}</label>
      <input {...props} className={clsx("input", className)} />
      {sufix && (
        <input
          className="input w-10 border-l-0 rounded-l-none text-center"
          value={sufix}
          disabled
        />
      )}
    </div>
  );
};

export { Input };
