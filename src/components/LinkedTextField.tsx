import React from "react"
import { TextField } from "@mui/material"
import ExternalLink from "./ExternalLink"

export interface LinkedTextFieldProps {
  href: string
  linkTitle: string
  value: string | undefined
  label: string
  onChange: (e: string) => void
  onBlur?: () => void
  helperText: string | JSX.Element
  extraAction?: JSX.Element
  required?: true
  disabled?: boolean
  id?: string
  error?: boolean
  size?: "small" | "medium"
}

const LinkedTextField: React.FC<LinkedTextFieldProps> = ({
  href,
  linkTitle,
  label,
  value,
  onChange,
  onBlur,
  required,
  helperText,
  disabled,
  extraAction,
  id,
  error,
  size = "small",
}) => {
  return (
    <TextField
      InputProps={{
        endAdornment: (
          <span
            style={{
              display: "inline-flex",
            }}
          >
            {extraAction}
            <ExternalLink href={href} title={linkTitle} hover />
          </span>
        ),
      }}
      id={id}
      size={size}
      variant="outlined"
      fullWidth
      label={label}
      value={value === undefined ? "" : value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      required={required}
      helperText={helperText}
      disabled={disabled}
      error={error}
    />
  )
}

export default LinkedTextField
