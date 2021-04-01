import * as React from "react"

import { makeStyles, Tooltip } from "@material-ui/core"
import { Launch } from "@material-ui/icons"

const useStyles = makeStyles(_ => ({
  externalLink: {
    "&:hover": {
      opacity: 1.0,
    },
    opacity: 0.3,
  },
}))

const ExternalLink: React.FC<{ href: string; title?: string }> = ({
  href,
  title,
}) => {
  const classes = useStyles()
  return (
    <Tooltip title={title || ""}>
      <a
        className={classes.externalLink}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <Launch color="action" />
      </a>
    </Tooltip>
  )
}

export default ExternalLink
