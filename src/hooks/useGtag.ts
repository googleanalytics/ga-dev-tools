import { useMemo } from "react"
import { IS_SSR } from "."

const defaultSnippet = (): Gtag.Gtag => {
  if (window.gtag !== undefined) {
    return window.gtag
  }

  ;(window as any).dataLayer = (window as any).dataLayer || []

  function gtag() {
    ;(window as any).dataLayer.push(arguments)
  }

  ;(window as any).gtag = gtag
  ;(gtag as Gtag.Gtag)("js", new Date())
  // We don't send a page view because that's being entirely managed through
  // the 'usePageView' hook.
  ;(gtag as Gtag.Gtag)("config", process.env.GA_MEASUREMENT_ID!, {
    send_page_view: false,
  })

  const head = document.head || document.getElementsByTagName("head")[0]
  const script = document.createElement("script")
  script.type = "text/javascript"
  script.async = true
  script.src = `https://googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`

  head.appendChild(script)

  return gtag
}

const useGtag = () => {
  return useMemo(() => {
    if (IS_SSR) {
      // Return a stubbed out gtag during SSR rendering
      return () => {
        //
      }
    }
    return defaultSnippet()
  }, [])
}

export default useGtag
