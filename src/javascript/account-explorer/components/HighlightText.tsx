import * as React from "react";
import uuid from "uuid";

interface SplitTextAcc {
  remaining: string;
  components: (Element | JSX.Element)[];
}

interface HighlightTextProps {
  text: string;
  search?: string;
  className?: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  search,
  className,
}) => {
  if (search === undefined) {
    return <>{text}</>;
  }
  const regex = new RegExp("(" + search + ")", "ig");
  const matches = text.match(regex) || [];
  const initialValue: SplitTextAcc = {
    components: [],
    remaining: text,
  };
  const { components, remaining } = matches.reduce<SplitTextAcc>(
    (acc: SplitTextAcc, match: string) => {
      const { components, remaining } = acc;
      const startOfMatch = remaining.indexOf(match);
      const endOfMatch = startOfMatch + match.length;
      if (startOfMatch !== -1) {
        const beforeMatch = remaining.substring(0, startOfMatch);
        const toMark = remaining.substring(startOfMatch, endOfMatch);
        const newRemaining = remaining.substring(endOfMatch);
        const newComponents = components.concat([
          <React.Fragment key={uuid()}>{beforeMatch}</React.Fragment>,
          <mark className={className} key={uuid()}>
            {toMark}
          </mark>,
        ]);
        return { components: newComponents, remaining: newRemaining };
      } else {
        return acc;
      }
    },
    initialValue
  );
  components.push(<React.Fragment key={uuid()}>{remaining}</React.Fragment>);
  return <>{components}</>;
};
export default HighlightText;
