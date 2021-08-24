import React from "react"

import { Dispatch } from "@/types"
import { StorageKey } from "@/constants"
import { usePersistantObject } from "@/hooks"
import { useBitlyAPIKey } from "@/pages/bitly-auth"

type BitlyStorageCache = {
  // Cache starts at guid level.
  [GUID: string]:
    | {
        // Then is indexd by the longUrl
        [longLink: string]: string | undefined
      }
    | undefined
}

type SetCacheFn = Dispatch<BitlyStorageCache | undefined>

/**
 * Accepts a long URL and returns a promise that is resolved with its shortened
 * version, using the bitly API.
 *
 * This function memoizes its results using the provided cache & setCacheValue
 * arguments.
 */
const shortenUrl = async (
  token: string,
  longUrl: string,
  cache: BitlyStorageCache | undefined,
  setCacheValue: SetCacheFn
): Promise<string> => {
  const user = await bitlyUser(token)
  const guid = user.default_group_guid

  const cachedLink = cache?.[guid]?.[longUrl]
  if (cachedLink !== undefined) {
    return cachedLink
  }

  // If the link isn't in the local cache, create it.
  const shortned = await bitlyShorten(token, longUrl, guid)
  const link = shortned.link

  updateBitlyCache(guid, longUrl, link, setCacheValue)

  return link
}

const updateBitlyCache = (
  guid: string,
  longUrl: string,
  shortUrl: string,
  setCacheValue: SetCacheFn
): void => {
  setCacheValue((old = {}) => {
    old[guid] = old[guid] || {}
    old[guid]![longUrl] = shortUrl
    return old
  })
}

// https://dev.bitly.com/api-reference#createBitlink
export type ShortenResponse = {
  link: string
}
const bitlyShorten = async (
  token: string,
  longUrl: string,
  guid: string
): Promise<ShortenResponse> => {
  const url = "https://api-ssl.bitly.com/v4/shorten"

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ long_url: longUrl, group_guid: guid }),
  })

  const json = await response.json()
  return json
}

// https://dev.bitly.com/api-reference#getUser
type UserResponse = {
  default_group_guid: string
}
const bitlyUser = async (token: string): Promise<UserResponse> => {
  const url = "https://api-ssl.bitly.com/v4/user"

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  const json = await response.json()
  return json
}

const NO_BITLY_CLIENT_ID =
  "A bitly clientId is required for shortening links.\nPlease run:\nyarn check-config --all\nAnd provide a value for bitlyClientId"

const WINDOW_FEATURES = [
  ["toolbar", "no"],
  ["menubar", "no"],
  ["width", "600"],
  ["height", "700"],
  ["top", "100"],
  ["left", "100"],
]
  .map(pair => pair.join("="))
  .join(", ")

type UseShortLink = () => {
  authenticated: boolean
  canShorten: boolean
  shorten: (
    longLink: string
  ) => Promise<{ shortLink: string; longLink: string }>
}

const useShortenLink: UseShortLink = () => {
  const clientId = process.env.BITLY_CLIENT_ID
  const [token, setToken] = useBitlyAPIKey()
  const [cache, setCache] = usePersistantObject(StorageKey.bitlyCache)

  const ensureAuth = React.useCallback(async (): Promise<string> => {
    if (token !== "" && token !== undefined) {
      return token
    }
    return new Promise(resolve => {
      const redirectUri = `${window.location.origin}/bitly-auth`
      const url = `https://bitly.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`
      const name = "Login with Bit.ly"
      window.open(url, name, WINDOW_FEATURES)
      // TODO - See if there's a better way of getting a notification from the
      // oauth popup.
      const storageListener = (e: StorageEvent) => {
        if (e.key === StorageKey.bitlyAccessToken && e.newValue !== null) {
          const s = e.newValue
          const parsed = JSON.parse(s)
          setToken(parsed.value)
          resolve(parsed.value)
        }
      }
      window.addEventListener("storage", storageListener)
    })
  }, [token, setToken, clientId])

  const shorten = React.useCallback(
    async (longLink: string) => {
      if (longLink.startsWith("https://bit.ly")) {
        throw new Error("Cannot shorten a shortlink")
      }
      if (longLink === "") {
        throw new Error("Cannot shorten an empty string")
      }
      if (
        longLink.startsWith("http://localhost") ||
        longLink.startsWith("localhost") ||
        longLink.startsWith("127.0.0.1")
      ) {
        throw new Error(
          "You can't create a short link to a local-only site. Use a publically accessible URL."
        )
      }
      const token = await ensureAuth()
      const shortLink = await shortenUrl(token, longLink, cache, setCache)
      return { shortLink, longLink }
    },
    [ensureAuth, cache, setCache]
  )

  if (clientId === undefined) {
    console.error(NO_BITLY_CLIENT_ID)
    // Return a stubbed out version that throws if you try to shorten a link.
    return {
      canShorten: false,
      authenticated: false,
      shorten: async _ => {
        throw new Error(NO_BITLY_CLIENT_ID)
      },
    }
  }

  return {
    canShorten: true,
    shorten,
    authenticated: token !== "",
  }
}

export default useShortenLink
