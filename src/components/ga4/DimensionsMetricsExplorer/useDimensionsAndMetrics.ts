import * as React from "react"

import { useSelector } from "react-redux"

import { Requestable, RequestStatus } from "@/types"
import { usePersistantObject } from "@/hooks"
import { StorageKey } from "@/constants"

export type Dimension = gapi.client.analyticsdata.DimensionMetadata
export type Metric = gapi.client.analyticsdata.MetricMetadata

export type Successful = { dimensions: Dimension[]; metrics: Metric[] }
type UseDimensionsAndMetrics = (propertyName: string) => Requestable<Successful>

const MaxCacheTime = 1000 * 60 * 5 // 5 minutes

const requestStatusFor = (
  fields: Fields | undefined,
  property: string
): RequestStatus => {
  const now = new Date().getTime()
  const fromFields = fields?.[property]
  if (fromFields !== undefined && fromFields.time !== undefined) {
    const ellapsed = now - fromFields.time
    if (ellapsed <= MaxCacheTime) {
      return RequestStatus.Successful
    }
  }
  return RequestStatus.NotStarted
}

type Fields = {
  [key: string]: {
    time: number // epoch millis
    dimensions: Dimension[]
    metrics: Metric[]
  }
}

export const useDimensionsAndMetrics: UseDimensionsAndMetrics = propertyName => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = React.useMemo(() => gapi?.client.analyticsdata, [gapi])
  const [fields, setFields] = usePersistantObject<Fields>(
    StorageKey.ga4DimensionsMetricsFields
  )
  const [requestStatus, setRequestStatus] = React.useState<RequestStatus>(
    () => {
      return requestStatusFor(fields, propertyName)
    }
  )

  React.useEffect(() => {
    if (
      requestStatus === RequestStatus.InProgress ||
      requestStatus === RequestStatus.NotStarted
    ) {
      return
    }
    const nu = requestStatusFor(fields, propertyName)
    if (nu !== requestStatus) {
      setRequestStatus(nu)
    }
  }, [propertyName, fields, requestStatus])

  React.useEffect(() => {
    if (
      dataAPI === undefined ||
      requestStatus === RequestStatus.Successful ||
      requestStatus === RequestStatus.InProgress ||
      requestStatus === RequestStatus.Failed
    ) {
      return
    }
    setRequestStatus(RequestStatus.InProgress)
    dataAPI.properties
      .getMetadata({ name: `${propertyName}/metadata` })
      .then(response => {
        const { dimensions, metrics } = response.result
        if (dimensions === undefined || metrics === undefined) {
          setRequestStatus(RequestStatus.Failed)
          return
        }
        setFields((old = {}) => ({
          ...old,
          [propertyName]: { dimensions, metrics, time: new Date().getTime() },
        }))
        setRequestStatus(RequestStatus.Successful)
      })
  }, [dataAPI, setFields, propertyName, requestStatus])

  const dimensions = React.useMemo(() => fields?.[propertyName]?.dimensions, [
    fields,
    propertyName,
  ])
  const metrics = React.useMemo(() => fields?.[propertyName]?.metrics, [
    fields,
    propertyName,
  ])

  if (requestStatus !== RequestStatus.Successful) {
    return { status: requestStatus }
  } else {
    if (dimensions === undefined || metrics === undefined) {
      return { status: RequestStatus.NotStarted }
    }
    return {
      status: requestStatus,
      dimensions,
      metrics,
    }
  }
}
