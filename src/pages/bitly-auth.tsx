import React from "react"

import Typography from "@material-ui/core/Typography"
import Layout from "@/components/Layout"
import { useLocation } from "@reach/router"
import { StorageKey } from "@/constants"
import { usePersistentString } from "@/hooks"

type BitlyAuthResponse = {
  access_token: string
  login: string
}

const getToken = async (code: string) => {
  const authEndpoint = process.env.AUTH_ENDPOINT
  if (authEndpoint === undefined) {
    throw new Error(
      "process.env.AUTH_ENDPOINT must be set for this page to work."
    )
  }
  const response = await fetch(authEndpoint, {
    method: "POST",
    body: JSON.stringify({
      code,
    }),
  })
  if (response.ok) {
    const { access_token }: BitlyAuthResponse = await response.json()
    return access_token
  } else {
    throw new Error(`Error with auth endpoint: ${await response.text()}`)
  }
}

export const useBitlyAPIKey = () => {
  // This should be pulled out into a hook since it's used in a few places.
  return usePersistentString(StorageKey.bitlyAccessToken)
}

// TODO - Consider adding a settings page for revoking access_tokens.
export default ({ location: { pathname } }) => {
  const location = useLocation()
  const params = React.useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const [apiKey, setApiKey] = useBitlyAPIKey()

  React.useEffect(() => {
    const code = params.get("code")
    if (code === null) {
      console.error("This page should always have a `code` url parameter.")
      return
    }
    if (apiKey === "" || apiKey === undefined) {
      getToken(code).then(setApiKey).catch(console.error)
    }
  }, [params, apiKey, setApiKey])

  if (params.get("code") == null) {
    return (
      <Layout
        disableNav
        title="Bitly Auth"
        pathname={pathname}
        description="Only used for authentication."
      >
        <Typography variant="body1">Not found.</Typography>
      </Layout>
    )
  }

  return (
    <Layout
      disableNav
      title="Bitly Auth"
      pathname={pathname}
      description="Only used for authentication."
    >
      <Typography variant="body1">
        {(apiKey === undefined || apiKey === "") &&
          "Authenticating with bitly..."}
        {apiKey !== undefined &&
          apiKey !== "" &&
          "You have been successfully authenticated with bitly. You may now close this page."}
      </Typography>
    </Layout>
  )
}
