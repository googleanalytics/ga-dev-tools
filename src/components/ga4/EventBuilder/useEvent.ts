import { useCallback, useEffect, useMemo } from "react"

import { useAddToArray, useRemoveByIndex } from "@/hooks"
import {
  EventType,
  Parameter,
  ParameterType,
  UrlParam,
} from "@/components/ga4/EventBuilder/types"
import {
  cloneEvent,
  numberParam,
  stringParam,
  suggestedEventFor,
} from "./event"
import { StorageKey } from "@/constants"
import { QueryParamConfig } from "serialize-query-params"
import {
  useHydratedPersistantObject,
  useHydratedPersistantString,
} from "@/hooks/useHydrated"

// TODO - this should be added back in later, but seems to not work correctly
// right now.
const keepCommonParameters = (
  oldParams: Parameter[],
  newParams: Parameter[]
): Parameter[] => {
  return newParams.map(nuParam => {
    const oldParam = oldParams.find(old => old.name === nuParam.name)
    if (oldParam === undefined) {
      return nuParam
    } else {
      return oldParam
    }
  })
}

type SetType = (type: EventType) => void
type SetParamName = (idx: number, name: string) => void
type SetParamValue = (idx: number, value: string) => void
type AddStringParam = () => void
type AddNumberParam = () => void
type AddItemsParam = () => void
type RemoveParam = (idx: number) => void
type AddItem = () => void
type RemoveItem = (idx: number) => void
type SetItemParamName = (idx: number, itemIdx: number, name: string) => void
type RemoveItemParam = (idx: number, itemIdx: number) => void
type AddItemStringParam = (idx: number) => void

const ItemsParam: QueryParamConfig<Parameter[][] | undefined | null> = {
  encode: v => (v ? btoa(JSON.stringify(v)) : undefined),
  decode: a => (typeof a === "string" ? JSON.parse(atob(a)) : undefined),
}

export const ParametersParam: QueryParamConfig<
  Parameter[] | undefined | null
> = {
  encode: v => (v ? btoa(JSON.stringify(v)) : undefined),
  decode: a => (typeof a === "string" ? JSON.parse(atob(a)) : undefined),
}

