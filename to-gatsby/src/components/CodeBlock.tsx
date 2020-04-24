import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import SyntaxHighlighter from "react-syntax-highlighter"
import { SyntaxHighlighterProps } from "react-syntax-highlighter"
import Paper from "@material-ui/core/Paper"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Box from "@material-ui/core/Box"
import Tab from "@material-ui/core/Tab"
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

interface BlockData {
  code: string
  title: string
}

interface CodeBlockProps extends SyntaxHighlighterProps {
  codeBlocks: BlockData[]
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  codeBlocks,
  className,
  ...props
}) => {
  const classes = useStyles()
  const [showAlert, setShowAlert] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState(0)

  const copyCode = React.useCallback(() => {
    copyToClipboard(codeBlocks[selectedTab].code)
    setShowAlert(true)
  }, [codeBlocks, selectedTab])

  return (
    <Box className={className}>
      <AppBar position="static">
        <Tabs
          value={selectedTab}
          onChange={(_, newIndex) => setSelectedTab(newIndex)}
        >
          {codeBlocks.map(({ title }) => (
            <Tab key={title} label={title} />
          ))}
        </Tabs>
      </AppBar>
      {codeBlocks.map(({ code, title }, idx) =>
        idx !== selectedTab ? null : (
          <Paper square key={title} className={classes.codeBlock}>
            <div className={classes.copyButton}>
              <Tooltip title="Copy">
                <IconButton onClick={copyCode}>
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
            <SyntaxHighlighter
              {...props}
              customStyle={{
                background: "unset",
                padding: "unset",
                margin: "unset",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </Paper>
        )
      )}
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
      >
        <MuiAlert>Code copied to clipboard.</MuiAlert>
      </Snackbar>
    </Box>
  )
}

export default CodeBlock
