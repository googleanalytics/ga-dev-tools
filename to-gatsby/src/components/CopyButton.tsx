import * as React from "react"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import copyToClipboard from "copy-to-clipboard"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  copyIcon: {
    marginRight: theme.spacing(1),
  },
}))

interface BaseCopyButtonProps {
  toCopy: string
}

interface CopyButtonPropsIconButton extends BaseCopyButtonProps {
  useIconButton: true
}

interface CopyButtonPropsButton extends BaseCopyButtonProps {
  variant?: "outlined" | "contained"
  color?: "primary"
  useIconButton?: undefined
  text: string
}

type CopyButtonProps = CopyButtonPropsIconButton | CopyButtonPropsButton

const CopyButton: React.FC<CopyButtonProps> = props => {
  const classes = useStyles()
  const [showAlert, setShowAlert] = React.useState(false)

  const { toCopy } = props

  const copyCode = React.useCallback(() => {
    copyToClipboard(toCopy)
    setShowAlert(true)
  }, [toCopy])

  return (
    <>
      {props.useIconButton === true ? (
        <Tooltip title="Copy">
          <IconButton onClick={copyCode}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button variant={props.variant} color={props.color} onClick={copyCode}>
          <FileCopyIcon className={classes.copyIcon} /> {props.text}
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
