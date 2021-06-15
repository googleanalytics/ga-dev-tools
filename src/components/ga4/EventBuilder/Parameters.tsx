import { DAB, SAB } from "@/components/Buttons"
import useFormStyles from "@/hooks/useFormStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import * as React from "react"
import { ShowAdvancedCtx } from "."
import Parameter from "./Parameter"
import { Parameter as ParameterT } from "./types"

const useStyles = makeStyles(theme => ({
  parameters: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

interface Props {
  parameters: ParameterT[]
  setParamName: (idx: number, name: string) => void
  setParamValue: (idx: number, value: string) => void
  addStringParam: () => void
  addNumberParam: () => void
  removeParam: (idx: number) => void
  removeItem?: () => void
  addItemsParam?: () => void
}

const Parameters: React.FC<Props> = ({
  parameters,
  setParamName,
  setParamValue,
  addStringParam,
  addNumberParam,
  removeParam,
  addItemsParam,
  removeItem,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)
  const classes = useStyles()
  const formClasses = useFormStyles()

  return (
    <section className={classes.parameters}>
      {parameters.map((parameter, idx) => (
        <Parameter
          key={`parameter-${parameter.name}-idx`}
          parameter={parameter}
          setParamName={name => setParamName(idx, name)}
          setParamValue={value => setParamValue(idx, value)}
          removeParam={() => removeParam(idx)}
        />
      ))}
      <section className={formClasses.buttonRow}>
        {showAdvanced && (
          <>
            <SAB
              add
              small
              title="add string parameter"
              onClick={addStringParam}
            >
              string
            </SAB>
            <SAB
              add
              small
              title="add number parameter"
              onClick={addNumberParam}
            >
              number
            </SAB>
            {addItemsParam !== undefined && (
              <SAB
                add
                small
                title="add items parameter"
                onClick={addItemsParam}
              >
                items
              </SAB>
            )}
          </>
        )}
        {removeItem !== undefined && (
          <>
            <div className={formClasses.grow} />
            <DAB delete small title="remove item" onClick={removeItem}>
              item
            </DAB>
          </>
        )}
      </section>
    </section>
  )
}

export default Parameters
