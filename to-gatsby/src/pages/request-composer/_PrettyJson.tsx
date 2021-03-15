import React, { useCallback } from "react"
import { Typography, Collapse, makeStyles, Paper } from "@material-ui/core"
import ReactJson, { CollapsedFieldProps } from "react-json-view"

interface PrettyJsonProps {
  object: object | undefined
  shouldCollapse?: (props: CollapsedFieldProps) => boolean
}

export const shouldCollapseRequest = ({ namespace }: CollapsedFieldProps) => {
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

export const shouldCollapseResponse = ({ namespace }: CollapsedFieldProps) => {
  if (namespace.length < 5) {
    return false
  }
  return true
}

const useStyles = makeStyles(theme => ({
  jsonPaper: {
    padding: theme.spacing(2),
  },
}))

const PrettyJson: React.FC<PrettyJsonProps> = ({ object, shouldCollapse }) => {
  const classes = useStyles()

  if (object === undefined) {
    return null
  }
  return (
    <Paper className={classes.jsonPaper}>
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
    </Paper>
  )
}

export default PrettyJson
