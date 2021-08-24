import * as React from "react"
import {
  Button,
  Tooltip,
  IconButton,
  ButtonProps as MUIButtonProps,
} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import Delete from "@material-ui/icons/Delete"
import Check from "@material-ui/icons/Check"

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

export const TooltipIconButton: React.FC<{
  tooltip: string
  size?: "small" | "medium"
  className?: string
  disabled?: boolean
  onClick?: () => void
}> = ({ tooltip, children, onClick, className, disabled, size = "small" }) => {
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
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick} size={size} className={className}>
        {children}
      </IconButton>
    </Tooltip>
  )
}
