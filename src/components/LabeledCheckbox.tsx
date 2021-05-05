import * as React from "react"
import { FormControlLabel, Checkbox } from "@material-ui/core"
import { Dispatch } from "../types"

interface LabeledCheckboxProps {
  checked: boolean
  setChecked?: Dispatch<boolean>
  onChange?: (c: boolean) => void
  disabled?: boolean
  className?: string
  checkboxClassName?: string
}

const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  checked,
  setChecked,
  onChange,
  children,
  className,
  checkboxClassName,
  disabled,
}) => {
  return (
    <FormControlLabel
      className={className}
      control={
        <Checkbox
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
