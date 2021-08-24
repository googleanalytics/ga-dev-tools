import * as functions from "firebase-functions"
import fetch from "node-fetch"

const bitlyAuth = (isIntegration: boolean) => (
  req: functions.https.Request,
  res: functions.Response<any>
) => {
  res.set("Access-Control-Allow-Origin", "*")

  if (req.method !== "POST") {
    res.status(403).send("Only POST requests are supported.")
    return
  }

  const params = JSON.parse(req.body)

  if (params.code === undefined) {
    res.status(403).send("Request requires a `code` parameter.")
    return
  }

  const config = functions.config()
  const bitly = config.bitly

  if (bitly === undefined) {
    console.error(
      "Missing bitly configuration. Run:\nyarn check-config --all\nand provide values for bitly clientId and clientSecret."
    )
  }

  const clientId = bitly.client_id
  if (clientId === undefined) {
    console.error(
      "Missing bitly clientId. Run:\nyarn check-config --all\nand provide a value for bitly clientId"
    )
  }

  const clientSecret = bitly.client_secret
  if (clientSecret === undefined) {
    console.error(
      "Missing bitly clientSecret. Run:\nyarn check-config --all\nand provide a value for bitly clientSecret"
    )
  }

  const baseUri = bitly.base_uri
  if (baseUri === undefined) {
    console.error(
      "Missing bitly base_uri. Run:\nyarn check-config --all\nand provide a value for baseUri."
    )
  }

  const redirectUri = isIntegration
    ? `https://ga-dev-tools-integration.web.app/bitly-auth`
    : `${baseUri}/bitly-auth`

  const bitlyAuthEndpoint = "https://api-ssl.bitly.com/oauth/access_token"
  const bitlyBody = [
    ["client_id", clientId],
    ["client_secret", clientSecret],
    ["code", params.code],
    ["redirect_uri", redirectUri],
  ]
    .map(kv => kv.join("="))
    .join("&")

  // TODO - This can be cleaned up a lot with async/await
  // TODO - I probably should set the content-type I'm returning somewhere?
  fetch(bitlyAuthEndpoint, {
    method: "POST",
    body: bitlyBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  }).then(
    bitlyRes => {
      res.status(bitlyRes.status)
      bitlyRes.json().then(
        json => {
          res.status(bitlyRes.status).send(json)
        },
        () => {
          res.send()
        }
      )
    },
    err => {
      console.error("error", err)
      res.status(err.status || 403).send(err.body || "An error occurred")
    }
  )
}

exports.bitly_auth = functions.https.onRequest(bitlyAuth(false))
exports.bitly_auth_integration = functions.https.onRequest(bitlyAuth(true))
