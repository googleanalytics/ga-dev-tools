import { URLVersion } from "./types"
import { Base64 } from "js-base64"

export const ensureVersion = (
  urlParams: URLSearchParams,
  params: { Version: string },
  version: URLVersion
) => {
  const currentV = urlParams.get(params.Version)
  if (currentV === null) {
    urlParams.append(params.Version, version)
  }
}

export const encodeObject = <T>(t: T): string =>
  Base64.encode(JSON.stringify(t), true)

export const decodeObject = <T>(s: string): T => JSON.parse(Base64.decode(s))
