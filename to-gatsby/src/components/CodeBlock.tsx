import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import SyntaxHighlighter from "react-syntax-highlighter"
import { SyntaxHighlighterProps } from "react-syntax-highlighter"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import copyToClipboard from "copy-to-clipboard"

const useStyles = makeStyles(theme => ({
  codeBlock: {
    padding: theme.spacing(2),
    position: "relative",
  },
  copyButton: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    cursor: "pointer",
  },
  svgContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&:hover div": {
      visibility: "visible",
    },
    "& div": {
      visibility: "hidden",
    },
  },
}))

interface CodeBlockProps extends SyntaxHighlighterProps {
  code: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, ...props }) => {
  const classes = useStyles()
  const [showAlert, setShowAlert] = React.useState(false)

  const copyCode = React.useCallback(() => {
    copyToClipboard(code)
    setShowAlert(true)
  }, [code])

  return (
    <Paper className={classes.codeBlock}>
      <div className={classes.copyButton}>
        <Tooltip title="Copy">
          <IconButton onClick={copyCode}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      </div>
      <SyntaxHighlighter
        {...props}
        customStyle={{ background: "unset", padding: "unset", margin: "unset" }}
      >
        {code}
      </SyntaxHighlighter>
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
      >
        <MuiAlert>Code copied to clipboard.</MuiAlert>
      </Snackbar>
    </Paper>
  )
}

export default CodeBlock
