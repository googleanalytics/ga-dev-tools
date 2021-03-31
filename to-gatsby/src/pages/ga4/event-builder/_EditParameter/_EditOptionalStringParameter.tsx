import React from "react"
import { StringParam } from "../_types/_index"
import { TextField } from "@material-ui/core"

interface EditOptionalStringParameterProps {
  parameter: StringParam
  updateParameter: (nu: StringParam) => void
  className?: string
}

const EditOptionalStringParameter: React.FC<EditOptionalStringParameterProps> = ({
  parameter,
  updateParameter,
  className,
}) => {
  const [localValue, setLocalValue] = React.useState(parameter.value)

  const updateWithLocalParameter = React.useCallback(() => {
    if (localValue !== parameter.value) {
      updateParameter({ ...parameter, value: localValue })
    }
  }, [localValue, parameter, updateParameter])

  return (
    <TextField
      className={className}
      value={localValue}
      variant="outlined"
      size="small"
      label="Parameter Value"
      onChange={e => {
        setLocalValue(e.target.value)
      }}
      onBlur={updateWithLocalParameter}
    />
  )
}

export default EditOptionalStringParameter
