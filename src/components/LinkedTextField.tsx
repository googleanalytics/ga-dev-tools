import React from "react"
import { TextField, InputAdornment } from "@material-ui/core"
import ExternalLink from "./ExternalLink"

export interface LinkedTextFieldProps {
  href: string
  linkTitle: string
  value: string | undefined
  label: string
  onChange: (e: string) => void
  helperText: string
  required?: true
  disabled?: boolean
}

const LinkedTextField: React.FC<LinkedTextFieldProps> = ({
  href,
  linkTitle,
  label,
  value,
  onChange,
  required,
  helperText,
  disabled,
}) => {
  return (
    <TextField
      InputProps={{
        endAdornment: <ExternalLink href={href} title={linkTitle} />,
      }}
      size="small"
      variant="outlined"
      fullWidth
      label={label}
      value={value === undefined ? null : value}
      onChange={e => onChange(e.target.value)}
      required={required}
      helperText={helperText}
      disabled={disabled}
    />
  )
}

export default LinkedTextField
