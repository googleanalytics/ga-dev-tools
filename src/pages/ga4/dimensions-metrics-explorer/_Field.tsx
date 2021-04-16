import * as React from "react"
import { Dimension, Metric } from "./_hooks"
import { Typography, makeStyles } from "@material-ui/core"
import { Link as IconLink } from "@material-ui/icons"
import InlineCode from "../../../components/InlineCode"
import { CopyIconButton } from "../../../components/CopyButton"

const useStyles = makeStyles(theme => ({
  heading: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    "&> button": {
      display: "none",
    },
    "&:hover": {
      "&> button": {
        display: "unset",
        padding: "unset",
        marginLeft: theme.spacing(1),
      },
    },
  },
  apiName: {
    marginLeft: theme.spacing(1),
  },
}))

interface FieldProps {
  field:
    | { type: "dimension"; value: Dimension }
    | { type: "metric"; value: Metric }
}
const Field: React.FC<FieldProps> = ({ field }) => {
  const apiName = field.value.apiName || ""
  const uiName = field.value.uiName || ""
  const description = field.value.description || ""
  const link = `${window.location.origin}${window.location.pathname}#${apiName}`

  const classes = useStyles()

  return (
    <div id={apiName} key={apiName}>
      <Typography variant="h3" className={classes.heading}>
        {uiName}
        <InlineCode className={classes.apiName}>{apiName}</InlineCode>
        <CopyIconButton
          icon={<IconLink color="primary" />}
          toCopy={link}
          tooltipText={`Copy link to ${apiName}`}
        />
      </Typography>
      <Typography>{description}</Typography>
    </div>
  )
}

export default Field
