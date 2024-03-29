// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"
import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button"
import IconButton, { IconButtonProps } from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import copyToClipboard from "copy-to-clipboard"

const PREFIX = 'CopyButton';

const classes = {
  copyIcon: `${PREFIX}-copyIcon`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.copyIcon}`]: {
    marginRight: theme.spacing(1),
  }
}));

interface BaseCopyButtonProps {
  toCopy: string
}

interface CopyButtonPropsIconButton extends BaseCopyButtonProps {
  useIconButton: true
}

interface CopyButtonPropsButton extends BaseCopyButtonProps {
  variant?: "outlined" | "contained"
  color?: "primary" | "secondary"
  useIconButton?: undefined
  text: string
  size?: IconButtonProps["size"]
}

type CopyButtonProps = CopyButtonPropsIconButton | CopyButtonPropsButton

const CopyButton: React.FC<CopyButtonProps> = props => {

  const [showAlert, setShowAlert] = React.useState(false)

  const { toCopy } = props

  const copyCode = React.useCallback(() => {
    copyToClipboard(toCopy)
    setShowAlert(true)
  }, [toCopy])

  return (
    (<Root>
      {props.useIconButton === true ? (
        <Tooltip title="Copy">
          <IconButton onClick={copyCode}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant={props.variant}
          color={props.color}
          onClick={copyCode}
          size={props.size}
        >
          <FileCopyIcon className={classes.copyIcon} /> {props.text}
        </Button>
      )}
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
      >
        <MuiAlert severity="success" variant="filled">
          Copied to clipboard.
        </MuiAlert>
      </Snackbar>
    </Root>)
  );
}

interface CopyIconButtonProps {
  toCopy: string
  icon?: JSX.Element
  tooltipText?: string
  className?: string
  size?: IconButtonProps["size"]
  disabled?: boolean
}
export const CopyIconButton: React.FC<CopyIconButtonProps> = ({
  toCopy,
  size,
  className,
  disabled,
  tooltipText = "Copy",
  icon = <FileCopyIcon />,
}) => {
  const [showAlert, setShowAlert] = React.useState(false)

  const copyCode = React.useCallback(() => {
    copyToClipboard(toCopy)
    setShowAlert(true)
  }, [toCopy])

  const button = React.useMemo(() => {
    return (
      <IconButton
        disabled={disabled}
        onClick={copyCode}
        size={size}
        className={className}
      >
        {icon}
      </IconButton>
    )
  }, [disabled, className, copyCode, icon, size])

  return (
    <>
      {disabled ? button : <Tooltip title={tooltipText}>{button}</Tooltip>}
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => setShowAlert(false)}
      >
        <MuiAlert severity="success" variant="filled">
          Copied to clipboard.
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default CopyButton
