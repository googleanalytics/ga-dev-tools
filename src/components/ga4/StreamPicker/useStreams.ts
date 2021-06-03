import { useEffect, useMemo, useState } from "react"

import useGapi from "@/hooks/useGapi"
import { Requestable, RequestStatus } from "@/types"
import {
  AndroidDataStream,
  IosDataStream,
  Stream,
  StreamsRequest,
  WebDataStream,
} from "@/types/ga4/StreamPicker"

const useStreams = (
  property: string | undefined
): Requestable<StreamsRequest> => {
  const gapi = useGapi()

  const [webStatus, setWebStatus] = useState(RequestStatus.NotStarted)
  const [web, setWeb] = useState<WebDataStream[]>()
  const [webPageToken, setWebPageToken] = useState<string>()

  const [androidStatus, setAndroidStatus] = useState(RequestStatus.NotStarted)
  const [android, setAndroid] = useState<AndroidDataStream[]>()
  const [androidPageToken, setAndroidPageToken] = useState<string>()

  const [iosStatus, setIosStatus] = useState(RequestStatus.NotStarted)
  const [ios, setIos] = useState<IosDataStream[]>()
  const [iosPageToken, setIosPageToken] = useState<string>()

  const streams: Stream[] = useMemo(() => {
    return (web || []).concat(android || []).concat(ios || [])
  }, [web, android, ios])

  useEffect(() => {
    if (property === undefined) {
      return
    }
    if (webStatus === RequestStatus.NotStarted) {
      setWebStatus(RequestStatus.InProgress)
    }
    if (webStatus === RequestStatus.InProgress && gapi !== undefined) {
      gapi.client.analyticsadmin.properties.webDataStreams
        .list({
          parent: property,
          pageToken: webPageToken,
        })
        .then(response => {
          const nextToken = response.result.nextPageToken
          setWeb((old = []) => old.concat(response.result.webDataStreams || []))
          if (nextToken === undefined) {
            setWebStatus(RequestStatus.Successful)
          } else {
            setWebPageToken(nextToken)
          }
        })
        .catch(e => {
          console.error({ e })
          setWebStatus(RequestStatus.Failed)
        })
    }
  }, [gapi, webPageToken, webStatus, property])

  useEffect(() => {
    if (property === undefined) {
      return
    }
    if (androidStatus === RequestStatus.NotStarted) {
      setAndroidStatus(RequestStatus.InProgress)
    }
    if (androidStatus === RequestStatus.InProgress && gapi !== undefined) {
      gapi.client.analyticsadmin.properties.androidAppDataStreams
        .list({
          parent: property,
          pageToken: androidPageToken,
        })
        .then(response => {
          const nextToken = response.result.nextPageToken
          setAndroid((old = []) =>
            old.concat(response.result.androidAppDataStreams || [])
          )
          if (nextToken === undefined) {
            setAndroidStatus(RequestStatus.Successful)
          } else {
            setAndroidPageToken(nextToken)
          }
        })
        .catch(e => {
          console.error({ e })
          setWebStatus(RequestStatus.Failed)
        })
    }
  }, [gapi, androidPageToken, androidStatus, property])

  useEffect(() => {
    if (property === undefined) {
      return
    }
    if (iosStatus === RequestStatus.NotStarted) {
      setIosStatus(RequestStatus.InProgress)
    }
    if (iosStatus === RequestStatus.InProgress && gapi !== undefined) {
      gapi.client.analyticsadmin.properties.iosAppDataStreams
        .list({
          parent: property,
          pageToken: iosPageToken,
        })
        .then(response => {
          const nextToken = response.result.nextPageToken
          setIos((old = []) =>
            old.concat(response.result.iosAppDataStreams || [])
          )
          if (nextToken === undefined) {
            setIosStatus(RequestStatus.Successful)
          } else {
            setIosPageToken(nextToken)
          }
        })
        .catch(e => {
          console.error({ e })
          setWebStatus(RequestStatus.Failed)
        })
    }
  }, [gapi, iosPageToken, iosStatus, property])

  if (
    webStatus === RequestStatus.Successful &&
    androidStatus === RequestStatus.Successful &&
    iosStatus === RequestStatus.Successful
  ) {
    return {
      status: webStatus,
      web: web || [],
      android: android || [],
      ios: ios || [],
      streams,
    }
  }
  if (
    webStatus === RequestStatus.Failed ||
    androidStatus === RequestStatus.Failed ||
    iosStatus === RequestStatus.Failed
  ) {
    return { status: RequestStatus.Failed }
  }
  if (
    webStatus === RequestStatus.NotStarted &&
    androidStatus === RequestStatus.NotStarted &&
    iosStatus === RequestStatus.NotStarted
  ) {
    return { status: RequestStatus.NotStarted }
  }
  return { status: RequestStatus.InProgress }
}

export default useStreams
