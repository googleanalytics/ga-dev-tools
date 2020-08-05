import * as React from "react"
import { useSelector } from "react-redux"
import { useLocation } from "@reach/router"

export const usePageView = () => {
  const measurementId = useSelector((a: AppState) => a.measurementID)
  const location = useLocation()
  const gtag = useSelector((a: AppState) => a.gtag)
  React.useEffect(() => {
    if (gtag === undefined) {
      return
    }
    gtag("config", measurementId, {
      page_path: location.pathname,
    })
  }, [location.pathname, measurementId, gtag])
}

type UseSendEvent = () => (
  action: string,
  params: {
    event_category?: string
    event_label?: string
    value?: number
  }
) => void
export const useSendEvent: UseSendEvent = () => {
  const gtag = useSelector((a: AppState) => a.gtag)

  const sendEvent: ReturnType<UseSendEvent> = React.useCallback(
    (name, params) => {
      if (gtag === undefined) {
        return
      }
      gtag("event", name, params)
    },
    [gtag]
  )

  return sendEvent
}
