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

import * as React from "react";
import {
  groupBy,
  memoize,
  map,
  mapValues,
  every,
  some,
  sortBy,
  keyBy
} from "lodash";
import { Set } from "immutable";
import classNames from "classnames";

import {
  useLocalStorage,
  useTypedLocalStorage,
  useEventChecked,
  useHash
} from "../../hooks";
import { CubesByColumn } from "../cubes";
import { Column, Groups } from "../common_types";

import Icon from "../../components/icon";
import IconButton from "../../components/icon-button";
import { AutoScrollDiv } from "../../components/auto-scroll";

const SelectableColumn: React.FC<{
  column: Column;
  selected: boolean;
  disabled: boolean;
  setSelected: (selected: boolean) => void;
}> = ({ column, selected, disabled, setSelected }) => {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  // The column ID in the URL fragment
  const columnFragment = useHash().toLowerCase();
  const [infoExpanded, setExpanded] = React.useState(false);

  // If the fragment is this column, expand it
  React.useEffect(() => {
    if (columnFragment === column.id.toLowerCase()) {
      setExpanded(true);
    }
  }, [setExpanded, columnFragment]);

  const toggleExpanded = React.useCallback(() => setExpanded(exp => !exp), [
    setExpanded
  ]);

  const replacedBy =
    column.attributes.status === "DEPRECATED"
      ? column.attributes.replacedBy
      : null;
  // Deprecated columns cannot be selected
  const allowedInSegments = column.attributes.allowedInSegments === "true";
  const visibility = replacedBy ? "hidden" : "visible";
  const checkboxDisabled = disabled || replacedBy;

  const columnClass = classNames("dme-selectable-column", {
    "dme-selectable-column-highlight":
      columnFragment === column.id.toLowerCase()
  });

  const titleClass = classNames("dme-selectable-column-title", {
    "dme-selectable-column-disabled": disabled || replacedBy,
    "dme-selectable-column-deprecated": replacedBy
  });

  const inputClass = classNames("Checkbox", "dme-selectable-column-checkbox", {
    "dme-selectable-column-deprecated": replacedBy
  });

  return (
    <AutoScrollDiv className={columnClass} id={column.id}>
      <input
        type="checkbox"
        value="Bike"
        className={inputClass}
        checked={selected}
        disabled={disabled}
        onChange={event => setSelected(event.target.checked)}
      />
      <div className="dme-selectable-column-info">
        <a onClick={toggleExpanded} className={titleClass}>
          <span className="dme-selectable-column-uiname">
            <strong>{column.attributes.uiName}</strong>
          </span>
          <span className="dme-selectable-column-id">
            <code>{column.id}</code>
          </span>
        </a>
        {infoExpanded && (
          <div className="dme-selectable-column-detail">
            <div className="dme-selectable-column-description">
              {column.attributes.description}
            </div>
            <div>
              <strong>Data Type:</strong>{" "}
              <code>{column.attributes.dataType}</code>
            </div>
            <div>
              <strong>
                Added in API Version {column.attributes.addedInApiVersion}
              </strong>
            </div>
            {allowedInSegments && (
              <div>
                <strong>Allowed in segments</strong>
              </div>
            )}
            {replacedBy && (
              <div>
                <strong>Deprecated:</strong> Use <code>{replacedBy}</code>{" "}
                instead.
              </div>
            )}
            <a href={`#${column.id}`}>Permalink</a>
          </div>
        )}
      </div>
    </AutoScrollDiv>
  );
};

