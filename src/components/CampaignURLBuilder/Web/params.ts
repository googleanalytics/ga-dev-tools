// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export interface CampaignParams {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_id: string
  utm_content: string
}

export const CampiagnParams: (keyof CampaignParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_id",
  "utm_content",
]

export const extractParamsFromWebsiteURL = (
  websiteURL: string
): Partial<CampaignParams> | undefined => {
  // Also support fragment params.
  let asURL: URL
  try {
    let missingProtocol = /[^://].*?.com/
    if (missingProtocol.test(websiteURL)) {
      asURL = new URL(`https://${websiteURL}`)
    } else {
      asURL = new URL(websiteURL)
    }
  } catch (e) {
    return undefined
  }
  const searchParams = asURL.searchParams
  const campaignParams: Partial<CampaignParams> = {}

  let fragment = asURL.hash
  // Some of the urls we see have fragment, then query params. We support
  // parsing this out, but we do not support keeping it this way in the
  // generated url.

  const queryIndex = fragment.indexOf("?")
  if (queryIndex !== -1) {
    const afterFragment = new URLSearchParams(fragment.substring(queryIndex))
    fragment = fragment.substring(0, queryIndex)
    afterFragment.forEach((v, k) => {
      searchParams.set(k, v)
    })
  }
  // The first character of .hash is always a '#'
  const fragmentParams = new URLSearchParams(fragment.substring(1))

  // Pull out any campaign params that are valid search params
  CampiagnParams.forEach(param => {
    const fromSearch = searchParams.get(param)
    if (fromSearch !== null && fromSearch !== "") {
      campaignParams[param] = fromSearch
    }

    const fromFragment = fragmentParams.get(param)
    if (fromFragment !== null && fromFragment !== "") {
      campaignParams[param] = fromFragment
    }
  })

  return campaignParams
}

export const websiteURLFor = (
  original: string,
  params: Partial<CampaignParams>,
  useFragment: boolean = false
): string => {
  let copyOfOriginal = original

  const fragmentIndex = copyOfOriginal.indexOf("#")
  let fragmentString = ""
  let fragmentParams = new URLSearchParams()
  if (fragmentIndex !== -1) {
    fragmentString = copyOfOriginal.substring(fragmentIndex)
    if (fragmentString.indexOf("=") !== -1) {
      fragmentParams = new URLSearchParams(fragmentString.substring(1))
    }
    copyOfOriginal = copyOfOriginal.substring(0, fragmentIndex)
  }

  const queryIndex = copyOfOriginal.indexOf("?")
  let queryString = ""
  let queryParams = new URLSearchParams()
  if (queryIndex !== -1) {
    queryString = copyOfOriginal.substring(queryIndex)
    queryParams = new URLSearchParams(queryString)
    copyOfOriginal = copyOfOriginal.substring(0, queryIndex)
  }

  // Delete the campaign params from their parameters
  CampiagnParams.forEach(param => {
    queryParams.delete(param)
    fragmentParams.delete(param)
  })

  const forOurParams = useFragment === true ? fragmentParams : queryParams
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return
    }
    forOurParams.set(key, value)
  })

  let fragment = ""
  if (fragmentString !== "" || useFragment) {
    let asParams = fragmentParams.toString()
    if (asParams === "") {
      if (fragmentString.indexOf("=") === -1) {
        fragment = fragmentString
      }
    } else {
      fragment = `#${asParams}`
    }
  }

  let query = ""
  if (queryString !== "" || !useFragment) {
    let asParams = queryParams.toString()
    if (asParams !== "") {
      query = `?${asParams}`
    } else {
    }
  }

  return `${copyOfOriginal}${query}${fragment}`
}
