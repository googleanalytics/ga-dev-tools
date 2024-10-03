import * as React from "react"
import { FormControlLabel, Checkbox } from "@mui/material"
import { Dispatch } from "../types"
import {PropsWithChildren} from 'react';

interface LabeledCheckboxProps {
  checked: boolean
  setChecked?: Dispatch<boolean>
  onChange?: (c: boolean) => void
  disabled?: boolean
  className?: string
  checkboxClassName?: string
  id?: string
}

const LabeledCheckbox: React.FC<PropsWithChildren<LabeledCheckboxProps>> = ({
  checked,
  setChecked,
  onChange,
  children,
  className,
  checkboxClassName,
  disabled,
  id,
}) => {
  return (
    <FormControlLabel
      className={className}
      control={
        <Checkbox
          id={id}
          className={checkboxClassName}
          size="small"
          checked={checked}
          disabled={disabled}
          onChange={e => {
            if (setChecked !== undefined) {
              setChecked(e.target.checked)
            }
            if (onChange !== undefined) {
              onChange(e.target.checked)
            }
          }}
        />
      }
      label={children}
    />
  )
}

export default LabeledCheckbox