const ColumnSubgroup: React.FC<{
  columns: Column[];
  name: "Dimensions" | "Metrics";
  allowableCubes: Set<string>;
  cubesByColumn: CubesByColumn;
  selectedColumns: Set<string>;
  selectColumn: (column: string, selected: boolean) => void;
}> = ({
  columns,
  name,
  selectColumn,
  selectedColumns,
  allowableCubes,
  cubesByColumn
}) => {
  // Move deprecated columns to the bottom
  const sortedColumns = React.useMemo(
    () =>
      sortBy(columns, column =>
        column.attributes.status === "PUBLIC" ? 0 : 1
      ),
    [columns]
  );

  return (
    <div className="dme-group-list-subgroup">
      <span className="dme-group-list-subgroup-header">{name}</span>
      <div>
        {sortedColumns.map(column => {
          const disabled =
            allowableCubes.intersect(cubesByColumn.get(column.id, Set()))
              .size === 0;
          return (
            <SelectableColumn
              column={column}
              key={column.id}
              setSelected={selected => selectColumn(column.id, selected)}
              disabled={disabled}
              selected={selectedColumns.contains(column.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

const ColumnGroup: React.FC<{
  open: boolean;
  toggleOpen: () => void;
  name: string;
  columns: Column[];
  allowableCubes: Set<string>;
  cubesByColumn: CubesByColumn;
  selectedColumns: Set<string>;
  selectColumn: (column: string, selected: boolean) => void;
}> = ({
  open,
  toggleOpen,
  name,
  columns,
  allowableCubes,
  cubesByColumn,
  selectedColumns,
  selectColumn
}) => (
  <div className="dme-group">
    <div className="dme-group-header" onClick={toggleOpen}>
      <span className="dme-group-collapse">
        <Icon type={open ? "remove-circle" : "add-circle"} />
      </span>
      <span>{name}</span>
    </div>
    <div className="dme-group-list" hidden={!open}>
      <ColumnSubgroup
        name="Dimensions"
        columns={columns.filter(
          column => column.attributes.type === "DIMENSION"
        )}
        allowableCubes={allowableCubes}
        cubesByColumn={cubesByColumn}
        selectColumn={selectColumn}
        selectedColumns={selectedColumns}
      />
      <ColumnSubgroup
        name="Metrics"
        columns={columns.filter(column => column.attributes.type === "METRIC")}
        allowableCubes={allowableCubes}
        cubesByColumn={cubesByColumn}
        selectColumn={selectColumn}
        selectedColumns={selectedColumns}
      />
    </div>
  </div>
);

const ColumnGroupList: React.FC<{
  allowDeprecated: boolean;
  searchTerms: string[];
  onlySegments: boolean;
  cubesByColumn: CubesByColumn;
  allCubes: Set<string>;
  columns: Column[];
}> = ({
  allowDeprecated,
  searchTerms,
  onlySegments,
  columns,
  cubesByColumn,
  allCubes
}) => {
  const filteredColumns = React.useMemo(() => {
    let filtered: Column[] = columns;

    if (!allowDeprecated) {
      filtered = filtered.filter(
        column => column.attributes.status != "DEPRECATED"
      );
    }

    if (onlySegments) {
      filtered = filtered.filter(
        column => column.attributes.allowedInSegments === "true"
      );
    }

    filtered = filtered.filter(column =>
      searchTerms.every(
        term =>
          column.id.toLowerCase().indexOf(term) != -1 ||
          column.attributes.uiName.toLowerCase().indexOf(term) != -1
      )
    );

    return filtered;
  }, [columns, allowDeprecated, onlySegments, searchTerms]);

  // Group all columns by Id
  const columnsByLowerId = React.useMemo(
    () => keyBy(filteredColumns, column => column.id.toLowerCase()),
    [filteredColumns]
  );

  // Group all the columns by group
  const groupedColumns = React.useMemo(
    () =>
      // JS Sets guarantee insertion order is preserved, which is important
      // because the key order in this groupBy determines the order that
      // they appear in the UI.
      groupBy(filteredColumns, column => column.attributes.group),
    [filteredColumns]
  );

  // Set of column groups that are currently expanded.
  const [open, setOpen] = React.useState<Set<string>>(() => Set());

  // Expand/Collapse callbacks
  const toggleGroupOpen = React.useCallback(
    (group: string) =>
      setOpen(oldOpen =>
        oldOpen.contains(group) ? oldOpen.remove(group) : oldOpen.add(group)
      ),
    [setOpen]
  );

  const collapseAll = React.useCallback(() => setOpen(Set()), [setOpen]);

  const expandAll = React.useCallback(
    () => setOpen(Set.fromKeys(groupedColumns)),
    [setOpen, groupedColumns]
  );

  // When a search term is entered, auto-expand all groups. When the search
  // terms are cleared, auto-collapse all groups.
  React.useEffect(() => {
    if (searchTerms.length === 0) {
      collapseAll();
    } else {
      expandAll();
    }
  }, [searchTerms.length === 0]);

  // When the page loads, if there is a fragment, auto-expand the group
  // containing that fragment. Make sure this effect happens after the
  // auto-expand or auto-collapse hook, above.
  React.useEffect(() => {
    const fragment = window.location.hash.replace(/^#/, "").toLowerCase();
    const selectedColumn = columnsByLowerId[fragment];
    if (selectedColumn !== undefined) {
      setOpen(oldOpen => oldOpen.add(selectedColumn.attributes.group));
    }
  }, [setOpen, columnsByLowerId]);

  // selectedColumns is the set of selected columns Each column is
  // associated with one or more "cubes", and a only columns that share
  // cubes may be mutually selected.
  const [selectedColumns, setSelectedColumns] = React.useState<Set<string>>(
    () => Set()
  );

  const selectColumn = React.useCallback(
    (column: string, selected: boolean) =>
      setSelectedColumns(oldSelected =>
        selected ? oldSelected.add(column) : oldSelected.remove(column)
      ),
    [setSelectedColumns]
  );

  // The set of allowable cubes. When any columns are selected, the set of
  // allowable cubes is the intersection of the cubes for those columns
  const allowableCubes = React.useMemo<Set<string>>(
    () =>
      selectedColumns
        .map(columnId => cubesByColumn.get(columnId) || (Set() as Set<string>))
        .reduce((cubes1, cubes2) => cubes1.intersect(cubes2), allCubes),
    [selectedColumns, cubesByColumn, allCubes]
  );

  const showExpandAll = open.size < Object.keys(groupedColumns).length;
  const showCollapseAll = open.size > 0;
  return (
    <div>
      <div className="ButtonSet">
        {showExpandAll ? (
          <IconButton type="add-circle" onClick={expandAll}>
            Expand All
          </IconButton>
        ) : null}
        {showCollapseAll ? (
          <IconButton type="remove-circle" onClick={collapseAll}>
            Hide All
          </IconButton>
        ) : null}
      </div>
      <div>
        {map(groupedColumns, (columns, groupName) => (
          <div key={groupName}>
            <ColumnGroup
              open={open.contains(groupName)}
              columns={columns}
              name={groupName}
              toggleOpen={() => toggleGroupOpen(groupName)}
              allowableCubes={allowableCubes}
              cubesByColumn={cubesByColumn}
              selectedColumns={selectedColumns}
              selectColumn={selectColumn}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnGroupList;
