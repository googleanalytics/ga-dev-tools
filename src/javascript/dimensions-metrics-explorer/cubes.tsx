// In the future, this file will populate cubes from a devsite URL.
// For now it's hardcoded.

import cubes from "./ga_cubes.json";
import { reduce } from "lodash";
import { Set, Map } from "immutable";

// Mapping of Column names to sets of cubes
export type CubesByColumn = Map<string, Set<string>>;

const getDefault = function<K, V>(map: Map<K, V>, key: K, def: () => V) {
  if (map.has(key)) {
    return map.get(key);
  } else {
    const value = def();
    map.set(key, value);
    return value;
  }
};

const buildCubes = (): CubesByColumn => {
  return reduce(
    cubes,
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

// This is a promise because in the future it will be loaded via a fetch
export const cubesByColumn: Promise<CubesByColumn> = Promise.resolve(
  buildCubes()
);
