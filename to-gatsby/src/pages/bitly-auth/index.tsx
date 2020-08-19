import React from "react"

import Typography from "@material-ui/core/Typography"
import Layout from "../../components/layout"
import { StorageKey } from "../../constants"
import { useLocalStorage } from "react-use"

import { useLocation } from "@reach/router"

type BitlyAuthResponse = {
  access_token: string
  login: string
}

const getToken = async (code: string) => {
  // TODO - see the best way of providing this value. There might be a better
  // way than providing the full endpoint, but that's probably best for a
  // start.
  const apiEndpoint =
    "http://localhost:5001/dev-tools-asha/us-central1/bitly_auth"
  const response = await fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify({
      code,
    }),
  })
  const { access_token }: BitlyAuthResponse = await response.json()
  return access_token
}

// TODO - Consider adding a settings page for revoking access_tokens.
export default () => {
  const location = useLocation()
  const params = React.useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  // This should be pulled out into a hook since it's used in a few places.
  const [apiKey, setApiKey] = useLocalStorage<string>(
    StorageKey.bitlyAccessToken,
    "",
    { raw: true }
  )

  React.useEffect(() => {
    const code = params.get("code")
    if (code === null) {
      console.error("This page should always have a `code` url parameter.")
      return
    }
    if (apiKey !== "") {
      return
    }
    getToken(code).then(setApiKey)
  }, [params, apiKey, setApiKey])

  if (params.get("code") == null) {
    return (
      <Layout disableNav title="Bitly Auth">
        <Typography variant="body1">Not found.</Typography>
      </Layout>
    )
  }

  return (
    <Layout disableNav title="Bitly Auth">
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
