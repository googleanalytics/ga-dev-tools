import * as React from "react"
import {
  Select as MUISelect,
  InputLabel,
  MenuItem,
  FormControl,
  makeStyles,
} from "@material-ui/core"
import { useState, useEffect } from "react"
import clsx from "classnames"
import { Dispatch } from "../types"

export interface SelectOption {
  value: string
  displayName: string | JSX.Element
}

interface SelectProps {
  options: SelectOption[]
  label: JSX.Element | string
  className?: string
  setOption: Dispatch<SelectOption | undefined>
}

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: "10ch",
  },
}))

const Select: React.FC<SelectProps> = ({
  options,
  label,
  className,
  setOption,
}) => {
  const classes = useStyles()
  const [value, setValue] = useState(
    options.length > 0 ? options[0].value : undefined
  )

  useEffect(() => {
    setOption(options.find(o => o.value === value))
  }, [value, setOption, options])

  return (
    <FormControl className={clsx(classes.formControl, className)}>
      <InputLabel>{label}</InputLabel>
      <MUISelect
        value={value}
        onChange={e => setValue(e.target.value as string)}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.displayName}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  )
}

export default Select
