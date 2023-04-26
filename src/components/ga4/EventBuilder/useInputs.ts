import { StorageKey } from "@/constants"
import {
  useHydratedPersistantBoolean,
  useHydratedPersistantString,
} from "@/hooks/useHydrated"
import { useState } from "react"
import { MPSecret } from "./MPSecret/useMPSecretsRequest"
import { Category, QueryParam } from "./types"

const useInputs = (categories: Category[]) => {
  const [useFirebase, setUseFirebase] = useHydratedPersistantBoolean(
    StorageKey.eventBuilderUseFirebase,
    QueryParam.UseFirebase,
    true
  )

  const [api_secret, setAPISecret] = useHydratedPersistantString(
    StorageKey.eventBuilderApiSecret,
    QueryParam.APISecret
  )

  const [firebase_app_id, setFirebaseAppId] = useHydratedPersistantString(
    StorageKey.eventBuilderFirebaseAppId,
    QueryParam.FirebaseAppId
  )

  const [measurement_id, setMeasurementId] = useHydratedPersistantString(
    StorageKey.eventBuilderMeasurementId,
    QueryParam.MeasurementId
  )

  const [client_id, setClientId] = useHydratedPersistantString(
    StorageKey.eventBuilderClientId,
    QueryParam.ClientId
  )

  const [app_instance_id, setAppInstanceId] = useHydratedPersistantString(
    StorageKey.eventBuilderAppInstanceId,
    QueryParam.AppInstanceId
  )

  const [user_id, setUserId] = useHydratedPersistantString(
    StorageKey.eventBuilderUserId,
    QueryParam.UserId
  )

  const [category, setCategory] = useState(categories[0])

  const [
    non_personalized_ads,
    setNonPersonalizedAds,
  ] = useHydratedPersistantBoolean(
    StorageKey.eventBuilderNonPersonalizedAds,
    QueryParam.NonPersonalizedAds,
    false
  )

  const [timestamp_micros, setTimestampMicros] = useHydratedPersistantString(
    StorageKey.eventBuilderTimestampMicros,
    QueryParam.TimestampMicros
  )

  const [secret, setSecret] = useState<MPSecret>()

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
    secret,
    setSecret,
  }
}

export default useInputs
