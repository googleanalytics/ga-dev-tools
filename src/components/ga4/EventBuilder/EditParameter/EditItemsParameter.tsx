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
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import AddCircle from "@material-ui/icons/AddCircle"
import RemoveCircle from "@material-ui/icons/RemoveCircle"

import ParameterList from "../ParameterList"
import {
  Item,
  Parameter,
  defaultStringParam,
  MPEvent,
  ItemArrayParam,
} from "../types"

const useStyles = makeStyles(theme => ({
  items: {
    //
  },
  item: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  itemTitle: {
    margin: "unset",
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  removeItem: {
    marginLeft: theme.spacing(1),
  },
  addItem: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
}))

interface EditItemProps {
  item: Item
  updateItem: (update: (old: Item) => Item) => void
  updateParameterName: (oldName: string, nuName: string) => void
  isFirst: boolean
}

const EditItem: React.FC<EditItemProps> = ({ item, updateItem }) => {
  const parameters = React.useMemo<Parameter[]>(() => item.parameters, [item])
  const updateParameters = React.useCallback(
    update => {
      updateItem(old => ({ ...old, parameters: update(old.parameters) }))
    },
    [updateItem]
  )
  const addParameter = React.useCallback(() => {
    updateItem(old => {
      const nu = old.parameters.concat([defaultStringParam("")])
      if (MPEvent.hasDuplicateNames(nu)) {
        return old
      }
      return {
        ...old,
        parameters: nu,
      }
    })
  }, [updateItem])
  return (
    <div className="HitBuilderParam">
      <ParameterList
        isNested
        indentation={6}
        parameters={parameters}
        updateParameters={updateParameters}
        addParameter={addParameter}
      ></ParameterList>
    </div>
  )
}

interface EditItemArrayParameterProps {
  items: ItemArrayParam
  updateParameter: (nu: ItemArrayParam) => void
}

const EditArrayParameter: React.FC<EditItemArrayParameterProps> = ({
  items,
  updateParameter,
}) => {
  const classes = useStyles()
  const [localValues, setLocalValues] = React.useState<Array<Item>>(items.value)

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
    (idx: number) => () => {
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
    <div className={classes.items}>
      {localValues.map((item, idx) => (
        <Paper key={`item-${idx}`} className={classes.item}>
          <Typography variant="h5" className={classes.itemTitle}>
            Item {idx + 1}
            <Tooltip title={`Remove Item ${idx}`}>
              <IconButton onClick={removeItem(idx)}>
                <RemoveCircle />
              </IconButton>
            </Tooltip>
          </Typography>
          <EditItem
            updateParameterName={updateParameterName(idx)}
            item={item}
            isFirst={idx === 0}
            updateItem={updateItem(idx)}
          />
        </Paper>
      ))}
      <Button
        className={classes.addItem}
        variant="outlined"
        color="primary"
        startIcon={<AddCircle />}
        onClick={addItem}
      >
        Item
      </Button>
    </div>
  )
}
export default EditArrayParameter
