import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import SyntaxHighlighter from "react-syntax-highlighter"
import { SyntaxHighlighterProps } from "react-syntax-highlighter"
import Paper from "@material-ui/core/Paper"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import copyToClipboard from "copy-to-clipboard"
import CopyButton from "./CopyButton"

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
  const [selectedTab, setSelectedTab] = React.useState(0)

  return (
    <Paper className={className}>
      <Tabs
        value={selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, newIndex) => setSelectedTab(newIndex)}
      >
        {codeBlocks.map(({ title }) => (
          <Tab key={title} label={title} />
        ))}
      </Tabs>
      {codeBlocks.map(({ code, title }, idx) =>
        idx !== selectedTab ? null : (
          <Paper square key={title} className={classes.codeBlock}>
            <div className={classes.copyButton}>
              <CopyButton useIconButton toCopy={code} />
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
    </Paper>
  )
}

export default CodeBlock
