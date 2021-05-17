import { useContext, useMemo } from "react"
import { EventCtx } from ".."
import { ParameterType, Parameter } from "../types"

const tryParseNum = (s: string | undefined): number | undefined => {
  if (s === undefined) {
    return undefined
  }
  const parsed = parseFloat(s)
  if (Number.isNaN(parsed)) {
    return undefined
  }
  return parsed
}

const objectify = (acc: {}, p: Parameter) => ({
  ...acc,
  ...(p.name !== "" && p.value !== undefined && p.value !== ""
    ? {
        [p.name]:
          p.type === ParameterType.String ? p.value : tryParseNum(p.value),
      }
    : {}),
})

const removeUndefined = (o: {}): object =>
  Object.entries(o).reduce(
    (acc, [k, v]) => ({
      ...acc,
      ...(v === undefined || v === "" || k === "" ? {} : { [k]: v }),
    }),
    {}
  )

const usePayload = (): {} => {
  const {
    eventName,
    parameters,
    items,
    userProperties,
    timestamp_micros,
    non_personalized_ads,
    clientIds,
  } = useContext(EventCtx)!
  const itemsParameter = useMemo(
    () =>
      items === undefined
        ? {}
        : { items: items.map(i => i.reduce(objectify, {})) },
    [items]
  )

  const params = useMemo(() => parameters.reduce(objectify, itemsParameter), [
    parameters,
    itemsParameter,
  ])

  const user_properties = useMemo(() => userProperties.reduce(objectify, {}), [
    userProperties,
  ])

  const payload = useMemo(() => {
    return {
      ...removeUndefined(clientIds),
      ...removeUndefined({ timestamp_micros }),
      ...removeUndefined({ non_personalized_ads }),
      ...(userProperties.length > 0 ? { user_properties } : {}),
      events: [
        { name: eventName, ...(parameters.length > 0 ? { params } : {}) },
      ],
    }
  }, [
    clientIds,
    eventName,
    non_personalized_ads,
    parameters,
    params,
    timestamp_micros,
    userProperties.length,
    user_properties,
  ])

  return payload
}

export default usePayload
