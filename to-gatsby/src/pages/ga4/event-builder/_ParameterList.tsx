import React from "react"
import EditParameter from "./_EditParameter/_index"
import { Parameter, Parameters as ParametersT } from "./_types/_index"
import { Button } from "@material-ui/core"
import { AddCircle } from "@material-ui/icons"

interface ParameterListProps {
  indentation?: number
  parameters: Parameter[]
  updateParameters: (update: (old: ParametersT) => ParametersT) => void
  addParameter: () => void
  isNested: boolean
}

const Parameters: React.FC<ParameterListProps> = ({
  indentation,
  parameters,
  updateParameters,
  addParameter,
  children,
  isNested,
}) => {
  const updateParameter = React.useCallback(
    (parameter: Parameter) => (nu: Parameter) => {
      updateParameters(old =>
        old.map(p => (p.name === parameter.name ? nu : p))
      )
    },
    [updateParameters]
  )

  const updateName = React.useCallback(
    (oldName: string, nuName: string) => {
      updateParameters(old =>
        old.map(p => (p.name === oldName ? { ...p, name: nuName } : p))
      )
    },
    [updateParameters]
  )

  const remove = React.useCallback(
    (parameter: Parameter) => () => {
      updateParameters(old => old.filter(p => p.name !== parameter.name))
    },
    [updateParameters, addParameter]
  )

  return (
    <div className={`ParameterList indent-${indentation}`}>
      {parameters.map(parameter => (
        <EditParameter
          remove={remove(parameter)}
          updateName={updateName}
          isNested={isNested}
          key={parameter.name}
          parameter={parameter}
          updateParameter={updateParameter(parameter)}
        />
      ))}
      <div className="HitBuilderParam buttons">
        <Button
          color="primary"
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={addParameter}
        >
          Parameter
        </Button>
        {children}
      </div>
    </div>
  )
}

export default Parameters
