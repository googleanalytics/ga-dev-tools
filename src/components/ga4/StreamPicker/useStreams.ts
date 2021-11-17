import { useCallback, useMemo } from "react"

import { Requestable, RequestStatus } from "@/types"
import { PropertySummary, Stream, StreamType } from "@/types/ga4/StreamPicker"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import { useSelector } from "react-redux"

type WebStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListWebDataStreamsResponse
type IOSStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListIosAppDataStreamsResponse
type AndroidStreamsResponse = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaListAndroidAppDataStreamsResponse

const getWebStreams = (response: WebStreamsResponse) => response.webDataStreams
const getIOSStreams = (response: IOSStreamsResponse) =>
  response.iosAppDataStreams
const getAndroidStreams = (response: AndroidStreamsResponse) =>
  response.androidAppDataStreams

const getWebPageToken = (response: WebStreamsResponse) => response.nextPageToken
const getIOSPageToken = (response: IOSStreamsResponse) => response.nextPageToken
const getAndroidPageToken = (response: IOSStreamsResponse) =>
  response.nextPageToken

const useStreams = (
  property: PropertySummary | undefined
): Requestable<{ streams: Stream[] }> => {
  const gapi = useSelector((a: AppState) => a.gapi)
  const adminAPI = useMemo(() => gapi?.client?.analyticsadmin, [gapi])

  const requestReady = useMemo(
    () => adminAPI !== undefined && property !== undefined,
    [adminAPI, property]
  )

  const paginatedWebStreamsRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined || property === undefined) {
        throw new Error(
          "Invalid invariant - property and adminAPI must be defined."
        )
      }
      return adminAPI.properties.webDataStreams.list({
        parent: property?.property!,
        pageToken,
      })
    },
    [adminAPI, property]
  )

  const requestWebStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedWebStreamsRequest,
    getWebStreams,
    getWebPageToken
  )

  const webStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/webStreams` as StorageKey,
    [property?.property]
  )

  const webStreamsRequest = useCached(
    webStorageKey,
    requestWebStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  const paginatedIOSStreamsRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined || property === undefined) {
        throw new Error(
          "Invalid invariant - property and adminAPI must be defined."
        )
      }
      return adminAPI.properties.iosAppDataStreams.list({
        parent: property?.property!,
        pageToken,
      })
    },
    [adminAPI, property]
  )

  const requestIOSStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedIOSStreamsRequest,
    getIOSStreams,
    getIOSPageToken
  )

  const iosStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/iosStreams` as StorageKey,
    [property?.property]
  )

  const iosStreamsRequest = useCached(
    iosStorageKey,
    requestIOSStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  const paginatedAndroidStreamsRequest = useCallback(
    (pageToken: string | undefined) => {
      if (adminAPI === undefined || property === undefined) {
        throw new Error(
          "Invalid invariant - property and adminAPI must be defined."
        )
      }
      return adminAPI.properties.androidAppDataStreams.list({
        parent: property?.property!,
        pageToken,
      })
    },
    [adminAPI, property]
  )

  const requestAndroidStreams = usePaginatedCallback(
    requestReady,
    "Invalid invariant - property & adminAPI must be defined.",
    paginatedAndroidStreamsRequest,
    getAndroidStreams,
    getAndroidPageToken
  )

  const androidStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/androidStreams` as StorageKey,
    [property?.property]
  )

  const androidStreamsRequest = useCached(
    androidStorageKey,
    requestAndroidStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  return useMemo(() => {
    if (
      webStreamsRequest.status === RequestStatus.Successful &&
      androidStreamsRequest.status === RequestStatus.Successful &&
      iosStreamsRequest.status === RequestStatus.Successful
    ) {
      const webStreams = (webStreamsRequest.value || []).map(s => ({
        type: StreamType.WebDataStream,
        value: s,
      }))
      const androidStreams = (androidStreamsRequest.value || []).map(s => ({
        type: StreamType.AndroidDataStream,
        value: s,
      }))
      const iosStreams = (iosStreamsRequest.value || []).map(s => ({
        type: StreamType.IOSDataStream,
        value: s,
      }))
      return {
        status: RequestStatus.Successful,
        streams: webStreams.concat(androidStreams).concat(iosStreams),
      }
    }
    if (
      webStreamsRequest.status === RequestStatus.InProgress ||
      androidStreamsRequest.status === RequestStatus.InProgress ||
      iosStreamsRequest.status === RequestStatus.InProgress
    ) {
      return {
        status: RequestStatus.InProgress,
      }
    }
    if (
      webStreamsRequest.status === RequestStatus.Failed ||
      androidStreamsRequest.status === RequestStatus.Failed ||
      iosStreamsRequest.status === RequestStatus.Failed
    ) {
      return {
        status: RequestStatus.Failed,
      }
    }
    return {
      status: RequestStatus.NotStarted,
    }
  }, [webStreamsRequest, androidStreamsRequest, iosStreamsRequest])
}

export default useStreams
