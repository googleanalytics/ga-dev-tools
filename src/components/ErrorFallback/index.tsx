import {Typography} from "@mui/material"
import { styled } from '@mui/material/styles';

import {FallbackProps} from "react-error-boundary"
import * as React from "react"
import CodeBlock from "../CodeBlock"
import {PAB} from "../Buttons"
import Warning from "../Warning"

const PREFIX = 'ErrorFallback';

const classes = {
  error: `${PREFIX}-error`,
  resetButton: `${PREFIX}-resetButton`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`&.${classes.error}`]: {
    padding: theme.spacing(2),
    maxWidth: theme.breakpoints.values.md,
  },

  [`& .${classes.resetButton}`]: {
    marginTop: theme.spacing(1),
  }
}));

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {


  return (
    <Root role="alert" className={classes.error}>
      <Typography variant="h3">Something went wrong</Typography>
      <Warning>{error.message}</Warning>
      <CodeBlock codeBlocks={[{ code: error.stack!, title: "Error stack" }]} />
      <PAB className={classes.resetButton} onClick={resetErrorBoundary}>
        Reset App
      </PAB>
    </Root>
  );
}

export default ErrorFallback
