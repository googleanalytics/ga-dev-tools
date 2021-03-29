import { useState, useCallback } from "react"
import { MPEvent, MPEventCategory, MPEventType } from "./_types/_index"

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

interface UseEventsReturn {
  setEvent: Dispatch<MPEvent>
  event: MPEvent
  updateCustomEventName: (name: string) => void
  updateEventCategory: (category: MPEventCategory) => void

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

  // React.useEffect(() => {
  //   // If the new category doesn't have the current eventType as an option,
  //   // update it to an empty one.
  //   const categoryHasEvent =
  //     event.getCategories().find(c => c === category) !== undefined
  //   if (!categoryHasEvent) {
  //     const firstEventFromNewCategory = MPEvent.eventTypes(category)[0]
  //     updateEvent(MPEvent.empty(firstEventFromNewCategory))
  //   }
  // }, [category, event])
  //
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
  }
}

export default useEvents
