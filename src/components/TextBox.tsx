import React from "react"
import { TextField } from "@mui/material"
import ExternalLink from "./ExternalLink"

export interface TextBoxProps {
  href: string
  linkTitle: string
  value: string | undefined | object
  label: string
  onChange: (e: string) => void
  helperText?: string | JSX.Element
  extraAction?: JSX.Element
  required?: true
  disabled?: boolean
  id?: string
}

const TextBox: React.FC<TextBoxProps> = ({
  href,
  linkTitle,
  label,
  value,
  onChange,
  required,
  helperText,
  disabled,
  extraAction,
  id,
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
      size="medium"
      variant="outlined"
      fullWidth
      label={label}
      value={value === undefined ? "" : value}
      onChange={e => onChange(e.target.value)}
      required={required}
      helperText={helperText}
      disabled={disabled}
      multiline={true}
      maxRows={15}
      minRows={15}
    />
  )
}

export default TextBox
