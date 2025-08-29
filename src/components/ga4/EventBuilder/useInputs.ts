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

  const [useTextBox, setUseTextBox] = useHydratedPersistantBoolean(
    StorageKey.eventBuilderUseTextBox,
    UrlParam.UseTextBox,
    false
  )

  const [inputPayload, setInputPayload] = useHydratedPersistantString(
    StorageKey.ga4EventBuilderPayload,
    UrlParam.APISecret
  )


  const [payloadObj, setPayloadObj] = useState({})

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

  const [payloadErrors, setPayloadErrors] = useHydratedPersistantString(
    StorageKey.ga4EventBuilderPayloadError,
    UrlParam.PayloadError
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

  const [ip_override, setIpOverride] = useHydratedPersistantString(
    StorageKey.ga4EventBuilderIpOverride,
    UrlParam.IpOverride
  )

  const [user_location_city, setUserLocationCity] = useHydratedPersistantString(
    StorageKey.ga4EventBuilderUserLocationCity,
    UrlParam.UserLocationCity
  )
  const [user_location_region_id, setUserLocationRegionId] =
    useHydratedPersistantString(
      StorageKey.ga4EventBuilderUserLocationRegionId,
      UrlParam.UserLocationRegionId
    )
  const [user_location_country_id, setUserLocationCountryId] =
    useHydratedPersistantString(
      StorageKey.ga4EventBuilderUserLocationCountryId,
      UrlParam.UserLocationCountryId
    )
  const [user_location_subcontinent_id, setUserLocationSubcontinentId] =
    useHydratedPersistantString(
      StorageKey.ga4EventBuilderUserLocationSubcontinentId,
      UrlParam.UserLocationSubcontinentId
    )
  const [user_location_continent_id, setUserLocationContinentId] =
    useHydratedPersistantString(
      StorageKey.ga4EventBuilderUserLocationContinentId,
      UrlParam.UserLocationContinentId
    )

  return {
    useFirebase,
    setUseFirebase,
    useTextBox,
    setUseTextBox,
    inputPayload,
    setInputPayload,
    payloadObj,
    setPayloadObj,
    payloadErrors,
    setPayloadErrors,
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
    ip_override,
    setIpOverride,
    user_location_city,
    setUserLocationCity,
    user_location_region_id,
    setUserLocationRegionId,
    user_location_country_id,
    setUserLocationCountryId,
    user_location_subcontinent_id,
    setUserLocationSubcontinentId,
    user_location_continent_id,
    setUserLocationContinentId,
  }
}

export default useInputs