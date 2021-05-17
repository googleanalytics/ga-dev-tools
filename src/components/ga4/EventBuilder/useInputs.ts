import { StorageKey } from "@/constants"
import {
  useHydratedPersistantBoolean,
  useHydratedPersistantString,
} from "@/hooks/useHydrated"
import { useState } from "react"
import { Category, UrlParam } from "./types"

const useInputs = (categories: Category[]) => {
  const [useFirebase, setUseFirebase] = useHydratedPersistantBoolean(
    StorageKey.eventBuilderUseFirebase,
    UrlParam.UseFirebase,
    true
  )

  const [api_secret, setAPISecret] = useHydratedPersistantString(
    StorageKey.eventBuilderApiSecret,
    UrlParam.APISecret
  )

  const [firebase_app_id, setFirebaseAppId] = useHydratedPersistantString(
    StorageKey.eventBuilderFirebaseAppId,
    UrlParam.FirebaseAppId
  )

  const [measurement_id, setMeasurementId] = useHydratedPersistantString(
    StorageKey.eventBuilderMeasurementId,
    UrlParam.MeasurementId
  )

  const [client_id, setClientId] = useHydratedPersistantString(
    StorageKey.eventBuilderClientId,
    UrlParam.ClientId
  )

  const [app_instance_id, setAppInstanceId] = useHydratedPersistantString(
    StorageKey.eventBuilderAppInstanceId,
    UrlParam.AppInstanceId
  )

  const [user_id, setUserId] = useHydratedPersistantString(
    StorageKey.eventBuilderUserId,
    UrlParam.UserId
  )

  const [category, setCategory] = useState(categories[0])

  const [
    non_personalized_ads,
    setNonPersonalizedAds,
  ] = useHydratedPersistantBoolean(
    StorageKey.eventBuilderNonPersonalizedAds,
    UrlParam.NonPersonalizedAds,
    false
  )

  const [timestamp_micros, setTimestampMicros] = useHydratedPersistantString(
    StorageKey.eventBuilderTimestampMicros,
    UrlParam.TimestampMicros
  )

  return {
    useFirebase,
    setUseFirebase,
    category,
    setCategory,
    api_secret,
    setAPISecret,
    firebase_app_id: useFirebase ? firebase_app_id : "",
    setFirebaseAppId,
    app_instance_id: useFirebase ? app_instance_id : "",
    setAppInstanceId,
    measurement_id: useFirebase ? "" : measurement_id,
    setMeasurementId,
    client_id: useFirebase ? "" : client_id,
    setClientId,
    user_id,
    setUserId,
    non_personalized_ads,
    setNonPersonalizedAds,
    timestamp_micros,
    setTimestampMicros,
  }
}

export default useInputs
