import * as React from "react"
import { useState } from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import { Dispatch } from "../types"

interface SeparatedInputProps {
  label: string
  options?: string[]
  className?: string
  values: string[]
  setValues?: Dispatch<string[]>
  onChange?: (values: string[]) => void
}
const SeparatedInput: React.FC<SeparatedInputProps> = ({
  label,
  options,
  className,
  values,
  setValues,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState("")

  return (
    <Autocomplete
      className={className}
      size="small"
      multiple
      freeSolo
      options={options || []}
      value={values}
      inputValue={inputValue}
      limitTags={3}
      onChange={(_event, newValue) => {
        setValues && setValues(newValue)
        onChange && onChange(newValue)
      }}
      onInputChange={(_event, newInputValue) => {
        const options = newInputValue.split(",")
        if (options.length > 1) {
          const nu = values
            .concat(options)
            .map(x => x.trim())
            .filter(x => x)
          setValues && setValues(nu)
          onChange && onChange(nu)
        } else {
          setInputValue(newInputValue)
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          placeholder={values.length === 0 ? "comma separated" : undefined}
        />
      )}
    />
  )
}

export default SeparatedInput
