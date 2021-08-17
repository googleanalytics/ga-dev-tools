import { useCallback, useEffect, useMemo } from "react"

import useGapi from "@/hooks/useGapi"
import { Requestable, RequestStatus } from "@/types"
import { PropertySummary, Stream, StreamType } from "@/types/ga4/StreamPicker"
import usePaginatedCallback from "@/hooks/usePaginatedCallback"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import useRequestStatus from "@/hooks/useRequestStatus"

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
  property: PropertySummary | undefined,
  onComplete?: () => void
): Requestable<{ streams: Stream[] }> => {
  const gapi = useGapi()
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])

  const {
    status: webStreamsStatus,
    setInProgress: setWebStreamInProgress,
    setSuccessful: setWebStreamSuccessful,
    setNotStarted: setWebStreamNotStarted,
    setFailed: setWebStreamFailed,
  } = useRequestStatus()

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
    getWebPageToken,
    setWebStreamInProgress,
    setWebStreamFailed
  )

  const webStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/webStreams` as StorageKey,
    [property?.property]
  )

  const webStreams = useCached(
    webStorageKey,
    requestWebStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  useEffect(() => {
    if (webStreams !== undefined) {
      setWebStreamSuccessful()
    }
  }, [setWebStreamSuccessful, webStreams])

  const {
    status: iosStreamsStatus,
    setInProgress: setIOSStreamInProgress,
    setSuccessful: setIOSStreamSuccessful,
    setNotStarted: setIOSStreamNotStarted,
    setFailed: setIOSStreamFailed,
  } = useRequestStatus()

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
    getIOSPageToken,
    setIOSStreamInProgress,
    setIOSStreamFailed
  )

  const iosStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/iosStreams` as StorageKey,
    [property?.property]
  )

  const iosStreams = useCached(
    iosStorageKey,
    requestIOSStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  useEffect(() => {
    if (iosStreams !== undefined) {
      setIOSStreamSuccessful()
    }
  }, [setIOSStreamSuccessful, iosStreams])

  const {
    status: androidStreamsStatus,
    setInProgress: setAndroidStreamInProgress,
    setSuccessful: setAndroidStreamSuccessful,
    setNotStarted: setAndroidStreamNotStarted,
    setFailed: setAndroidStreamFailed,
  } = useRequestStatus()

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
    getAndroidPageToken,
    setAndroidStreamInProgress,
    setAndroidStreamFailed
  )

  const androidStorageKey = useMemo(
    () =>
      `${StorageKey.ga4WebStreams}/${property?.property}/androidStreams` as StorageKey,
    [property?.property]
  )

  const androidStreams = useCached(
    androidStorageKey,
    requestAndroidStreams,
    moment.duration(5, "minutes"),
    requestReady
  )

  useEffect(() => {
    if (androidStreams !== undefined) {
      setAndroidStreamSuccessful()
    }
  }, [setAndroidStreamSuccessful, androidStreams])

  useEffect(() => {
    if (
      webStreams !== undefined &&
      iosStreams !== undefined &&
      androidStreams !== undefined
    ) {
      onComplete && onComplete()
    }
  }, [onComplete, webStreams, iosStreams, androidStreams])

  useEffect(() => {
    setWebStreamNotStarted()
    setIOSStreamNotStarted()
    setAndroidStreamNotStarted()
  }, [
    property,
    setWebStreamNotStarted,
    setIOSStreamNotStarted,
    setAndroidStreamNotStarted,
  ])

  if (
    webStreamsStatus === RequestStatus.Successful &&
    iosStreamsStatus === RequestStatus.Successful &&
    androidStreamsStatus === RequestStatus.Successful
  ) {
    if (webStreams === undefined) {
      throw new Error("Invalid invariant - webStreams must be defined here.")
    }
    if (iosStreams === undefined) {
      throw new Error("Invalid invariant - iosStreams must be defined here.")
    }
    if (androidStreams === undefined) {
      throw new Error(
        "Invalid invariant - androidStreams must be defined here."
      )
    }
    return {
      status: RequestStatus.Successful,
      streams: webStreams
        .map(s => ({
          type: StreamType.WebDataStream,
          value: s,
        }))
        .concat(
          iosStreams.map(s => ({
            type: StreamType.IOSDataStream,
            value: s,
          }))
        )
        .concat(
          androidStreams.map(s => ({
            type: StreamType.AndroidDataStream,
            value: s,
          }))
        ),
    }
  }

  if (
    webStreamsStatus === RequestStatus.InProgress ||
    iosStreamsStatus === RequestStatus.InProgress ||
    androidStreamsStatus === RequestStatus.InProgress
  ) {
    return { status: RequestStatus.InProgress }
  }

  if (
    webStreamsStatus === RequestStatus.Failed ||
    iosStreamsStatus === RequestStatus.Failed ||
    androidStreamsStatus === RequestStatus.Failed
  ) {
    return { status: RequestStatus.Failed }
  }
  return { status: RequestStatus.NotStarted }
}

export default useStreams
