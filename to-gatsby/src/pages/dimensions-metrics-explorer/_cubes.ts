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

import { reduce, once } from "lodash"
import { Set, Map } from "immutable"
import cubes from "./_ga_cubes.json"

// The ga_cubes.json file is a mapping of cubes to column names. The
// format looks like this:
//
// { cube: {column1: 1, column2: 1}}
//
// In other words, each set of columns is an object where the keys are
// column names and the values are meaningless placeholders
export type RawCubes = { [cube: string]: { [column: string]: any } }

// Mapping of Column names to sets of cubes
export type CubesByColumn = Map<string, Set<string>>

const fetchRawCubes = once((): Promise<RawCubes> => Promise.resolve(cubes))

// Take the RawCubes format and invent it to instead by a mapping of column
// names to a set of cubes.
//
// In the demo, a user checks a column and the UI updates other columns based
// on compatability (they are disabled if they are incompatable). Since only
// columns that share a cube can be queried together, this means only columns
// that share a cube are compatable with each other.
const buildCubes = (rawCubes: RawCubes): CubesByColumn => {
  return reduce(
    rawCubes,
    (cubesByColumn, columnList, cubeName) =>
      reduce(
        columnList,
        (cubesByColumn, _, columnName) =>
          cubesByColumn.update(columnName, Set(), cubes => cubes.add(cubeName)),
        cubesByColumn
      ),
    Map()
  )
}

// This is a promise because in the future it will be loaded via a fetch.
export const cubesByColumn = (): Promise<CubesByColumn> =>
  fetchRawCubes().then(rawCubes => buildCubes(rawCubes))

export const allCubes = (): Promise<Set<string>> =>
  fetchRawCubes().then(rawCubes => Set.fromKeys(rawCubes))
