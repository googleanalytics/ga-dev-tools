import * as React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"
import { Parameter } from "./types"
import WithHelpText from "@/components/WithHelpText"
import { DAB, SAB } from "@/components/Buttons"
import { ShowAdvancedCtx } from "."
import Parameters from "./Parameters"
import useFormStyles from "@/hooks/useFormStyles"

const useStyles = makeStyles(theme => ({
  items: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(3),
    },
    "&> :last-child": {
      marginTop: theme.spacing(1),
    },
  },
}))

interface Props {
  items: Parameter[][]
  addItem: () => void
  removeItem: (idx: number) => void
  removeItems: () => void
  addItemStringParam: (idx: number) => void
  addItemNumberParam: (idx: number) => void
  setItemParamName: (idx: number, itemIdx: number, name: string) => void
  setItemParamValue: (idx: number, itemIdx: number, value: string) => void
  removeItemParam: (idx: number, itemIdx: number) => void
}

const Items: React.FC<Props> = ({
  items,
  addItem,
  removeItem,
  addItemStringParam,
  addItemNumberParam,
  setItemParamName,
  setItemParamValue,
  removeItemParam,
  removeItems,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)
  const classes = useStyles()
  const formClasses = useFormStyles()
  return (
    <section className={classes.items}>
      {items.map((item, idx) => (
        <WithHelpText
          hrGroup={!showAdvanced}
          notched={showAdvanced}
          label={`item ${idx + 1}`}
          key={`item-${idx}`}
        >
          <Parameters
            parameters={item}
            setParamName={(itemIdx: number, name: string) =>
              setItemParamName(idx, itemIdx, name)
            }
            setParamValue={(itemIdx: number, value: string) =>
              setItemParamValue(idx, itemIdx, value)
            }
            addStringParam={() => addItemStringParam(idx)}
            addNumberParam={() => addItemNumberParam(idx)}
            removeParam={(itemIdx: number) => removeItemParam(idx, itemIdx)}
            removeItem={() => removeItem(idx)}
          />
        </WithHelpText>
      ))}
      <div className={formClasses.buttonRow}>
        <SAB add title="add item" small onClick={addItem}>
          item
        </SAB>
        <div className={formClasses.grow} />
        {showAdvanced && (
          <DAB delete title="remove item parameter" small onClick={removeItems}>
            item
          </DAB>
        )}
      </div>
    </section>
  )
}

export default Items
