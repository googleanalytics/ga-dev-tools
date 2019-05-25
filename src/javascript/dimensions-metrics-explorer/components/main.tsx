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

/// <reference path = "../../global.d.ts" />

import * as React from "react";
import { Set } from "immutable";

import { useLocalStorage, useTypedLocalStorage } from "../../hooks";

import { Column } from "../common_types";
import { CubesByColumn, cubesByColumn, allCubes } from "../cubes";

import SearchBox from "./searchBox";
import ColumnGroupList from "./columnGroupList";
import { AutoScrollProvider } from "../../components/auto-scroll";

const Main: React.FC = () => {
  const [searchText, setSearchText] = useLocalStorage("searchText", "");
  const [allowDeprecated, setAllowDeprecated] = useTypedLocalStorage(
    "allowDeprecated",
    false
  );
  const [onlySegments, setOnlySegments] = useTypedLocalStorage(
    "onlySegments",
    false
  );

  // If there is a fragment, reset the search filters, to ensure that
  // the column is definitely visible.
  React.useEffect(() => {
    if (window.location.hash) {
      setSearchText("");
      setAllowDeprecated(true);
      setOnlySegments(false);
    }
  }, []);

  const searchTerms = React.useMemo(
    () =>
      searchText
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length),
    [searchText]
  );

  // Fetch all of the columns from the metadata API
  const [columns, setColumns] = React.useState<null | Column[]>(null);
  React.useEffect(() => {
    const controller = new AbortController();

    const asyncFetch = async () => {
      var fetchedColumns: any;

      // This loop is just to retry cache misses
      do {
        const response = await fetch(
          "https://content.googleapis.com/analytics/v3/metadata/ga/columns",
          {
            headers: new Headers({
              Authorization: `Bearer ${window.GAPI_ACCESS_TOKEN}`,
              "If-None-Match": window.localStorage.getItem("columnsEtag") || ""
            }),
            signal: controller.signal
          }
        );

        if (response.status === 304) {
          if (
            response.headers.get("etag") ===
            window.localStorage.getItem("columnsEtag")
          ) {
            fetchedColumns = JSON.parse(
              window.localStorage.getItem("cachedColumnsBlob") || ""
            );
          } else {
            // We got a 304 response, but our local etag changed. Retry.
            continue;
          }
        } else if (response.ok) {
          fetchedColumns = await response.json();

          window.localStorage.setItem(
            "columnsEtag",
            response.headers.get("etag") || ""
          );
          window.localStorage.setItem(
            "cachedColumnsBlob",
            JSON.stringify(fetchedColumns)
          );
        } else {
          throw new Error("Failed to get metadata columns!");
        }
      } while (false);

      setColumns(fetchedColumns.items);
    };

    asyncFetch();
    return () => controller.abort();
  }, []);

  // Fetch the cubes
  const [
    localCubesByColumn,
    setCubesByColumn
  ] = React.useState<null | CubesByColumn>(null);
  React.useEffect(() => {
    cubesByColumn().then(cubes => setCubesByColumn(cubes));
  }, []);

  const [localAllCubes, setAllCubes] = React.useState<null | Set<string>>(null);
  React.useEffect(() => {
    allCubes().then(cubes => setAllCubes(cubes));
  }, []);

  return (
    <AutoScrollProvider behavior="auto" block="start">
      <div>
        <SearchBox
          searchText={searchText}
          setSearchText={setSearchText}
          allowDeprecated={allowDeprecated}
          setAllowDeprecated={setAllowDeprecated}
          onlySegments={onlySegments}
          setOnlySegments={setOnlySegments}
        />
        {localCubesByColumn !== null &&
        columns !== null &&
        localAllCubes !== null ? (
          <ColumnGroupList
            searchTerms={searchTerms}
            allowDeprecated={allowDeprecated}
            onlySegments={onlySegments}
            columns={columns}
            cubesByColumn={localCubesByColumn}
            allCubes={localAllCubes}
          />
        ) : (
          <div>Loading dimensions and metrics...</div>
        )}
      </div>
    </AutoScrollProvider>
  );
};

export default Main;
