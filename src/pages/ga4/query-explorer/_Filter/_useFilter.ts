import { useState, useCallback } from "react"
import {
  FilterExpression,
  UpdateFilterFn,
  RemoveExpressionFn,
  AddExpressionFn,
} from "./_index"
import { ExpressionType } from "./_Expression"

const useFilter = () => {
  const [expression, setExpression] = useState<FilterExpression>({})

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

        console.log({ last, butLast, navigated })

        return cloned
      })
    },
    [setExpression]
  )

  const removeExpression = useCallback<RemoveExpressionFn>(
    path => {
      setExpression(old => {
        const cloned = { ...old }
        const butLast = [...path]
        let last = butLast.pop()

        if (
          last === "andGroup" ||
          last === "orGroup" ||
          last === "notExpression"
        ) {
          last = butLast.pop()
        }

        // If there is no last, that means we're at the top level
        if (last === undefined) {
          return {}
        }

        const navigated = butLast.reduce(
          (ref, pathEntry) => ref[pathEntry],
          cloned
        )

        if (Array.isArray(navigated)) {
          navigated.splice(last as number, 1)
        }

        navigated[last] = {}

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
