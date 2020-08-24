// In the future, this file will populate cubes from a devsite URL.
// For now it's hardcoded.

import { reduce, once } from "lodash";
import { Set, Map } from "immutable";

// The ga_cubes.json file is a mapping of cubes to column names. The
// format looks like this:
//
// { cube: {column1: 1, column2: 1}}
//
// In other words, each set of columns is an object where the keys are
// column names and the values are meaningless placeholders
export type RawCubes = { [cube: string]: { [column: string]: any } };

// Mapping of Column names to sets of cubes
export type CubesByColumn = Map<string, Set<string>>;

const fetchRawCubes = once(
  (): Promise<RawCubes> =>
    fetch("/ga_cubes.json").then(response => {
      if (response.status >= 400) {
        throw new Error(`Error fetching cubes: ${response}`);
      } else {
        return response.json();
      }
    })
);

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
  );
};

// This is a promise because in the future it will be loaded via a fetch.
export const cubesByColumn = (): Promise<CubesByColumn> =>
  fetchRawCubes().then(rawCubes => buildCubes(rawCubes));

export const allCubes = (): Promise<Set<string>> =>
  fetchRawCubes().then(rawCubes => Set.fromKeys(rawCubes));
