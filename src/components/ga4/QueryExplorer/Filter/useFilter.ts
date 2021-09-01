import { useCallback, useEffect, createContext } from "react"

import { StorageKey } from "@/constants"
import { usePersistantObject } from "@/hooks"
import {
  FilterExpression,
  UpdateFilterFn,
  RemoveExpressionFn,
  AddExpressionFn,
} from "./index"
import { ExpressionType } from "./Expression"

export const UseFilterContext = createContext<
  ReturnType<UseFilter> | undefined
>(undefined)

type UseFilter = (
  storageKey: StorageKey,
  showAdvanced: boolean
) => {
  expression: FilterExpression | undefined
  addExpression: AddExpressionFn
  removeExpression: RemoveExpressionFn
  updateFilter: UpdateFilterFn
  showAdvanced: boolean
}
const useFilter: UseFilter = (storageKey, showAdvanced) => {
  const [expression, setExpression] = usePersistantObject<FilterExpression>(
    storageKey
  )

  useEffect(() => {
    if (showAdvanced !== true) {
      if (expression === undefined || expression.filter === undefined) {
        setExpression(subFor(ExpressionType.Filter))
      }
    }
  }, [expression, showAdvanced, setExpression])

  const updateFilter = useCallback<UpdateFilterFn>(
    (path, update) => {
      setExpression(old => {
        const cloned = { ...old }
        const butLast = [...path]
        let last = butLast.pop()

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )

        navigated[last as any] = update(navigated[last as any])

        return cloned
      })
    },
    [setExpression]
  )

  const removeExpression = useCallback<RemoveExpressionFn>(
    path => {
      setExpression(old => {
        if (path.length <= 1) {
          return {}
        }

        const cloned = { ...old }
        const butLast = [...path]
        let last = butLast.pop()
        last = butLast.pop()

        let navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )

        //... my apologies.
        if (Array.isArray(navigated)) {
          const index = last
          last = butLast.pop()
          navigated = butLast.reduce((ref, pathEntry) => ref[pathEntry], cloned)
          navigated[last as any] = navigated[last as any].filter(
            (_: any, idx: number) => idx !== index
          )
          return cloned
        }

        navigated[last as any] = {}

        return cloned
      })
    },
    [setExpression]
  )

  const addExpression = useCallback<AddExpressionFn>(
    (path, type) => {
      setExpression(old => {
        const cloned = { ...old }
        const butLast = [...path]
        const last = butLast.pop()

        const sub = subFor(type)

        // If there is no last, that means we're at the top level
        if (last === undefined) {
          return sub
        }

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )
        navigated[last] = sub

        return cloned
      })
    },
    [setExpression]
  )

  return {
    expression,
    addExpression,
    removeExpression,
    updateFilter,
    showAdvanced,
  }
}

const subFor = (type: ExpressionType): FilterExpression => {
  switch (type) {
    case ExpressionType.And:
      return { andGroup: { expressions: [] } }
    case ExpressionType.Or:
      return { orGroup: { expressions: [] } }
    case ExpressionType.Not:
      return { notExpression: {} }
    case ExpressionType.Filter:
      return { filter: {} }
  }
}

export default useFilter
