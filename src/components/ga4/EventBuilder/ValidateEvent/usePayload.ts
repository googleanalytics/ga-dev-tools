import { useContext, useMemo } from "react"
import { EventCtx } from ".."
import { ParameterType, Parameter, EventType } from "../types"

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

const objectifyUserProperties = (acc: {}, p: Parameter) => {
  let value: string | number | undefined = p.value
  if (p.type === ParameterType.Number) {
    value = tryParseNum(value)
  }
  return {
    ...acc,
    ...(p.name !== "" && value !== "" && value !== undefined
      ? {
          [p.name]: {
            value,
          },
        }
      : {}),
  }
}

const removeUndefined = (o: {}): object =>
  Object.entries(o).reduce(
    (acc, [k, v]) => ({
      ...acc,
      ...(v === undefined || v === "" || k === "" ? {} : { [k]: v }),
    }),
    {}
  )

const removeEmptyObject = (o: {}): {} => {
  const empty = JSON.stringify({})
  return Object.entries(o).reduce(
    (acc, [k, v]) => ({
      ...acc,
      ...(JSON.stringify(v) === empty ? {} : { [k]: v }),
    }),
    {}
  )
}

const usePayload = (): {} => {
  const {
    eventName: customEventName,
    parameters,
    items,
    userProperties,
    timestamp_micros,
    non_personalized_ads,
    clientIds,
    type,
  } = useContext(EventCtx)!

  const eventName = useMemo(() => {
    if (type === EventType.CustomEvent) {
      return customEventName
    }
    return type
  }, [type, customEventName])

  const itemsParameter = useMemo(
    () =>
      items === undefined
        ? {}
        : {
            items: items
              .map(i => i.reduce(objectify, {}))
              .filter(i => JSON.stringify(i) !== JSON.stringify({})),
          },
    [items]
  )

  const params = useMemo(() => parameters.reduce(objectify, itemsParameter), [
    parameters,
    itemsParameter,
  ])

  const user_properties = useMemo(
    () => userProperties.reduce(objectifyUserProperties, {}),
    [userProperties]
  )

  const payload = useMemo(() => {
    return {
      ...removeUndefined(clientIds),
      ...removeUndefined({ timestamp_micros }),
      ...removeUndefined({ non_personalized_ads }),
      ...removeUndefined(removeEmptyObject({ user_properties })),
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
    user_properties,
  ])

  return payload
}

export default usePayload
