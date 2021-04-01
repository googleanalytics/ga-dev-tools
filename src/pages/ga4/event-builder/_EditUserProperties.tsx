import React from "react"
import EditParameter from "./_EditParameter/_index"

import { Parameters, defaultStringParam, Parameter } from "./_types/_index"
import { Button, Typography } from "@material-ui/core"
import { AddCircle } from "@material-ui/icons"

interface EditUserPropertiesProps {
  user_properties: Parameters
  setUserProperties: React.Dispatch<React.SetStateAction<Parameters>>
}

const EditUserProperties: React.FC<EditUserPropertiesProps> = ({
  user_properties,
  setUserProperties,
}) => {
  const addProperty = React.useCallback(() => {
    setUserProperties(old => old.concat([defaultStringParam("", true)]))
  }, [setUserProperties])

  const updatePropertyName = React.useCallback(
    (idx: number) => (_oldName: string, nuName: string) => {
      setUserProperties(old =>
        old.map((property, i) =>
          idx === i ? { ...property, name: nuName } : property
        )
      )
    },
    [setUserProperties]
  )
  const removeProperty = React.useCallback(
    (idx: number) => () => {
      setUserProperties(old => old.filter((_, i) => i !== idx))
    },
    [setUserProperties]
  )
  const updateProperty = React.useCallback(
    (idx: number) => (nu: Parameter) => {
      setUserProperties(old =>
        old.map((current, i) => (i === idx ? nu : current))
      )
    },
    [setUserProperties]
  )
  return (
    <>
      <Typography variant="h3">User Properties</Typography>
      {user_properties.length === 0 ? (
        <section>
          <Typography>No user properties configured.</Typography>
          <Button
            startIcon={<AddCircle />}
            variant="outlined"
            color="primary"
            onClick={addProperty}
          >
            User Property
          </Button>
        </section>
      ) : (
        <section>
          {user_properties.map((property, idx) => (
            <EditParameter
              key={`userProperty-${idx}`}
              updateParameter={updateProperty(idx)}
              isNested={false}
              parameter={property}
              updateName={updatePropertyName(idx)}
              remove={removeProperty(idx)}
            />
          ))}
          <Button
            startIcon={<AddCircle />}
            variant="outlined"
            onClick={addProperty}
          >
            User Property
          </Button>
        </section>
      )}
    </>
  )
}
export default EditUserProperties
