import { useLocation } from "@reach/router"
import { useEffect, useMemo } from "react"
import useGtag from "./useGtag"

const usePageView = () => {
  const location = useLocation()
  const gtag = useGtag()

  const page_location = useMemo(() => location.origin + location.pathname, [
    location,
  ])

  useEffect(() => {
    gtag("event", "page_view", {
      page_location,
    })
  }, [gtag, page_location])
}

export default usePageView
