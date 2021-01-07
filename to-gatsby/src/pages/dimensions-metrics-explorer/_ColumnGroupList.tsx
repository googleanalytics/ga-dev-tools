// Copyright 2019 Google Inc. All rights reserved.
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

import * as React from "react"
import { groupBy, map, sortBy, keyBy } from "lodash"
import { Set } from "immutable"
import { navigate } from "gatsby"

import { CubesByColumn } from "./_cubes"

import Accordian from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { RemoveCircle, AddCircle, Info } from "@material-ui/icons"

import { AutoScrollDiv } from "../../components/AutoScroll"
import { Typography, makeStyles, IconButton } from "@material-ui/core"
import { Column } from "../../api"

const useStyles = makeStyles(theme => ({
  expandContract: {
    margin: theme.spacing(1),
  },
  columnDetails: {
    display: "grid",
    "grid-template-columns": "50% 50%",
  },
  columnLabel: {
    display: "flex",
    alignItems: "center",
    "flex-wrap": "wrap",
  },
  name: { marginRight: theme.spacing(1) },
  id: {},
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}))

type ColumnLabelProps = {
  column: Column
}
const ColumnLabel: React.FC<ColumnLabelProps> = ({ column }) => {
  const classes = useStyles()
  const slug = `/dimensions-metrics-explorer/${
    column.attributes?.group.replace(/ /g, "-").toLowerCase() || ""
  }/#${column.id.replace("ga:", "")}`

  return (
    <div className={classes.columnLabel}>
      <Typography component="span" className={classes.name}>
        {column.attributes?.uiName}
      </Typography>
      <Typography color="primary" component="span" className={classes.id}>
        {column.id}
      </Typography>
      <IconButton onClick={() => navigate(slug)}>
        <Info />
      </IconButton>
    </div>
  )
}

const SelectableColumn: React.FC<{
  column: Column
  selected: boolean
  disabled: boolean
  setSelected: (selected: boolean) => void
}> = ({ column, selected, disabled, setSelected }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={selected}
          disabled={disabled}
          onChange={event => setSelected(event.target.checked)}
        />
      }
      label={<ColumnLabel column={column} />}
    />
  )
}

const ColumnSubgroup: React.FC<{
  columns: Column[]
  name: "Dimensions" | "Metrics"
  allowableCubes: Set<string>
  cubesByColumn: CubesByColumn
  selectedColumns: Set<string>
  selectColumn: (column: string, selected: boolean) => void
}> = ({
  columns,
  name,
  selectColumn,
  selectedColumns,
  allowableCubes,
  cubesByColumn,
}) => {
  // Move deprecated columns to the bottom
  const sortedColumns = React.useMemo(
    () =>
      sortBy(columns, column =>
        column.attributes?.status === "PUBLIC" ? 0 : 1
      ),
    [columns]
  )

  return (
    <div>
      <Typography variant="subtitle1">{name}</Typography>
      <div>
        {sortedColumns.map(column => {
          const disabled =
            allowableCubes.intersect(cubesByColumn.get(column.id!, Set()))
              .size === 0
          return (
            <SelectableColumn
              column={column}
              key={column.id}
              setSelected={selected => selectColumn(column.id!, selected)}
              disabled={disabled}
              selected={selectedColumns.contains(column.id!)}
            />
          )
        })}
      </div>
    </div>
  )
}

const ColumnGroup: React.FC<{
  open: boolean
  toggleOpen: () => void
  name: string
  columns: Column[]
  allowableCubes: Set<string>
  cubesByColumn: CubesByColumn
  selectedColumns: Set<string>
  selectColumn: (column: string, selected: boolean) => void
}> = ({
  open,
  toggleOpen,
  name,
  columns,
  allowableCubes,
  cubesByColumn,
  selectedColumns,
  selectColumn,
}) => {
  const classes = useStyles()
  return (
    <Accordian
      expanded={open}
      onChange={toggleOpen}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {name}
      </AccordionSummary>
      <AccordionDetails className={classes.columnDetails}>
        <ColumnSubgroup
          name="Dimensions"
          columns={columns.filter(
            column => column.attributes?.type === "DIMENSION"
          )}
          allowableCubes={allowableCubes}
          cubesByColumn={cubesByColumn}
          selectColumn={selectColumn}
          selectedColumns={selectedColumns}
        />
        <ColumnSubgroup
          name="Metrics"
          columns={columns.filter(
            column => column.attributes?.type === "METRIC"
          )}
          allowableCubes={allowableCubes}
          cubesByColumn={cubesByColumn}
          selectColumn={selectColumn}
          selectedColumns={selectedColumns}
        />
      </AccordionDetails>
    </Accordian>
  )
}

