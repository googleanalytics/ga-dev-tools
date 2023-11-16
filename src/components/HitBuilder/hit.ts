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

import { WindowLocation } from "@reach/router"

import {
  Param,
  Params,
  RequiredParams,
  ParamV,
  ParamT,
  ParamTId,
  ParamCId,
  ParamOptional,
  HIT_TYPES,
} from "./types"

const DEFAULT_HIT = "v=1&t=pageview"

/**
 * Gets the initial hit from the URL if present. If no hit is found in the URL
 * the default hit is used.
 * @return The default hit.
 */
export function getInitialHitAndUpdateUrl(l: WindowLocation): string {
  const query = l.search.slice(1)

  if (query === "") {
    return DEFAULT_HIT
  }
  // Remove the query params after initial load.
  window.history.replaceState({}, document.title, window.location.pathname)
  return query
}

/**
 * Accepts a hit payload or URL and converts it into an array of param objects
 * where the required params are always first and in the correct order.
 * @param hit A query string or hit payload.
 */
export function convertHitToParams(
  nextId: () => number,
  hit: string = ""
): Params {
  // If the hit contains a "?", remove it and all characters before it.
  const searchIndex = hit.indexOf("?")
  if (searchIndex > -1) hit = hit.slice(searchIndex + 1)

  let query = new URLSearchParams()
  try {
    query =  new URLSearchParams(hit)
  } catch (e) {
    // It's common to paste in a string that's invalid, but we can easily
    // recover from here.
  }

  // Create required params first, regardless of order in the hit.
  const v: ParamV = {
    id: nextId(),
    name: RequiredParams.V,
    value: query.get(RequiredParams.V) || "1",
    required: true,
  }
  const t: ParamT = {
    id: nextId(),
    name: RequiredParams.T,
    value: query.get(RequiredParams.T) || HIT_TYPES[0],
    required: true,
  }
  const tid: ParamTId = {
    id: nextId(),
    name: RequiredParams.T_Id,
    value: query.get(RequiredParams.T_Id) || "",
    required: true,
  }
  const cid: ParamCId = {
    id: nextId(),
    name: RequiredParams.C_Id,
    value: query.get(RequiredParams.C_Id) || "",
    required: true,
  }
  query.delete(RequiredParams.V)
  query.delete(RequiredParams.T)
  query.delete(RequiredParams.T_Id)
  query.delete(RequiredParams.C_Id)

  // Create optional params after required params.
  const others: ParamOptional[] = Array.from(query).map(([name, v]) => {
    const value = v === undefined ? "" : v
    return {
      name,
      value,
      id: nextId(),
      isOptional: true,
    }
  })
  const params: Params = [v, t, tid, cid, ...others]
  return params
}

/**
 * Returns the hit model data as a query string.
 * @param params An array of param objects.
 */
export function convertParamsToHit(params: Param[]): string {
  const searchParams = new URLSearchParams()

  //const query: { [name: string]: any } = {}
  for (const { name, value } of params) {
    if (value === "") {
      continue
    }
    searchParams.append(name, value)
    //query[name] = value
  }

  // Convert the URLSearchParams object to a string.
  const searchParamsString = searchParams.toString()
  // Replace the encoded commas with commas.
  const decodedSearchParamsString = searchParamsString.replace(/%2C/g, ',')

  return decodedSearchParamsString
}

export interface ValidationResult {
  response: {
    parserMessage: any[]
    hitParsingResult: {
      valid: boolean
      parserMessage: {
        messageType: any
        description: string
        messageCode: any
        parameter: string
      }[]
      hit: string
    }[]
  }
  hit: string
}

/**
 * Sends a validation request to the Measurement Protocol Validation Server
 * and returns a promise that will be fulfilled with the response.
 * @param hit A Measurement Protocol hit payload.
 */
export async function getHitValidationResult(
  hit: string
): Promise<ValidationResult> {
  const apiResponse = await fetch(
    "https://www.google-analytics.com/debug/collect",
    {
      method: "POST",
      body: hit,
    }
  )
  const asJson = await apiResponse.json()
  return { response: asJson, hit }
}
