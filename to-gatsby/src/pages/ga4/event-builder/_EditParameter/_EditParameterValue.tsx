import React from "react"
import { Parameter, ParameterType } from "../_types/_index"
import EditOptionalStringParameter from "./_EditOptionalStringParameter"
import EditItemsParameter from "./_EditItemsParameter"
import EditOptionalNumberParameter from "./_EditOptionalNumberParameter"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  editParameter: {
    flexGrow: 5,
  },
}))

interface EditParameterValueProps {
  parameter: Parameter
  updateParameter: (nu: Parameter) => void
}

const EditParameterValue: React.FC<EditParameterValueProps> = ({
  parameter,
  updateParameter,
}) => {
  const classes = useStyles()
  switch (parameter.type) {
    case ParameterType.String:
      return (
        <EditOptionalStringParameter
          className={classes.editParameter}
          parameter={parameter}
          updateParameter={updateParameter}
        />
      )
    case ParameterType.Items:
      return (
        <EditItemsParameter
          items={parameter}
          updateParameter={updateParameter}
        />
      )
    case ParameterType.Number:
      return (
        <EditOptionalNumberParameter
          className={classes.editParameter}
          parameter={parameter}
          updateParameter={updateParameter}
        />
      )
  }
}

export default EditParameterValue
