import { navigate } from "gatsby"
import { useLocation } from "@reach/router"
import { useEffect } from "react"

// This is used to do client-side redirects from the old ga:id style hash that
// was used in the old demos and tools site.
const useAnchorRedirects = (
  columns: gapi.client.analytics.Column[] | undefined
) => {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (hash === undefined || hash === "" || columns === undefined) {
      return
    }
    if (hash.startsWith("#ga:")) {
      const id = hash.substring(1)
      const column = columns.find(column => {
        return column.id === id
      })
      // This is the case where there isn't a dim/met to redirect to.
      if (column === undefined) {
        return
      }
      const group = column.attributes!.group
      const newUrl =
        pathname +
        group.toLowerCase().replaceAll(" ", "-") +
        "#" +
        hash.substring(4)
      navigate(newUrl, { replace: true })
    }
  }, [hash, columns, pathname])
}

export default useAnchorRedirects
