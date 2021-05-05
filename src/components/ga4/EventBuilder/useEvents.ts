// Copyright 2020 Google Inc. All rights reserved.
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

import { useState, useCallback, useEffect, useMemo } from "react"

import { usePersistentString, usePersistentBoolean } from "@/hooks"
import { StorageKey } from "@/constants"
import {
  MPEvent,
  MPEventCategory,
  MPEventType,
  ValidationStatus,
  Parameters,
  ValidationMessage,
  InstanceId,
  URLParts,
  UrlParam,
  MPEventData,
} from "./types"

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

interface UseEventsReturn {
  setEvent: Dispatch<MPEvent>
  event: MPEvent
  validateEvent: () => void
  sendEvent: () => void
  updateCustomEventName: (name: string) => void
  updateEventCategory: (category: MPEventCategory) => void

  user_properties: Parameters
  setUserProperties: Dispatch<Parameters>

  category: MPEventCategory
  setCategory: (category: MPEventCategory) => void

  api_secret: string | undefined
  setAPISecret: Dispatch<string | undefined>

  firebase_app_id: string | undefined
  setFirebaseAppId: Dispatch<string | undefined>

  measurement_id: string | undefined
  setMeasurementId: Dispatch<string | undefined>

  client_id: string | undefined
  setClientId: Dispatch<string | undefined>

  app_instance_id: string | undefined
  setAppInstanceId: Dispatch<string | undefined>

  user_id: string | undefined
  setUserId: Dispatch<string | undefined>

  non_personalized_ads: boolean
  setNonPersonalizedAds: Dispatch<boolean>

  timestamp_micros: string | undefined
  setTimestampMicros: Dispatch<string | undefined>

  validationStatus: ValidationStatus
  validationMessages: ValidationMessage[]

  payload: {}
  parameterizedUrl: string
}

