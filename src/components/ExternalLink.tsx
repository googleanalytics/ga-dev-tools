import * as React from "react"

import { makeStyles, Tooltip } from "@material-ui/core"
import { Launch } from "@material-ui/icons"
import clsx from "classnames"

const useStyles = makeStyles(_ => ({
  link: {
    display: "inline-flex",
    alignItems: "center",
  },
  icon: {
    marginLeft: "0.5ch",
    color: "inherit",
  },
  hover: {
    "&:hover": {
      opacity: 1.0,
    },
    opacity: 0.3,
  },
}))

const ExternalLink: React.FC<{
  href: string
  title?: string
  hover?: true | undefined
}> = ({ href, title, children, hover }) => {
  const classes = useStyles()
  return (
    <Tooltip title={title || ""}>
      <a
        className={clsx({ [classes.hover]: hover }, classes.link)}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
        <Launch
          className={clsx({ [classes.icon]: children !== undefined })}
          color="action"
          fontSize={children === undefined ? undefined : "inherit"}
        />
      </a>
    </Tooltip>
  )
}

export default ExternalLink
