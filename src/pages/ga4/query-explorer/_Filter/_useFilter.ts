import { useCallback } from "react"
import {
  FilterExpression,
  UpdateFilterFn,
  RemoveExpressionFn,
  AddExpressionFn,
} from "./_index"
import { ExpressionType } from "./_Expression"
import { StorageKey } from "../../../../constants"
import { usePersistantObject } from "../../../../hooks"

const useFilter = (storageKey: StorageKey) => {
  const [expression, setExpression] = usePersistantObject<FilterExpression>(
    storageKey
  )

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

  return { expression, addExpression, removeExpression, updateFilter }
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