type UseEvents = () => UseEventsReturn
const useEvents: UseEvents = () => {
  const urlParts = useMemo(() => {
    return unParameterizeUrl()
  }, [])
  // TODO - default this back to MPEvent.default()
  const [event, setEvent] = useState(urlParts.event || MPEvent.default())
  const [api_secret, setAPISecret] = usePersistentString(
    StorageKey.eventBuilderApiSecret,
    "",
    urlParts.api_secret
  )
  const [firebase_app_id, setFirebaseAppId] = usePersistentString(
    StorageKey.eventBuilderFirebaseAppId,
    "",
    urlParts.firebase_app_id
  )
  const [measurement_id, setMeasurementId] = usePersistentString(
    StorageKey.eventBuilderMeasurementId,
    "",
    urlParts.measurement_id
  )
  const [client_id, setClientId] = usePersistentString(
    StorageKey.eventBuilderClientId,
    "",
    urlParts.client_id
  )
  const [app_instance_id, setAppInstanceId] = usePersistentString(
    StorageKey.eventBuilderAppInstanceId,
    "",
    urlParts.app_instance_id
  )
  const [user_id, setUserId] = usePersistentString(
    StorageKey.eventBuilderUserId,
    "",
    urlParts.user_id
  )
  const [category, setCategory] = useState(event.getCategories()[0])
  const [non_personalized_ads, setNonPersonalizedAds] = usePersistentBoolean(
    StorageKey.eventBuilderNonPersonalizedAds,
    false,
    urlParts.non_personalized_ads
  )
  const [timestamp_micros, setTimestampMicros] = usePersistentString(
    StorageKey.eventBuilderTimestampMicros,
    "",
    urlParts.timestamp_micros
  )
  const [user_properties, setUserProperties] = useState<Parameters>(
    urlParts.user_properties || []
  )
  const [validationStatus, setValidationStatus] = useState(
    ValidationStatus.Unset
  )
  const [validationMessages, setValidationMessages] = useState<
    ValidationMessage[]
  >([])

  const payload = useMemo<{}>(() => {
    const optionals = {}
    if (timestamp_micros !== undefined && timestamp_micros !== "") {
      optionals["timestamp_micros"] = timestamp_micros
    }
    if (non_personalized_ads) {
      optionals["non_personalized_ads"] = non_personalized_ads
    }
    if (user_id !== "") {
      optionals["user_id"] = user_id
    }
    if (client_id !== "") {
      optionals["client_id"] = client_id
    }
    if (app_instance_id !== "") {
      optionals["app_instance_id"] = app_instance_id
    }
    return {
      ...optionals,
      events: [event.asPayload()],
      user_properties:
        user_properties.length === 0
          ? undefined
          : MPEvent.parametersToPayload(user_properties),
    }
  }, [
    client_id,
    user_id,
    app_instance_id,
    event,
    timestamp_micros,
    non_personalized_ads,
    user_properties,
  ])

  const updateCustomEventName = useCallback((name: string) => {
    setEvent(event => event.updateName(name))
  }, [])

  const updateEventCategory = useCallback(
    (value: MPEventCategory) => {
      if (event.getCategories().find(c => c === value) === undefined) {
        setEvent(MPEvent.empty(MPEvent.eventTypes(value)[0]))
      }
      setCategory(value as MPEventCategory)
    },
    [event, setCategory]
  )

  const sendEvent = useCallback(() => {
    if (measurement_id === undefined && firebase_app_id === undefined) {
      return
    }
    if (api_secret === undefined) {
      return
    }
    const instance_id = { measurement_id, firebase_app_id }
    sendHit(payload, instance_id, api_secret)
  }, [payload, measurement_id, firebase_app_id, api_secret])

  const validateEvent = useCallback(() => {
    if (measurement_id === undefined && firebase_app_id === undefined) {
      return
    }
    if (api_secret === undefined) {
      return
    }
    const instance_id = { measurement_id, firebase_app_id }
    setValidationStatus(ValidationStatus.Pending)
    validateHit(payload, instance_id, api_secret).then(messages => {
      setValidationMessages(messages)
      setValidationStatus(
        messages.length === 0
          ? ValidationStatus.Valid
          : ValidationStatus.Invalid
      )
    })
  }, [payload, measurement_id, firebase_app_id, api_secret])

  const parameterizedUrl = useMemo(() => {
    return parameterizedUrlFor({
      client_id,
      app_instance_id,
      user_id,
      event,
      measurement_id,
      firebase_app_id,
      api_secret,
      user_properties,
      timestamp_micros,
      non_personalized_ads,
    })
  }, [
    client_id,
    app_instance_id,
    user_id,
    event,
    measurement_id,
    firebase_app_id,
    api_secret,
    user_properties,
    timestamp_micros,
    non_personalized_ads,
  ])

  useEffect(() => {
    setValidationStatus(ValidationStatus.Unset)
  }, [
    payload,
    client_id,
    user_id,
    measurement_id,
    firebase_app_id,
    api_secret,
    event,
    user_properties,
    timestamp_micros,
  ])

  return {
    event,
    sendEvent,
    setEvent,
    updateCustomEventName,
    updateEventCategory,
    category,
    setCategory,
    api_secret,
    parameterizedUrl,
    setAPISecret,
    firebase_app_id,
    setFirebaseAppId,
    measurement_id,
    setMeasurementId,
    client_id,
    setClientId,
    app_instance_id,
    setAppInstanceId,
    user_id,
    setUserId,
    non_personalized_ads,
    setNonPersonalizedAds,
    timestamp_micros,
    setTimestampMicros,
    validationStatus,
    validationMessages,
    user_properties,
    setUserProperties,
    validateEvent,
    payload,
  }
}

// Build the query param for the instance that should be used for the event.
// Defaults to an empty measurement_id if neither one is set.
const instanceQueryParamFor = (instanceId: InstanceId) => {
  if (instanceId.firebase_app_id !== "") {
    return `firebase_app_id=${instanceId.firebase_app_id}`
  }
  if (instanceId.measurement_id !== "") {
    return `measurement_id=${instanceId.measurement_id}`
  }
  return `measurement_id=`
}

const validateHit = async (
  payload: {},
  instanceId: InstanceId,
  api_secret: string
): Promise<ValidationMessage[]> => {
  const url = `https://www.google-analytics.com/debug/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`
  const body = Object.assign({}, payload, {
    validationBehavior: "ENFORCE_RECOMMENDATIONS",
  })
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  const asJson = await result.json()
  return asJson.validationMessages as ValidationMessage[]
}

const sendHit = async (
  payload: {},
  instanceId: InstanceId,
  api_secret: string
): Promise<void> => {
  const url = `https://www.google-analytics.com/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`
  const body = Object.assign({}, payload, {
    validationBehavior: "ENFORCE_RECOMMENDATIONS",
  })
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  return
}

