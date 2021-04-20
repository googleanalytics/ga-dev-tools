import * as React from "react"
import { Button, Tooltip, IconButton } from "@material-ui/core"

// TODO - PAB shouldn't allow you to provide variant or color so it's more
// obvious how it works.
// Primary Action Button
export const PAB: typeof Button = ({ ...props }) => {
  return <Button {...props} variant="contained" color="primary" />
}

// Secondary Action Button
export const SAB: typeof Button = ({ ...props }) => {
  return <Button {...props} variant="outlined" color="secondary" />
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