const useEvent = (initial?: EventType) => {
  const [typeString, setTypeLocal] = useHydratedPersistantString(
    StorageKey.ga4EventBuilderLastEventType,
    UrlParam.EventType,
    initial || EventType.SelectContent
  )

  const type = useMemo(() => typeString as EventType, [typeString])

  const [eventName, setEventName] = useHydratedPersistantString(
    StorageKey.ga4EventBuilderEventName,
    UrlParam.EventName
  )

  const categories = useMemo(() => suggestedEventFor(type).categories, [type])

  const [parameters, setParameters] = useHydratedPersistantObject(
    StorageKey.ga4EventBuilderParameters,
    UrlParam.Parameters,
    ParametersParam,
    suggestedEventFor(type).parameters
  )

  const [items, setItems] = useHydratedPersistantObject(
    StorageKey.ga4EventBuilderItems,
    UrlParam.Items,
    ItemsParam
  )

  useEffect(() => {
    if (typeString === undefined) {
      return
    }
    const suggested = cloneEvent(suggestedEventFor(typeString as EventType))
    // TODO - update this to use keepCommonParameters once it's working
    // correctly.
    setParameters(suggested.parameters)
    // TODO - This could be improved to potentially keep around items maybe?
    setItems(suggested.items)
    if (typeString === EventType.CustomEvent) {
      setEventName("")
    } else {
      setEventName(typeString)
    }
  }, [typeString, setEventName, setItems, setParameters])

  const setType: SetType = useCallback(
    nuType => {
      setTypeLocal(nuType)
    },
    [setTypeLocal]
  )

  const setParamName: SetParamName = useCallback(
    (idx, paramName) => {
      setParameters((old = []) =>
        old.map((p, i) => (idx === i ? { ...p, name: paramName } : p))
      )
    },
    [setParameters]
  )

  const setParamValue: SetParamValue = useCallback(
    (idx, value) => {
      setParameters((old = []) =>
        old.map((p, i) => (idx === i ? { ...p, value } : p))
      )
    },
    [setParameters]
  )

  const addParameter = useAddToArray<Parameter>(setParameters)

  const addStringParam: AddStringParam = useCallback(
    () =>
      addParameter({ name: "", type: ParameterType.String, value: undefined }),
    [addParameter]
  )
  const addNumberParam: AddNumberParam = useCallback(
    () =>
      addParameter({ name: "", type: ParameterType.Number, value: undefined }),
    [addParameter]
  )

  const addItemsParam: AddItemsParam = useCallback(() => setItems([[]]), [
    setItems,
  ])

  const addItemStringParam: AddItemStringParam = useCallback(
    idx =>
      setItems(old => {
        if (old === undefined) {
          return
        }
        return old.map((item, i) =>
          i === idx ? item.concat([stringParam("", undefined)]) : item
        )
      }),
    [setItems]
  )

  const addItemNumberParam: AddItemStringParam = useCallback(
    idx =>
      setItems(old => {
        if (old === undefined) {
          return
        }
        return old.map((item, i) =>
          i === idx ? item.concat([numberParam("", undefined)]) : item
        )
      }),
    [setItems]
  )

  const addItem: AddItem = useCallback(() => {
    setItems(old => {
      if (old === undefined || old.length === 0) {
        const suggestedItems = suggestedEventFor(type).items
        if (suggestedItems !== undefined) {
          return suggestedItems
        }
        return [[]]
      }
      const first = old[0]
      const nu = first.map(parameter =>
        parameter.type === ParameterType.Number
          ? numberParam(parameter.name, parameter.exampleValue)
          : stringParam(parameter.name, parameter.exampleValue)
      )
      return old.concat([nu])
    })
  }, [type, setItems])

  const removeItem: RemoveItem = useCallback(
    idx =>
      setItems(old => {
        if (old === undefined) {
          return
        }
        return old.filter((_, i) => i !== idx)
      }),
    [setItems]
  )

  const removeItems = useCallback(() => {
    setItems(undefined)
  }, [setItems])

  const removeItemParam: RemoveItemParam = useCallback(
    (idx, itemIdx) => {
      setItems(old => {
        if (old === undefined) {
          return
        }
        return old.map((parameters, i) =>
          i === idx ? parameters.filter((_, ii) => itemIdx !== ii) : parameters
        )
      })
    },
    [setItems]
  )

  const setItemParamName: SetItemParamName = useCallback(
    (idx, itemIdx, name) => {
      setItems(old => {
        if (old === undefined) {
          return
        }
        return old.map((parameters, i) =>
          idx === i
            ? parameters.map((parameter, ii) =>
                ii === itemIdx ? { ...parameter, name } : parameter
              )
            : parameters
        )
      })
    },
    [setItems]
  )

  const setItemParamValue: SetItemParamName = useCallback(
    (idx, itemIdx, value) => {
      setItems(old => {
        if (old === undefined) {
          return
        }
        return old.map((parameters, i) =>
          idx === i
            ? parameters.map((parameter, ii) =>
                ii === itemIdx ? { ...parameter, value } : parameter
              )
            : parameters
        )
      })
    },
    [setItems]
  )

  const removeParam: RemoveParam = useRemoveByIndex(setParameters)

  return {
    type,
    setType,
    eventName: eventName || "",
    setEventName,
    categories,

    parameters: parameters || [],
    setParamName,
    setParamValue,
    addStringParam,
    addNumberParam,
    addItemsParam,
    removeParam,

    items,
    addItem,
    removeItem,
    addItemStringParam,
    addItemNumberParam,
    setItemParamName,
    setItemParamValue,
    removeItemParam,
    removeItems,
  }
}
export default useEvent
