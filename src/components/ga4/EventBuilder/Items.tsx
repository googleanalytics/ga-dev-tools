import * as React from "react"

import { styled } from '@mui/material/styles';

import { Parameter } from "./types"
import WithHelpText from "@/components/WithHelpText"
import { DAB, SAB } from "@/components/Buttons"
import { ShowAdvancedCtx } from "."
import Parameters from "./Parameters"

const PREFIX = 'Items';

const classes = {
  items: `${PREFIX}-items`,
  buttonRow: `${PREFIX}-buttonRow`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`&.${classes.items}`]: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(3),
    },
    "&> :last-child": {
      marginTop: theme.spacing(1),
    },
  },
  [`& .${classes.buttonRow}`]: {
    display: "flex",
    "&> *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  }
}));

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

  return (
    <Root className={classes.items}>
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
      <div className={classes.buttonRow} >
        <SAB add title="add item" small onClick={addItem}>
          item
        </SAB>
        <div /* className={formClasses.grow} */ />
        {showAdvanced && (
          <DAB delete title="remove item parameter" small onClick={removeItems}>
            item
          </DAB>
        )}
      </div>
    </Root>
  );
}

export default Items
