import * as React from "react"
import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material"
import classnames from "classnames"
import { Warning as WarningIcon } from "@mui/icons-material"
import { red } from "@mui/material/colors"
import {PropsWithChildren} from 'react';

const PREFIX = 'Warning';

const classes = {
  warning: `${PREFIX}-warning`,
  warningIcon: `${PREFIX}-warningIcon`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`&.${classes.warning}`]: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    minHeight: theme.spacing(10),
    alignItems: "center",
    backgroundColor: red[100],
  },

  [`& .${classes.warningIcon}`]: {
    margin: theme.spacing(0, 2),
  }
}));

interface WarningProps {
  className?: string
}

const Warning: React.FC<PropsWithChildren<WarningProps>> = ({ children, className }) => {


  return (
    <StyledPaper className={classnames(classes.warning, className)}>
      <WarningIcon className={classes.warningIcon} />
      <section>{children}</section>
    </StyledPaper>
  );
}

export default Warning
