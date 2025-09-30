import { DAB, SAB } from "@/components/Buttons"
import { styled } from '@mui/material/styles';
import * as React from "react"
import { ShowAdvancedCtx } from "."
import Parameter from "./Parameter"
import { Parameter as ParameterT } from "./types"

const PREFIX = 'Parameters';

const classes = {
  buttonRow: `${PREFIX}-buttonRow`,
  parameters: `${PREFIX}-parameters`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`&.${classes.parameters}`]: {
    "&> :not(:first-child)": {
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
  parameters: ParameterT[]
  setParamName: (idx: number, name: string) => void
  setParamValue: (idx: number, value: string) => void
  setParamTimestamp: (idx: number, value: number | undefined) => void
  addStringParam: () => void
  addNumberParam: () => void
  removeParam: (idx: number) => void
  removeItem?: () => void
  addItemsParam?: () => void
  allowTimestampOverride: boolean
}

const Parameters: React.FC<Props> = ({
  parameters,
  setParamName,
  setParamValue,
  setParamTimestamp,
  addStringParam,
  addNumberParam,
  removeParam,
  addItemsParam,
  removeItem,
  allowTimestampOverride,
}) => {
  const showAdvanced = React.useContext(ShowAdvancedCtx)

  return (
    <Root className={classes.parameters}>
      {parameters.map((parameter, idx) => (
        <Parameter
          key={`parameter-${parameter.name}-idx`}
          parameter={parameter}
          setParamName={name => setParamName(idx, name)}
          setParamValue={value => setParamValue(idx, value)}
          setParamTimestamp={setParamTimestamp}
          idx={idx}
          removeParam={() => removeParam(idx)}
          allowTimestampOverride={allowTimestampOverride}
        />
      ))}
      <section className={classes.buttonRow} >
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
            <div /* className={formClasses.grow} *//>
            <DAB delete small title="remove item" onClick={removeItem}>
              item
            </DAB>
          </>
        )}
      </section>
    </Root>
  );
}

export default Parameters
