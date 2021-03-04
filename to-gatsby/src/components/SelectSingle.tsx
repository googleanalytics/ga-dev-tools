import React from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { TextField } from "@material-ui/core"

interface SelectSingleProps<T> {
  options: T[]
  getOptionLabel: (t: T) => string
  renderOption: (t: T) => JSX.Element | string
  onSelectedChanged: (t: T | undefined) => void
  label: string
  helperText: string
  serializer: (t: T | undefined) => { serialized: string; key: string }
  deserializer: (t: string) => T | undefined
}

// TODO - Update files so nothing is using AutoComplete directly. This will
// also require making a SelectSingle that's basically the same as this.
const SelectSingle = <T extends any>({
  getOptionLabel,
  options,
  renderOption,
  onSelectedChanged,
  label,
  helperText,
  serializer,
  deserializer,
}: SelectSingleProps<T>) => {
  // TODO - maybe this should also store the available options locally and not
  // just the selected options?
  const [selected, setSelected] = React.useState<T | undefined>(() => {
    // This is a bit lazy, but it works as long as the serializer isn't fancy.
    const { key } = serializer({} as T)
    const asString = window.localStorage.getItem(key)
    if (asString === null) {
      return undefined
    } else {
      return deserializer(asString)
    }
  })

  React.useEffect(() => {
    // Store value in localStorage.
    const { key, serialized } = serializer(selected)
    window.localStorage.setItem(key, serialized)

    onSelectedChanged(selected)
  }, [selected])

  return (
    <Autocomplete<T, false, undefined, true>
      fullWidth
      autoComplete
      autoHighlight
      freeSolo
      options={options}
      getOptionLabel={getOptionLabel}
      value={selected || null}
      onChange={(_event, value, _state) => setSelected(value as T)}
      renderOption={renderOption}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  )
}

export default SelectSingle
