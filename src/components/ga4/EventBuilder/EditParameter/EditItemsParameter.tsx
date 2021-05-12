// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react"

import makeStyles from "@material-ui/core/styles/makeStyles"

import ParameterList from "../ParameterList"
import {
  Item,
  Parameter,
  defaultStringParam,
  MPEvent,
  ItemArrayParam,
  defaultNumberParam,
} from "../types"
import { DAB, SAB } from "@/components/Buttons"
import WithHelpText from "@/components/WithHelpText"
import { IsCustomEventCtx, ModifyParameterCtx } from "../EditEvent"
import { ShowAdvancedCtx } from ".."
import useFormStyles from "@/hooks/useFormStyles"

const useStyles = makeStyles(theme => ({
  itemsRow: {
    display: "flex",
    "&> :not(:last-child)": {
      marginRight: theme.spacing(1),
    },
    "&> :first-child": {
      marginTop: theme.spacing(1),
    },
    "&> :not(:first-child)": {
      flexGrow: 1,
    },
  },
  deleteRow: {
    display: "flex",
    alignItems: "baseline",
    "&> *:not(:first-child)": {
      flexGrow: 1,
    },
  },
  items: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(3),
    },
    "&> :last-child": {
      marginTop: theme.spacing(2),
    },
  },
  itemTitle: {
    margin: "unset",
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  removeItem: {
    marginLeft: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
}))

interface EditItemProps {
  item: Item
  updateItem: (update: (old: Item) => Item) => void
  updateParameterName: (oldName: string, nuName: string) => void
  isFirst: boolean
  className?: string
  idx: number
  removeItem: () => void
}

const EditItem: React.FC<EditItemProps> = ({
  item,
  updateItem,
  className,
  idx,
  removeItem,
}) => {
  const classes = useStyles()
  const parameters = React.useMemo<Parameter[]>(() => item.parameters, [item])

  const updateParameter = React.useCallback(
    (idx: number, nuParameter: Parameter) => {
      updateItem(old => {
        const nu = old.parameters.map((p, i) => (i === idx ? nuParameter : p))
        return {
          ...old,
          parameters: nu,
        }
      })
    },
    [updateItem]
  )
  const addParameter = React.useCallback(
    (type: "number" | "string" | "items") => {
      updateItem(old => {
        const nuParameter =
          type === "number" ? defaultNumberParam("") : defaultStringParam("")
        const nu = old.parameters.concat([nuParameter])
        return {
          ...old,
          parameters: nu,
        }
      })
    },
    [updateItem]
  )

  const removeParameter = React.useCallback(
    (idx: number) => {
      updateItem(old => {
        const nu = old.parameters.filter((_, i) => i !== idx)
        return {
          ...old,
          parameters: nu,
        }
      })
    },
    [updateItem]
  )

  const updateName = React.useCallback(
    (idx: number, nuName: string) => {
      updateItem(old => {
        const nu = old.parameters.map((p, i) =>
          i === idx ? { ...p, name: nuName } : p
        )
        return {
          ...old,
          parameters: nu,
        }
      })
    },
    [updateItem]
  )

  return (
    <div className={className}>
      <ModifyParameterCtx.Provider
        value={{ addParameter, updateName, removeParameter, updateParameter }}
      >
        <ParameterList isItemParameter parameters={parameters}>
          <div className={classes.spacer} />
          <DAB
            delete
            small
            onClick={removeItem}
            title={`delete item ${idx + 1}`}
          >
            item
          </DAB>
        </ParameterList>
      </ModifyParameterCtx.Provider>
    </div>
  )
}

interface EditItemArrayParameterProps {
  items: ItemArrayParam
  updateParameter: (nu: ItemArrayParam) => void
  remove: () => void
}

const EditArrayParameter: React.FC<EditItemArrayParameterProps> = ({
  items,
  updateParameter,
  remove,
}) => {
  const formClasses = useFormStyles()
  const classes = useStyles()
  const showAdvanced = React.useContext(ShowAdvancedCtx)
  const [localValues, setLocalValues] = React.useState<Array<Item>>(items.value)
  const isCustomEvent = React.useContext(IsCustomEventCtx)

  React.useEffect(() => {
    if (localValues !== items.value) {
      updateParameter({ ...items, value: localValues })
    }
  }, [localValues, items, updateParameter])

  const addItem = React.useCallback(() => {
    setLocalValues(old => {
      const nu = old.concat([{ parameters: [] }])
      updateParameter({ ...items, value: nu })
      return nu
    })
  }, [updateParameter, items])

  const removeItem = React.useCallback(
    (idx: number) => {
      setLocalValues(old =>
        old.slice(0, idx).concat(old.slice(idx + 1, old.length))
      )
    },
    [setLocalValues]
  )

  const updateItem = React.useCallback(
    (idx: number) => (cb: (old: Item) => Item) =>
      setLocalValues(old =>
        old.map((item, i) => (idx === i ? cb(item) : item))
      ),
    []
  )

  const updateParameterName = React.useCallback(
    (idx: number) => (oldName: string, nuName: string) => {
      setLocalValues(old =>
        old.map((item, i) => {
          if (idx !== i) {
            return item
          }
          const nuParameters = item.parameters.map(p =>
            p.name === oldName ? { ...p, name: nuName } : p
          )
          if (MPEvent.hasDuplicateNames(nuParameters)) {
            return item
          }
          return {
            ...item,
            parameters: nuParameters,
          }
        })
      )
    },
    [setLocalValues]
  )

  return (
    <section className={classes.itemsRow}>
      <WithHelpText hrGroup label="items">
        <section className={classes.items}>
          {localValues.map((item, idx) => (
            <WithHelpText
              notched
              key={`item-${idx}`}
              label={<>item {idx + 1}</>}
            >
              <EditItem
                removeItem={() => removeItem(idx)}
                idx={idx}
                updateParameterName={updateParameterName(idx)}
                item={item}
                isFirst={idx === 0}
                updateItem={updateItem(idx)}
              />
            </WithHelpText>
          ))}
          <section className={formClasses.buttonRow}>
            <SAB add small onClick={addItem} title="add item parameter">
              item
            </SAB>
            {(showAdvanced || isCustomEvent) && (
              <DAB delete small onClick={remove} title="remove items parameter">
                parameter
              </DAB>
            )}
          </section>
        </section>
      </WithHelpText>
    </section>
  )
}
export default EditArrayParameter
