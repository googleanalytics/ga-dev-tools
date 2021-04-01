import React from "react"
import LinkedTextField, { LinkedTextFieldProps } from "./LinkedTextField"

interface GADateProps extends LinkedTextFieldProps {}

const GADate: React.FC<GADateProps> = ({
  linkTitle,
  href,
  helperText,
  label,
  value,
  onChange,
  required,
}) => {
  return (
    <LinkedTextField
      href={href}
      linkTitle={linkTitle}
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      helperText={helperText}
    />
  )
}

export default GADate
