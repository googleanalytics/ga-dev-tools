import * as React from "react"

import { styled } from '@mui/material/styles';

import {  Tooltip } from "@mui/material"

import { Launch } from "@mui/icons-material"
import clsx from "classnames"
import {PropsWithChildren} from 'react';

const PREFIX = 'ExternalLink';

const classes = {
  link: `${PREFIX}-link`,
  icon: `${PREFIX}-icon`,
  hover: `${PREFIX}-hover`
};

const Root = styled('div')(() => ({
  [`& .${classes.link}`]: {
    display: "inline-flex",
    alignItems: "center",
  },

  [`& .${classes.icon}`]: {
    marginLeft: "0.5ch",
    color: "inherit",
  },

  [`& .${classes.hover}`]: {
    "&:hover": {
      opacity: 1.0,
    },
    opacity: 0.3,
  }
}));

type Props = {
  href: string
  title?: string
  hover?: true | undefined
}

const ExternalLink: React.FC<PropsWithChildren<Props>> = ({ href, title, children, hover }) => {

  return (
      <Root>
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
      </Root>
  );
}

export default ExternalLink
