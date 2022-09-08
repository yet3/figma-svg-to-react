import { useEffect, useRef, useState } from "react";
import { Button } from "./button";

interface Props {
  onCopy: () => Promise<boolean> | boolean;
  disabled?: boolean
}

const CopyButton = ({ onCopy, disabled }: Props) => {
  const timeout = useRef<null | NodeJS.Timeout>(null);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (timeout.current != null) clearTimeout(timeout.current);
    };
  }, []);

  const handleClick = async () => {
    if (timeout.current != null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    const result = await onCopy();

    if (result) {
      setHasCopied(true);
      timeout.current = setTimeout(() => {
        setHasCopied(false);
        timeout.current = null;
      }, 500);
    }
  };

  return (
    <Button
      disabled={hasCopied || disabled}
      className={
        hasCopied ? "disabled:bg-green-300/20 disabled:text-green-800" : ""
      }
      content={hasCopied ? "Copied!" : "Copy to clipboard"}
      onClick={handleClick}
    />
  );
};

export { CopyButton };
