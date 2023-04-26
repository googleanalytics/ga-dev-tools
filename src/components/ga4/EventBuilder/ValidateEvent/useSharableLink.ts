import { useContext, useMemo } from "react"
import { EventCtx, UseFirebaseCtx } from ".."
import { MobileIds, QueryParam, WebIds } from "../types"
import { encodeObject, ensureVersion } from "@/url"
import { URLVersion } from "@/types"

const useSharableLink = () => {
  const useFirebase = useContext(UseFirebaseCtx)
  const {
    clientIds,
    instanceId,
    api_secret,
    timestamp_micros,
    non_personalized_ads,
    userProperties,
    items,
    parameters,
    eventName,
    type,
  } = useContext(EventCtx)!

  return useMemo(() => {
    const params = new URLSearchParams()
    ensureVersion(params, QueryParam, URLVersion._2)

    const addIfTruthy = (p: QueryParam, v: any) => {
      v && params.append(p, v)
    }

    useFirebase !== undefined &&
      params.append(QueryParam.UseFirebase, useFirebase ? "1" : "0")

    non_personalized_ads !== undefined &&
      params.append(
        QueryParam.NonPersonalizedAds,
        non_personalized_ads ? "1" : "0"
      )

    addIfTruthy(
      QueryParam.AppInstanceId,
      (clientIds as MobileIds).app_instance_id
    )

    addIfTruthy(QueryParam.EventType, type)

    addIfTruthy(QueryParam.EventName, eventName)

    addIfTruthy(QueryParam.ClientId, (clientIds as WebIds).client_id)

    addIfTruthy(QueryParam.UserId, clientIds.user_id)

    addIfTruthy(QueryParam.APISecret, api_secret)

    addIfTruthy(QueryParam.MeasurementId, instanceId.measurement_id)

    addIfTruthy(QueryParam.FirebaseAppId, instanceId.firebase_app_id)

    addIfTruthy(QueryParam.TimestampMicros, timestamp_micros)

    if (userProperties) {
      params.append(QueryParam.UserProperties, encodeObject(userProperties))
    }

    if (items) {
      params.append(QueryParam.Items, encodeObject(items))
    }

    if (parameters.length > 0) {
      params.append(QueryParam.Parameters, encodeObject(parameters))
    }

    const urlParams = params.toString()
    const { protocol, host, pathname } = window.location
    return `${protocol}//${host}${pathname}?${urlParams}`
  }, [
    type,
    parameters,
    eventName,
    items,
    userProperties,
    useFirebase,
    clientIds,
    instanceId,
    api_secret,
    timestamp_micros,
    non_personalized_ads,
  ])
}

export default useSharableLink
