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

import { styled } from '@mui/material/styles';

import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import LinkIcon from "@mui/icons-material/Link"
import Button from "@mui/material/Button"
import RemoveCircle from "@mui/icons-material/RemoveCircle"
import AddCircle from "@mui/icons-material/AddCircle"
import Info from "@mui/icons-material/Info"
import {groupBy, map, sortBy} from "lodash"
import {Set} from "immutable"
import {navigate} from "gatsby"
import classnames from "classnames"

import {CopyIconButton} from "@/components/CopyButton"
import LabeledCheckbox from "@/components/LabeledCheckbox"
import {CUBE_NAMES, CUBES_BY_COLUMN_NAME, CubesByColumnName} from "./cubes"
import {Column} from "@/types/ua"

const PREFIX = 'ColumnGroupList';

const classes = {
  accordionTitle: `${PREFIX}-accordionTitle`,
  expandContract: `${PREFIX}-expandContract`,
  column: `${PREFIX}-column`,
  columnSubgroupTitle: `${PREFIX}-columnSubgroupTitle`,
  columnSubgroup: `${PREFIX}-columnSubgroup`,
  deprecatedColumn: `${PREFIX}-deprecatedColumn`,
  checkbox: `${PREFIX}-checkbox`,
  deprecatedCheckbox: `${PREFIX}-deprecatedCheckbox`,
  columnDetails: `${PREFIX}-columnDetails`,
  columnLabel: `${PREFIX}-columnLabel`,
  columnButton: `${PREFIX}-columnButton`,
  name: `${PREFIX}-name`,
  id: `${PREFIX}-id`,
  popover: `${PREFIX}-popover`,
  paper: `${PREFIX}-paper`,
  labelText: `${PREFIX}-labelText`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.accordionTitle}`]: { margin: 0 },

  [`& .${classes.expandContract}`]: {
    margin: theme.spacing(1),
  },

  [`& .${classes.column}`]: {
    display: "flex",
    alignItems: "baseline",
    padding: "unset",
  },

  [`& .${classes.columnSubgroupTitle}`]: {
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

  [`& .${classes.columnSubgroup}`]: {
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },

  [`&.${classes.deprecatedColumn}`]: {
    textDecoration: "line-through",
  },

  [`& .${classes.checkbox}`]: {
    padding: "unset",
    paddingRight: theme.spacing(1),
  },

  [`& .${classes.deprecatedCheckbox}`]: {
    padding: "unset",
    paddingRight: theme.spacing(1),
    visibility: "hidden",
  },

  [`& .${classes.columnDetails}`]: {
    display: "flex",
    flexDirection: "column",
  },

  [`&.${classes.columnLabel}`]: {
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    position: "relative",
    top: theme.spacing(-1),
  },

  [`& .${classes.columnButton}`]: {
    padding: "unset",
    paddingLeft: theme.spacing(1),
  },

  [`& .${classes.name}`]: { marginRight: theme.spacing(1) },

  [`& .${classes.id}`]: {
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

  [`& .${classes.popover}`]: {
    pointerEvents: "none",
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.labelText}`]: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }
}));

type ColumnLabelProps = {
  column: Column
  isDeprecated: boolean
}
const ColumnLabel: React.FC<ColumnLabelProps> = ({ column, isDeprecated }) => {

  const slug = React.useMemo(
    () =>
      `/dimensions-metrics-explorer/${
        column.attributes?.group.replace(/ /g, "-").toLowerCase() || ""
      }#${column.id?.replace("ga:", "")}`,
    [column]
  )

  return (
    <Root
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
    </Root>
  );
}

const SelectableColumn: React.FC<{
  column: Column
  selected: boolean
  disabled: boolean
  setSelected: (selected: boolean) => void
}> = ({ column, selected, disabled, setSelected }) => {

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
            CUBES_BY_COLUMN_NAME.get(columnId!) || (Set() as Set<string>)
        )
        .reduce((cubes1, cubes2) => cubes1!.intersect(cubes2!), CUBE_NAMES),
    [selectedColumns]
  )

  let showExpandAll = open.size < Object.keys(groupedColumns).length
  let showCollapseAll = open.size > 0
  return (
      <Root>
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
      </Root>
  )
}

export default ColumnGroupList
