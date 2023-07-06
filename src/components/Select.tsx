import * as React from "react"
import { styled } from '@mui/material/styles';
import { TextField } from "@mui/material"
import clsx from "classnames"
import { Dispatch } from "../types"
import Autocomplete from "@mui/material/Autocomplete"

const PREFIX = 'Select';

const classes = {
  formControl: `${PREFIX}-formControl`
};

const StyledTextField
 = styled(TextField
)(() => ({
  [`& .${classes.formControl}`]: {
    minWidth: "15ch",
  }
}));

export interface SelectOption {
  value: string
  displayName: string
}

interface SelectProps {
  options: SelectOption[]
  value: SelectOption | undefined
  setValue?: Dispatch<SelectOption | undefined>
  onChange?: (nu: SelectOption | undefined) => void
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
  fullWidth = false,
}) => {


  return (
    <Autocomplete<SelectOption, false, true, false>
      disableClearable
      className={clsx(classes.formControl, className)}
      autoHighlight
      autoSelect
      options={options}
      getOptionLabel={option => option.displayName}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      value={(value || null) as any}
      onChange={(_event, value) => {
        if (onChange !== undefined) {
          onChange(value === null ? undefined : (value as SelectOption))
        }
        if (setValue !== undefined) {
          setValue(value === null ? undefined : (value as SelectOption))
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
