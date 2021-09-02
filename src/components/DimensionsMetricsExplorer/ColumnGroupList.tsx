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

import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import LinkIcon from "@material-ui/icons/Link"
import Button from "@material-ui/core/Button"
import RemoveCircle from "@material-ui/icons/RemoveCircle"
import AddCircle from "@material-ui/icons/AddCircle"
import Info from "@material-ui/icons/Info"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { groupBy, map, sortBy } from "lodash"
import { Set } from "immutable"
import { navigate } from "gatsby"
import classnames from "classnames"

import { CopyIconButton } from "@/components/CopyButton"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import { CUBES_BY_COLUMN_NAME, CUBE_NAMES, CubesByColumnName } from "./cubes"
import { Column } from "@/types/ua"

const useStyles = makeStyles(theme => ({
  accordionTitle: { margin: 0 },
  expandContract: {
    margin: theme.spacing(1),
  },
  column: {
    display: "flex",
    alignItems: "baseline",
    padding: "unset",
  },
  columnSubgroupTitle: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(-1),
    "& > svg": {
      marginRight: theme.spacing(1),
    },
    "& > a": {
      marginLeft: theme.spacing(1),
    },
    display: "flex",
  },
  columnSubgroup: {
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  deprecatedColumn: {
    textDecoration: "line-through",
  },
  checkbox: {
    padding: "unset",
    paddingRight: theme.spacing(1),
  },
  deprecatedCheckbox: {
    padding: "unset",
    paddingRight: theme.spacing(1),
    visibility: "hidden",
  },
  columnDetails: {
    display: "flex",
    flexDirection: "column",
  },
  columnLabel: {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    position: "relative",
    top: theme.spacing(-1),
  },
  columnButton: {
    padding: "unset",
    paddingLeft: theme.spacing(1),
  },
  name: { marginRight: theme.spacing(1) },
  id: {
    "& > button": {
      // display: "none",
      padding: "unset",
      paddingLeft: theme.spacing(1),
    },
    // "&:hover": {
    //   "& > button": {
    //     display: "unset",
    //   },
    // },
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
  labelText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}))

type ColumnLabelProps = {
  column: Column
  isDeprecated: boolean
}
const ColumnLabel: React.FC<ColumnLabelProps> = ({ column, isDeprecated }) => {
  const classes = useStyles()
  const slug = React.useMemo(
    () =>
      `/dimensions-metrics-explorer/${
        column.attributes?.group.replace(/ /g, "-").toLowerCase() || ""
      }#${column.id?.replace("ga:", "")}`,
    [column]
  )

  return (
    <div
      className={classnames(classes.columnLabel, {
        [classes.deprecatedColumn]: isDeprecated,
      })}
    >
      <div className={classes.labelText}>
        <Typography component="div" className={classes.name}>
          {column.attributes?.uiName}
        </Typography>
        <Typography
          color="primary"
          component="div"
          variant="body2"
          className={classes.id}
        >
          {column.id}
          <CopyIconButton
            toCopy={column.id || ""}
            tooltipText={`Copy ${column.id}`}
          />
        </Typography>
        <Tooltip title={`See more info on  ${column.attributes?.uiName}`}>
          <IconButton
            onClick={() => navigate(slug)}
            className={classes.columnButton}
          >
            <Info />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

const SelectableColumn: React.FC<{
  column: Column
  selected: boolean
  disabled: boolean
  setSelected: (selected: boolean) => void
}> = ({ column, selected, disabled, setSelected }) => {
  const classes = useStyles()
  const isDeprecated = React.useMemo(
    () => column.attributes?.status !== "PUBLIC",
    [column.attributes]
  )
  return (
    <LabeledCheckbox
      checked={selected}
      disabled={disabled}
      onChange={setSelected}
      className={classes.column}
      checkboxClassName={classnames({
        [classes.deprecatedCheckbox]: isDeprecated,
        [classes.checkbox]: !isDeprecated,
      })}
    >
      <ColumnLabel column={column} isDeprecated={isDeprecated} />
    </LabeledCheckbox>
  )
}

const ColumnSubgroup: React.FC<{
  columns: Column[]
  name: "Dimensions" | "Metrics"
  allowableCubes: Set<string>
  allowDeprecated: boolean
  onlySegments: boolean
  cubesByColumnName: CubesByColumnName
  selectedColumns: Set<string>
  selectColumn: (column: string, selected: boolean) => void
}> = ({
  columns,
  name,
  selectColumn,
  selectedColumns,
  allowableCubes,
  allowDeprecated,
  onlySegments,
  cubesByColumnName,
}) => {
  const classes = useStyles()
  // Move deprecated columns to the bottom
  const sortedColumns = React.useMemo(
    () =>
      sortBy(columns, column =>
        column.attributes?.status === "PUBLIC" ? 0 : 1
      )
        .filter(
          column =>
            (allowDeprecated && column.attributes?.status !== "PUBLIC") ||
            column.attributes?.status === "PUBLIC"
        )
        .filter(column => {
          if (onlySegments) {
            return column.attributes?.allowedInSegments === "true"
          } else {
            return true
          }
        }),
    [columns, allowDeprecated, onlySegments]
  )

  return (
    <div className={classes.columnSubgroup}>
      <Typography variant="h5" className={classes.columnSubgroupTitle}>
        {name}
      </Typography>
      <div>
        {sortedColumns.length === 0 ? (
          <>No {name}.</>
        ) : (
          sortedColumns.map(column => {
            const disabled =
              allowableCubes.intersect(cubesByColumnName.get(column.id!, Set()))
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
          })
        )}
      </div>
    </div>
  )
}

const ColumnGroup: React.FC<{
  open: boolean
  toggleOpen: () => void
  name: string
  columns: Column[]
  onlySegments: boolean
  allowDeprecated: boolean
  allowableCubes: Set<string>
  cubesByColumnName: CubesByColumnName
  selectedColumns: Set<string>
  selectColumn: (column: string, selected: boolean) => void
}> = ({
  open,
  toggleOpen,
  name,
  allowDeprecated,
  onlySegments,
  columns,
  allowableCubes,
  cubesByColumnName,
  selectedColumns,
  selectColumn,
}) => {
  const classes = useStyles()

  if (!open) {
    return (
      <Typography
        variant="h4"
        onClick={toggleOpen}
        className={classes.columnSubgroupTitle}
      >
        <AddCircle />
        {name}
      </Typography>
    )
  } else {
    return (
      <>
        <Typography
          variant="h4"
          onClick={toggleOpen}
          className={classes.columnSubgroupTitle}
        >
          <RemoveCircle />
          {name}
          <a
            href={`/dimensions-metrics-explorer/${name
              .toLowerCase()
              .replace(" ", "-")}#${name.replace(" ", "-")}`}
          >
            <LinkIcon />
          </a>
        </Typography>

        <ColumnSubgroup
          name="Dimensions"
          columns={columns.filter(
            column => column.attributes?.type === "DIMENSION"
          )}
          allowableCubes={allowableCubes}
          allowDeprecated={allowDeprecated}
          onlySegments={onlySegments}
          cubesByColumnName={cubesByColumnName}
          selectColumn={selectColumn}
          selectedColumns={selectedColumns}
        />
        <ColumnSubgroup
          name="Metrics"
          columns={columns.filter(
            column => column.attributes?.type === "METRIC"
          )}
          allowableCubes={allowableCubes}
          allowDeprecated={allowDeprecated}
          onlySegments={onlySegments}
          cubesByColumnName={cubesByColumnName}
          selectColumn={selectColumn}
          selectedColumns={selectedColumns}
        />
      </>
    )
  }
}

const ColumnGroupList: React.FC<{
  allowDeprecated: boolean
  onlySegments: boolean
  columns: Column[]
  searchTerms: string[]
}> = ({ allowDeprecated, onlySegments, columns, searchTerms }) => {
  const classes = useStyles()
  const filteredColumns = React.useMemo(() => {
    let filtered: Column[] = columns

    if (!allowDeprecated) {
      filtered = filtered.filter(
        column => column?.attributes?.status !== "DEPRECATED"
      )
    }

    if (onlySegments) {
      filtered = filtered.filter(
        column => column?.attributes?.allowedInSegments === "true"
      )
    }

    filtered = filtered.filter(column =>
      searchTerms.every(
        term =>
          column?.id?.toLowerCase().indexOf(term) !== -1 ||
          column?.attributes?.uiName.toLowerCase().indexOf(term) !== -1
      )
    )

    return filtered
  }, [columns, searchTerms, allowDeprecated, onlySegments])
  // Group all the columns by group
  const groupedColumns = React.useMemo(() =>
    // JS Sets guarantee insertion order is preserved, which is important
    // because the key order in this groupBy determines the order that
    // they appear in the UI.
    {
      return groupBy(filteredColumns, column => column.attributes?.group)
    }, [filteredColumns])

  // Set of column groups that are currently expanded.
  const [open, setOpen] = React.useState<Set<string>>(() => {
    return Set()
  })

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

  // When a search term is entered, auto-expand all groups.
  React.useEffect(() => {
    if (searchTerms.length !== 0) {
      expandAll()
    }
  }, [searchTerms.length, expandAll])

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
        .map(
          columnId =>
            CUBES_BY_COLUMN_NAME.get(columnId) || (Set() as Set<string>)
        )
        .reduce((cubes1, cubes2) => cubes1.intersect(cubes2), CUBE_NAMES),
    [selectedColumns]
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
            onlySegments={onlySegments}
            allowDeprecated={allowDeprecated}
            columns={columns}
            name={groupName}
            key={groupName}
            toggleOpen={() => toggleGroupOpen(groupName)}
            allowableCubes={allowableCubes}
            cubesByColumnName={CUBES_BY_COLUMN_NAME}
            selectedColumns={selectedColumns}
            selectColumn={selectColumn}
          />
        ))}
      </div>
    </div>
  )
}

export default ColumnGroupList
