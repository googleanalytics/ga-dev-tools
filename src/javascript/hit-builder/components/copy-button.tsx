import React from "react";
import Icon, { IconType } from "../../components/icon";
import IconButton from "../../components/icon-button";
import { gaAll } from "../../analytics";
import copy from "copy-to-clipboard";

const ACTION_TIMEOUT = 1500;

interface CopyButtonProps {
  type: IconType;
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  children,
  type,
  textToCopy
}) => {
  const [iconType, setIconType] = React.useState<IconType>(type);
  const [copied, setCopied] = React.useState(false);
  const copiedTimeout = React.useRef(0);
  const copyText = React.useCallback(() => {
    if (copy(textToCopy)) {
      setCopied(true);

      gaAll("send", "event", {
        eventCategory: "Hit Builder",
        eventAction: "copy-to-clipboard",
        eventLabel: "payload"
      });
    }
  }, [textToCopy]);

  React.useEffect(() => {
    clearTimeout(copiedTimeout.current);
    if (copied) {
      setIconType("check");
      copiedTimeout.current = window.setTimeout(() => {
        setCopied(false);
        setIconType(type);
      }, ACTION_TIMEOUT);
    } else {
    }
  }, [copied]);
  return (
    <IconButton type={iconType} onClick={copyText}>
      {children}
    </IconButton>
  );
};

export default CopyButton;
