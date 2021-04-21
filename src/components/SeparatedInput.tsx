import * as React from "react"
import { useState } from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"

interface SeparatedInputProps {
  label: string
  initialValues: string[]
  options?: string[]
  className?: string
}
const SeparatedInput: React.FC<SeparatedInputProps> = ({
  label,
  initialValues,
  options,
  className,
}) => {
  const [value, setValue] = useState<string[]>(initialValues)
  const [inputValue, setInputValue] = useState("")
  return (
    <Autocomplete
      className={className}
      size="small"
      multiple
      freeSolo
      options={options || []}
      value={value}
      inputValue={inputValue}
      onChange={(_event, newValue) => {
        setValue(newValue)
      }}
      onInputChange={(_event, newInputValue) => {
        const options = newInputValue.split(",")
        if (options.length > 1) {
          setValue(
            value
              .concat(options)
              .map(x => x.trim())
              .filter(x => x)
          )
        } else {
          setInputValue(newInputValue)
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          placeholder={value.length === 0 ? "comma separated" : undefined}
        />
      )}
    />
  )
}

export default SeparatedInput
