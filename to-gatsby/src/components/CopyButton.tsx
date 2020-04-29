import * as React from "react"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import copyToClipboard from "copy-to-clipboard"

interface CopyButtonProps {
  useIconButton: true | undefined
  toCopy: string
  text?: string
}

const CopyButton: React.FC<CopyButtonProps> = ({
  useIconButton,
  toCopy,
  text = "Copy",
}) => {
  const [showAlert, setShowAlert] = React.useState(false)

  const copyCode = React.useCallback(() => {
    copyToClipboard(toCopy)
    setShowAlert(true)
  }, [toCopy])

  return (
    <>
      {useIconButton ? (
        <Tooltip title="Copy">
          <IconButton onClick={copyCode}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button>
          {" "}
          <FileCopyIcon /> {text}{" "}
        </Button>
      )}
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
      >
        <MuiAlert>Copied to clipboard.</MuiAlert>
      </Snackbar>
    </>
  )
}

export default CopyButton
