import * as React from "react"
import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material"

import classnames from "classnames"
import { Info as InfoIcon } from "@mui/icons-material"
import blue from "@mui/material/colors/lightBlue"
import {PropsWithChildren} from 'react';

const PREFIX = 'Info';

const classes = {
  info: `${PREFIX}-info`,
  infoIcon: `${PREFIX}-infoIcon`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`&.${classes.info}`]: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    minHeight: theme.spacing(10),
    alignItems: "center",
    backgroundColor: blue[100],
    // maxWidth: 930,
  },

  [`& .${classes.infoIcon}`]: {
    margin: theme.spacing(0, 2),
  }
}));

interface InfoProps {
  className?: string
}

const Info: React.FC<PropsWithChildren<InfoProps>> = ({ children, className }) => {


  return (
    <StyledPaper className={classnames(classes.info, className)}>
      <InfoIcon className={classes.infoIcon} />
      <section>{children}</section>
    </StyledPaper>
  );
}

export default Info
