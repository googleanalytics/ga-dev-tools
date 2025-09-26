import * as React from "react"

import { styled } from "@mui/material/styles"

import { Tooltip } from "@mui/material"

import { Launch } from "@mui/icons-material"
import clsx from "classnames"
import { PropsWithChildren } from "react"

const PREFIX = "ExternalLink"

const classes = {
  icon: `${PREFIX}-icon`,
  hover: `${PREFIX}-hover`,
}

const StyledLink = styled("a")({
  display: "inline-flex",
  alignItems: "center",
  [`& .${classes.icon}`]: {
    marginLeft: "0.5ch",
    color: "inherit",
  },

  [`&.${classes.hover}`]: {
    "&:hover": {
      opacity: 1.0,
    },
    opacity: 0.3,
  },
})

type Props = {
  href: string
  title?: string
  hover?: true | undefined
}

const ExternalLink: React.FC<PropsWithChildren<Props>> = ({
  href,
  title,
  children,
  hover,
}) => {
  return (
    <Tooltip title={title || ""}>
      <StyledLink
        className={clsx({ [classes.hover]: hover })}
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
      </StyledLink>
    </Tooltip>
  )
}

export default ExternalLink
