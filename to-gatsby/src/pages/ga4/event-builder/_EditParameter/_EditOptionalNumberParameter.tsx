import React from "react"
import { NumberParam } from "../_types/_index"
import { TextField } from "@material-ui/core"

interface EditOptionalNumberParameterProps {
  parameter: NumberParam
  updateParameter: (nu: NumberParam) => void
  className?: string
}

const EditOptionalNumberParameter: React.FC<EditOptionalNumberParameterProps> = ({
  parameter,
  updateParameter,
  className,
}) => {
  const [localValue, setLocalValue] = React.useState<string>(
    parameter.value === undefined ? "" : parameter.value.toString()
  )

  const updateWithLocalParameter = React.useCallback(() => {
    const parsed = parseFloat(localValue)
    if (isNaN(parsed)) {
      setLocalValue("")
      return updateParameter({ ...parameter, value: undefined })
    }
    if (parsed !== parameter.value) {
      return updateParameter({ ...parameter, value: parsed })
    }
  }, [localValue, parameter, updateParameter])

  return (
    <TextField
      variant="outlined"
      label="Parameter Value"
      className={className}
      size="small"
      value={localValue}
      onChange={e => {
        setLocalValue(e.target.value)
      }}
      onBlur={updateWithLocalParameter}
    />
  )
}

export default EditOptionalNumberParameter
