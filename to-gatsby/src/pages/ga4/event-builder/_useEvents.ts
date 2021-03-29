import { useState, useCallback, useEffect, useMemo } from "react"
import {
  MPEvent,
  MPEventCategory,
  MPEventType,
  ValidationStatus,
  Parameters,
  ValidationMessage,
  InstanceId,
  ClientIds,
} from "./_types/_index"

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

interface UseEventsReturn {
  setEvent: Dispatch<MPEvent>
  event: MPEvent
  validateEvent: () => void
  updateCustomEventName: (name: string) => void
  updateEventCategory: (category: MPEventCategory) => void

  user_properties: Parameters
  setUserProperties: Dispatch<Parameters>

  category: MPEventCategory
  setCategory: (category: MPEventCategory) => void

  api_secret: string
  setAPISecret: Dispatch<string>

  firebase_app_id: string
  setFirebaseAppId: Dispatch<string>

  measurement_id: string
  setMeasurementId: Dispatch<string>

  client_id: string
  setClientId: Dispatch<string>

  app_instance_id: string
  setAppInstanceId: Dispatch<string>

  user_id: string
  setUserId: Dispatch<string>

  non_personalized_ads: boolean
  setNonPersonalizedAds: Dispatch<boolean>

  timestamp_micros: string
  setTimestampMicros: Dispatch<string>

  validationStatus: ValidationStatus
  validationMessages: ValidationMessage[]

  payload: {}
}

type UseEvents = () => UseEventsReturn
const useEvents: UseEvents = () => {
  // TODO - default this back to MPEvent.default()
  const [event, setEvent] = useState(MPEvent.empty(MPEventType.Purchase))
  const [api_secret, setAPISecret] = useState("")
  const [firebase_app_id, setFirebaseAppId] = useState("")
  const [measurement_id, setMeasurementId] = useState("")
  const [client_id, setClientId] = useState("")
  const [app_instance_id, setAppInstanceId] = useState("")
  const [user_id, setUserId] = useState("")
  const [category, setCategory] = useState(event.getCategories()[0])
  const [non_personalized_ads, setNonPersonalizedAds] = useState(false)
  const [timestamp_micros, setTimestampMicros] = useState("")
  const [user_properties, setUserProperties] = useState<Parameters>([])
  const [validationStatus, setValidationStatus] = useState(
    ValidationStatus.Unset
  )
  const [validationMessages, setValidationMessages] = useState<
    ValidationMessage[]
  >([])

  const payload = useMemo<{}>(() => {
    let client_ids: ClientIds
    if (client_id !== "") {
      client_ids = { client_id, user_id, type: "web" }
    } else {
      client_ids = { app_instance_id, user_id, type: "mobile" }
    }
    if (client_ids.type === "web" && client_ids.client_id === "") {
      client_ids.client_id = undefined
    } else if (
      client_ids.type === "mobile" &&
      client_ids.app_instance_id === ""
    ) {
      client_ids.app_instance_id = undefined
    }
    const { type, ...minusType } = client_ids
    const optionals = {}
    if (timestamp_micros !== undefined && timestamp_micros !== "") {
      optionals["timestamp_micros"] = timestamp_micros
    }
    if (non_personalized_ads) {
      optionals["non_personalized_ads"] = non_personalized_ads
    }
    return {
      ...minusType,
      ...optionals,
      user_id: client_ids.user_id || undefined,
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
    measurement_id,
    event,
    timestamp_micros,
    non_personalized_ads,
  ])

  const updateCustomEventName = useCallback(
    (name: string) => {
      setEvent(event => event.updateName(name))
    },
    [event]
  )

  const updateEventCategory = useCallback(
    (value: MPEventCategory) => {
      if (event.getCategories().find(c => c === value) === undefined) {
        setEvent(MPEvent.empty(MPEvent.eventTypes(value)[0]))
      }
      setCategory(value as MPEventCategory)
    },
    [event, setCategory]
  )

  const validateEvent = useCallback(() => {
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

  useEffect(() => {
    setValidationStatus(ValidationStatus.Unset)
  }, [
    client_id,
    user_id,
    measurement_id,
    firebase_app_id,
    api_secret,
    event,
    user_properties,
  ])

  return {
    event,
    setEvent,
    updateCustomEventName,
    updateEventCategory,
    category,
    setCategory,
    api_secret,
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
  Object.assign({}, payload, {
    validationBehavior: "ENFORCE_RECOMMENDATIONS",
  })
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const asJson = await result.json()
  return asJson.validationMessages as ValidationMessage[]
}

export default useEvents