const getEventFromParams = (searchParams: URLSearchParams) => {
  if (searchParams.has(UrlParam.EventData)) {
    const eventDataString = searchParams.get(UrlParam.EventData)!
    try {
      const decoded = atob(eventDataString)
      const eventData = JSON.parse(decoded) as MPEventData
      const eventType = MPEvent.eventTypeFromString(eventData.type as string)
      if (eventType !== undefined) {
        let emptyEvent = MPEvent.empty(eventType)
        if (eventType === MPEventType.CustomEvent) {
          const eventName = searchParams.get(UrlParam.EventName)
          if (eventName !== null) {
            emptyEvent = emptyEvent.updateName(eventName)
          }
        }
        const parameters = eventData.parameters
        if (parameters !== undefined) {
          emptyEvent = emptyEvent.updateParameters(() => parameters)
        }
        // TODO - Add measurement for hydrating from url.
        return emptyEvent
      }
    } catch (e) {
      console.error(e)
      // ignore
    }
  }
  return MPEvent.default()
}
const getUserPropertiesFromParams = (
  searchParams: URLSearchParams
): Parameters | undefined => {
  const userPropertiesString = searchParams.get(UrlParam.UserProperties)
  if (userPropertiesString !== null) {
    try {
      const decoded = atob(userPropertiesString)
      const userProperties = JSON.parse(decoded) as Parameters
      if (Array.isArray(userProperties)) {
        // TODO - could add better asserts here in the future to make sure that
        // each value is actually a good Parameter.
        return userProperties
      } else {
        throw new Error(`Invalid userPropertiesString: ${userProperties}`)
      }
    } catch (e) {
      console.error(e)
      // ignore
    }
  }
  return undefined
}

export const unParameterizeUrl = (): URLParts => {
  const search = window.location.search
  const searchParams = new URLSearchParams(search)
  const client_id = searchParams.get(UrlParam.ClientId) || undefined
  const app_instance_id = searchParams.get(UrlParam.AppInstanceId) || undefined
  const user_id = searchParams.get(UrlParam.UserId) || undefined
  const measurement_id = searchParams.get(UrlParam.MeasurementId) || undefined
  const firebase_app_id = searchParams.get(UrlParam.FirebaseAppId) || undefined
  const api_secret = searchParams.get(UrlParam.APISecret) || undefined
  const timestamp_micros =
    searchParams.get(UrlParam.TimestampMicros) || undefined
  const non_personalized_ads =
    searchParams.get(UrlParam.NonPersonalizedAds) === "true" ? true : false

  const event = getEventFromParams(searchParams)
  const user_properties = getUserPropertiesFromParams(searchParams)

  return {
    timestamp_micros,
    non_personalized_ads,
    app_instance_id,
    client_id,
    user_id,
    event,
    user_properties,
    measurement_id,
    firebase_app_id,
    api_secret,
    event_name: event.isCustomEvent() ? event.getEventName() : undefined,
  }
}

export const parameterizedUrlFor = ({
  client_id,
  app_instance_id,
  user_id,
  event,
  measurement_id,
  firebase_app_id,
  api_secret,
  user_properties,
  non_personalized_ads,
  timestamp_micros,
}: URLParts) => {
  const params = new URLSearchParams()

  client_id && client_id !== "" && params.append(UrlParam.ClientId, client_id)
  app_instance_id &&
    app_instance_id !== "" &&
    params.append(UrlParam.AppInstanceId, app_instance_id)
  user_id && user_id !== "" && params.append(UrlParam.UserId, user_id)
  api_secret &&
    api_secret !== "" &&
    params.append(UrlParam.APISecret, api_secret)
  event &&
    event.getEventType() === MPEventType.CustomEvent &&
    params.append(UrlParam.EventName, event.getEventName())

  measurement_id &&
    measurement_id !== "" &&
    params.append(UrlParam.MeasurementId, measurement_id)

  firebase_app_id &&
    firebase_app_id !== "" &&
    params.append(UrlParam.FirebaseAppId, firebase_app_id)

  timestamp_micros &&
    timestamp_micros !== "" &&
    params.append(UrlParam.TimestampMicros, timestamp_micros)

  non_personalized_ads !== undefined &&
    params.append(UrlParam.NonPersonalizedAds, non_personalized_ads.toString())

  // We base64 encode the JSON string to make the url a bit smaller.
  event &&
    params.append(
      UrlParam.EventData,
      btoa(JSON.stringify(event.getEventData()))
    )

  if (user_properties !== undefined) {
    const filtered = user_properties.filter(
      property => property.value !== undefined
    )
    params.append(UrlParam.UserProperties, btoa(JSON.stringify(filtered)))
  }

  const urlParams = params.toString()
  const { protocol, host, pathname } = window.location

  return `${protocol}//${host}${pathname}?${urlParams}`
}

export default useEvents