const ColumnGroupList: React.FC<{
  allowDeprecated: boolean
  searchTerms: string[]
  onlySegments: boolean
  cubesByColumn: CubesByColumn
  allCubes: Set<string>
  columns: Column[]
}> = ({
  allowDeprecated,
  searchTerms,
  onlySegments,
  columns,
  cubesByColumn,
  allCubes,
}) => {
  const classes = useStyles()
  const filteredColumns = React.useMemo(() => {
    let filtered: Column[] = columns

    if (!allowDeprecated) {
      filtered = filtered.filter(
        column => column.attributes?.status !== "DEPRECATED"
      )
    }

    if (onlySegments) {
      filtered = filtered.filter(
        column => column.attributes?.allowedInSegments === "true"
      )
    }

    filtered = filtered.filter(column =>
      searchTerms.every(
        term =>
          column.id!.toLowerCase().indexOf(term) !== -1 ||
          column.attributes?.uiName?.toLowerCase().indexOf(term) !== -1
      )
    )

    return filtered
  }, [columns, allowDeprecated, onlySegments, searchTerms])

  // Group all columns by Id
  const columnsByLowerId = React.useMemo(
    () => keyBy(filteredColumns, column => column.id!.toLowerCase()),
    [filteredColumns]
  )

  // Group all the columns by group
  const groupedColumns = React.useMemo(
    () =>
      // JS Sets guarantee insertion order is preserved, which is important
      // because the key order in this groupBy determines the order that
      // they appear in the UI.
      groupBy(filteredColumns, column => column.attributes?.group),
    [filteredColumns]
  )

  // Set of column groups that are currently expanded.
  const [open, setOpen] = React.useState<Set<string>>(() => Set())

  // Expand/Collapse callbacks
  const toggleGroupOpen = React.useCallback(
    (group: string) =>
      setOpen(oldOpen =>
        oldOpen.contains(group) ? oldOpen.remove(group) : oldOpen.add(group)
      ),
    [setOpen]
  )

  const collapseAll = React.useCallback(() => setOpen(Set()), [setOpen])

  const expandAll = React.useCallback(
    () => setOpen(Set.fromKeys(groupedColumns)),
    [setOpen, groupedColumns]
  )

  // When a search term is entered, auto-expand all groups. When the search
  // terms are cleared, auto-collapse all groups.
  React.useEffect(() => {
    if (searchTerms.length === 0) {
      collapseAll()
    } else {
      expandAll()
    }
  }, [searchTerms.length, collapseAll, expandAll])

  // When the page loads, if there is a fragment, auto-expand the group
  // containing that fragment. Make sure this effect happens after the
  // auto-expand or auto-collapse hook, above.
  React.useEffect(() => {
    const fragment = window.location.hash.replace(/^#/, "").toLowerCase()
    const selectedColumn = columnsByLowerId[fragment]
    if (selectedColumn !== undefined) {
      setOpen(oldOpen => oldOpen.add(selectedColumn.attributes!.group!))
    }
  }, [setOpen, columnsByLowerId])

  // selectedColumns is the set of selected columns Each column is
  // associated with one or more "cubes", and a only columns that share
  // cubes may be mutually selected.
  const [selectedColumns, setSelectedColumns] = React.useState<Set<string>>(
    () => Set()
  )

  const selectColumn = React.useCallback(
    (column: string, selected: boolean) =>
      setSelectedColumns(oldSelected =>
        selected ? oldSelected.add(column) : oldSelected.remove(column)
      ),
    [setSelectedColumns]
  )

  // The set of allowable cubes. When any columns are selected, the set of
  // allowable cubes is the intersection of the cubes for those columns
  const allowableCubes = React.useMemo<Set<string>>(
    () =>
      selectedColumns
        .map(columnId => cubesByColumn.get(columnId) || (Set() as Set<string>))
        .reduce((cubes1, cubes2) => cubes1.intersect(cubes2), allCubes),
    [selectedColumns, cubesByColumn, allCubes]
  )

  const showExpandAll = open.size < Object.keys(groupedColumns).length
  const showCollapseAll = open.size > 0
  return (
    <div>
      <div>
        {showExpandAll ? (
          <Button
            variant="outlined"
            className={classes.expandContract}
            endIcon={<AddCircle />}
            onClick={expandAll}
          >
            Expand All
          </Button>
        ) : null}
        {showCollapseAll ? (
          <Button
            variant="outlined"
            className={classes.expandContract}
            endIcon={<RemoveCircle />}
            onClick={collapseAll}
          >
            Hide All
          </Button>
        ) : null}
      </div>
      <div>
        {map(groupedColumns, (columns, groupName) => (
          <ColumnGroup
            open={open.contains(groupName)}
            columns={columns}
            name={groupName}
            key={groupName}
            toggleOpen={() => toggleGroupOpen(groupName)}
            allowableCubes={allowableCubes}
            cubesByColumn={cubesByColumn}
            selectedColumns={selectedColumns}
            selectColumn={selectColumn}
          />
        ))}
      </div>
    </div>
  )
}

export default ColumnGroupList
