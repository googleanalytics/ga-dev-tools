import * as React from "react"
import { styled } from '@mui/material/styles';
import { useTheme } from "@mui/material"
import {Circles} from "react-loader-spinner"
import {PropsWithChildren} from 'react';

const PREFIX = 'Spinner';

const classes = {
  loadingIndicator: `${PREFIX}-loadingIndicator`
};

const Root = styled('section')(() => ({
  [`&.${classes.loadingIndicator}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
}));

interface SpinnerProps {
  ellipses?: boolean
}

const Spinner: React.FC<PropsWithChildren<SpinnerProps>> = ({ children, ellipses }) => {

  const theme = useTheme()

  return (
    <Root className={classes.loadingIndicator}>
      {children}
      {ellipses && <>&hellip;</>}
      <Circles color={theme.palette.primary.main} />
    </Root>
  );
}

export default Spinner
