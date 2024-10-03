import * as React from "react"
import {
  Button,
  Tooltip,
  IconButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material"
import Add from "@mui/icons-material/Add"
import Delete from "@mui/icons-material/Delete"
import Check from "@mui/icons-material/Check"
import {PropsWithChildren} from 'react';

// Secondary Action Button
interface Props extends MUIButtonProps {
  add?: boolean
  delete?: boolean
  check?: boolean
  small?: boolean
  medium?: boolean
  title?: string
}
const BaseButton: React.FC<Props> = ({
  add,
  small,
  medium,
  delete: deleteIcon,
  check,
  title,
  ...props
}) => {
  const button = React.useMemo(() => {
    return (
      <Button
        startIcon={
          check ? <Check /> : add ? <Add /> : deleteIcon ? <Delete /> : null
        }
        {...props}
        size={small ? "small" : medium ? "medium" : props.size}
      />
    )
  }, [add, deleteIcon, small, props, check, medium])
  if (title !== undefined) {
    return (
      <Tooltip title={title}>
        <span>{button}</span>
      </Tooltip>
    )
  }
  return button
}

export const PAB: React.FC<Props> = ({ ...props }) => {
  return <BaseButton {...props} variant="contained" color="primary" />
}

export const SAB: React.FC<Props> = ({ ...props }) => {
  return <BaseButton {...props} variant="outlined" color="secondary" />
}

export const DAB: React.FC<Props> = ({ ...props }) => {
  return <BaseButton {...props} variant="contained" color="secondary" />
}

export const PlainButton: React.FC<Props> = ({ ...props }) => {
  return <BaseButton {...props} variant="contained" />
}

type TooltipIconButtonProps = {
  tooltip: string
  size?: "small" | "medium"
  className?: string
  disabled?: boolean
  placement?: "bottom" | "left" | "right" | "top" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "right-end" | "right-start" | "top-end" | "top-start" | undefined
  onClick?: () => void
}

export const TooltipIconButton: React.FC<PropsWithChildren<TooltipIconButtonProps>> =
    ({ tooltip, children, onClick, className, disabled, size = "small", placement='bottom'}) => {
  if (disabled) {
    return (
      <IconButton
        onClick={onClick}
        size={size}
        disabled={disabled}
        className={className}
      >
        {children}
      </IconButton>
    )
  }
  return (
    <Tooltip title={tooltip} placement={placement} leaveDelay={2000}>
      <IconButton onClick={onClick} size={size} className={className}>
        {children}
      </IconButton>
    </Tooltip>
  )
}
