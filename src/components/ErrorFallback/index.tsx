import { makeStyles, Typography } from "@material-ui/core"
import { FallbackProps } from "react-error-boundary"
import * as React from "react"
import CodeBlock from "../CodeBlock"
import { PAB } from "../Buttons"
import Warning from "../Warning"

const useStyles = makeStyles(theme => ({
  error: {
    padding: theme.spacing(2),
    maxWidth: theme.breakpoints.values.md,
  },
  resetButton: {
    marginTop: theme.spacing(1),
  },
}))

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const classes = useStyles()

  return (
    <section role="alert" className={classes.error}>
      <Typography variant="h3">Something went wrong</Typography>
      <Warning>{error.message}</Warning>
      <CodeBlock codeBlocks={[{ code: error.stack!, title: "Error stack" }]} />
      <PAB className={classes.resetButton} onClick={resetErrorBoundary}>
        Reset App
      </PAB>
    </section>
  )
}

export default ErrorFallback
