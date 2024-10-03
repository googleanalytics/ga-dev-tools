import React, { useMemo } from "react"
import { styled } from '@mui/material/styles';
import {  Paper } from "@mui/material"

import { IS_SSR } from "../hooks"
import { CopyIconButton } from "./CopyButton"
import clsx from "classnames"

const PREFIX = 'PrettyJson';

const classes = {
  jsonWrapper: `${PREFIX}-jsonWrapper`,
  jsonPaper: `${PREFIX}-jsonPaper`,
  json: `${PREFIX}-json`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`& .${classes.jsonWrapper}`]: {
    display: "flex",
    alignItems: "flex-start",
  },

  [`&.${classes.jsonPaper}`]: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "flex-start",
  },

  [`& .${classes.json}`]: {
    "flex-grow": "1",
  }
}));

interface PrettyJsonProps {
  object: object | undefined
  tooltipText: string
  className?: string | undefined
  noPaper?: boolean
  // shouldCollapse?: (props: CollapsedFieldProps) => boolean
  // TODO - This is a workaround because react-json-view doesn't work with
  // gatsby ssr.
  shouldCollapse?: (props: any) => boolean
}

export const shouldCollapseRequest = ({ namespace }: any) => {
  // The number 4 refers to the number of levels to show by default, this value
  // was gotten to mostly by trial an error, but concretely it's the number of
  // unique "keys" in "object" that we want to show by default.
  // {
  //   // "reportRequests" is namespace.length === 1
  //   "reportRequests": [
  //     // "0" is namespace.length === 2
  //   {
  //     // "viewId" is namespace.length === 3
  //     "viewId": "viewIdString",
  //     // "dateRanges" is namespace.length === 3
  //     "dateRanges": [...]
  //   }]
  // }
  if (namespace.length < 4) {
    return false
  }
  return true
}

export const shouldCollapseResponse = ({ namespace }: any) => {
  if (namespace.length < 5) {
    return false
  }
  return true
}

const PrettyJson: React.FC<PrettyJsonProps> = ({
  object,
  shouldCollapse,
  className,
  tooltipText,
  noPaper,
}) => {


  const inner = useMemo(() => {
    if (object === undefined || IS_SSR) {
      return null
    }

    // TODO - This is a workaround because react-json-view doesn't support SSR.
    // This path shouldn't be run during SSR since the typeof window check will
    // return undefined.
    const ReactJson = require("react-json-view").default
    return (
      <>
        <span className={classes.json}>
          <ReactJson
            src={object}
            name={false}
            indentWidth={2}
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
            // The types are just out of date with the component :'(
            // @ts-ignore
            displayArrayKey={false}
            shouldCollapse={shouldCollapse || false}
          />
        </span>
        <CopyIconButton
          toCopy={JSON.stringify(object)}
          tooltipText={tooltipText}
        />
      </>
    )
  }, [object, shouldCollapse, tooltipText])

  if (object === undefined) {
    return null
  }

  if (IS_SSR) {
    return null
  }

  if (noPaper) {
    return <div className={clsx(classes.jsonWrapper, className)}>{inner}</div>
  } else {
    return <StyledPaper className={clsx(classes.jsonPaper, className)}>{inner}</StyledPaper>;
  }
}

export default PrettyJson
