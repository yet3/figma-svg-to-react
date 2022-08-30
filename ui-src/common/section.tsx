import clsx from "clsx";
import { PropsWithChildren, useState } from "react";

interface Props {
  title: string;
  size?: "xs" | "sm" | "lg";

  className?: string;
  labelClassName?: string;
  arrowClassName?: string;
  noBorder?: boolean
}

const Section = ({
  title,
  size = "lg",
  children,
  className,
  labelClassName,
  arrowClassName,
  noBorder
}: PropsWithChildren<Props>) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <section className={clsx(className, !noBorder && 'border border-gray-200 rounded-sm p-1')}>
      <button
        onClick={() => setIsExpanded((p) => !p)}
        className="flex flex-row items-center"
      >
        <span
          className={clsx(
            arrowClassName,
            isExpanded && "translate-y-0.5",
            size === "lg" ? "text-base" : size === "sm" ? "text-sm" : "text-xs",
            "mr-1"
          )}
        >
          {isExpanded ? "▼" : "▶"}
        </span>
        <h2
          className={clsx(
            labelClassName,
            size === "lg" ? "text-xl" : size === "sm" ? "text-lg" : "text-base",
            "font-medium"
          )}
        >
          {title}
        </h2>
      </button>
      {isExpanded ? children : null}
    </section>
  );
};

export { Section };
