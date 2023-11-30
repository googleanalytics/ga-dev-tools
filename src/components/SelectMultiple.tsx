import * as React from "react"
import { TextField } from "@mui/material"
import clsx from "classnames"
import { Dispatch } from "../types"
import Autocomplete from "@mui/material/Autocomplete"

export interface SelectOption {
  value: string
  displayName: string
}

interface SelectProps {
  options: SelectOption[]
  value: SelectOption[] | undefined
  setValue?: Dispatch<SelectOption[] | undefined>
  onChange?: (nu: SelectOption[] | undefined) => void
  label: JSX.Element | string
  className?: string
  required?: boolean
  helperText?: string
  fullWidth?: boolean
}

const Select: React.FC<SelectProps> = ({
  value,
  setValue,
  options,
  label,
  className,
  required,
  onChange,
  helperText,
}) => {


  return (
    <Autocomplete<SelectOption, true, true, false>
      multiple
      className={className}
      autoHighlight
      autoSelect
      options={options}
      getOptionLabel={option => option.displayName}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      value={(value || null) as any}
      onChange={(_event, value) => {
        if (onChange !== undefined) {
          onChange(value === null ? undefined : (value as SelectOption[]))
        }
        if (setValue !== undefined) {
          setValue(value === null ? undefined : (value as SelectOption[]))
        }
      }}
      renderOption={(props, option) => (
          <li {...props}>
            {option.displayName}
          </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          required={required}
          label={label}
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export default Select
