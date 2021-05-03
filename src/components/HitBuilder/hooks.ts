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

import * as React from "react"

import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "@reach/router"

import { getAnalyticsApi } from "@/api"
import { Params, Param, ValidationMessage, HitStatus, Property } from "./types"
import * as hitUtils from "./hit"

const formatMessage = (message: {
  parameter: any
  description: string
  messageType: any
  messageCode: any
}) => {
  const linkRegex = /Please see http:\/\/goo\.gl\/a8d4RP#\w+ for details\.$/
  return {
    param: message.parameter,
    description: message.description.replace(linkRegex, "").trim(),
    type: message.messageType,
    code: message.messageCode,
  }
}

const sleep = async (milliseconds: number): Promise<void> => {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

export type Validation = {
  validationMessages: ValidationMessage[]
  hitStatus: HitStatus
  // Validate the hit against the measurement protocol validation server
  validateHit: () => void
  // Send the hit to GA
  sendHit: () => void
}
type UseValidationServer = (parameters: Params) => Validation
export const useValidationServer: UseValidationServer = parameters => {
  const [hitStatus, setHitStatus] = React.useState(HitStatus.Unvalidated)

  React.useEffect(() => {
    setHitStatus(HitStatus.Unvalidated)
  }, [parameters])

  const [validationMessages, setValidationMessages] = React.useState<
    ValidationMessage[]
  >([])

  const validateHit = React.useCallback(() => {
    setHitStatus(HitStatus.Validating)
    try {
      const hit = hitUtils.convertParamsToHit(parameters)
      Promise.all<hitUtils.ValidationResult, void>([
        hitUtils.getHitValidationResult(hit),
        sleep(500),
      ]).then(([validationResult, _]) => {
        const result = validationResult.response.hitParsingResult[0]
        const validationMessages = result.parserMessage.filter(
          // TODO - I might want to do something different with ERRORS
          // versus INFOs. Check what the current one does.
          message => message.messageType === "ERROR"
        )
        setValidationMessages(validationMessages.map(formatMessage))
        if (result.valid) {
          setHitStatus(HitStatus.Valid)
        } else {
          setHitStatus(HitStatus.Invalid)
        }
      })
    } catch (e) {}
  }, [parameters])

  const sendHit = React.useCallback(async () => {
    setHitStatus(HitStatus.Sending)
    const hit = hitUtils.convertParamsToHit(parameters)
    await Promise.all([
      sleep(500),
      fetch("https://www.google-analytics.com/collect", {
        method: "POST",
        body: hit,
      }),
    ])
    setHitStatus(HitStatus.Sent)
  }, [parameters])

  return { validationMessages, validateHit, hitStatus, sendHit }
}

let id = 0
const nextId = () => {
  id++
  return id
}

export type ParametersAPI = {
  updateParameterName: (id: number, newName: string) => void
  updateParameterValue: (id: number, newValue: any) => void
  addParameter: (parameterName?: string) => void
  removeParameter: (id: number) => void
  hasParameter: (parameterName: string) => boolean
  setParametersFromString: (paramString: string) => void
  parameters: Params
  shouldFocus: (id: number, value: boolean) => boolean
  setFocus: (id: number, value: boolean) => void
}
type UseParameters = () => ParametersAPI
export const useParameters: UseParameters = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [parameters, setParameters] = React.useState<Params>(() => {
    const initial = hitUtils.getInitialHitAndUpdateUrl(location, navigate)
    return hitUtils.convertHitToParams(nextId, initial)
  })

  const [focusData, setFocusData] = React.useState<
    | {
        id: number
        value: boolean
      }
    | undefined
  >(undefined)

  const setParametersFromString = React.useCallback((paramString: string) => {
    setFocusData(undefined)
    setParameters(hitUtils.convertHitToParams(nextId, paramString))
  }, [])

  // Sets the focus to a particular param/value combo
  const setFocus = React.useCallback((id, value = false) => {
    setFocusData({ id, value })
  }, [])

  const resetFocus = React.useCallback(() => {
    setFocusData(undefined)
  }, [setFocusData])

  const shouldFocus = React.useCallback(
    (id: number, value = false) => {
      if (focusData === undefined) {
        return false
      }
      // Not sure about the value part.
      return focusData.id === id && focusData.value === value
    },
    [focusData]
  )

  const hasParameter = React.useCallback(
    (parameterName: string): boolean => {
      const param = parameters.find(p => p.name === parameterName)
      return param !== undefined
    },
    [parameters]
  )

  const addParameter = React.useCallback(
    (parameterName?: string) => {
      const id = nextId()
      const nuParameter: Param = { id, name: parameterName || "", value: "" }
      setParameters(([v, t, tid, cid, ...others]) => {
        return [v, t, tid, cid, ...others.concat([nuParameter])]
      })
      setFocus(id, parameterName !== undefined)
    },
    [setFocus]
  )

  const removeParameter = React.useCallback(
    (id: number) => {
      setParameters(([v, t, tid, cid, ...others]) => {
        resetFocus()
        return [v, t, tid, cid, ...others.filter(a => a.id !== id)]
      })
    },
    [resetFocus]
  )

  const updateParameterName = React.useCallback(
    (id: number, newName: string) => {
      setParameters(([v, t, tid, cid, ...others]) => {
        return [
          v,
          t,
          tid,
          cid,
          ...others.map(param =>
            param.id === id ? { ...param, name: newName } : param
          ),
        ]
      })
    },
    []
  )

  const updateParameterValue = React.useCallback(
    (id: number, newValue: any) => {
      setParameters(params => {
        const nuParams = params.map(param =>
          param.id === id ? { ...param, value: newValue } : param
        ) as Params
        return nuParams
      })
    },
    []
  )

  return {
    setFocus,
    shouldFocus,
    updateParameterName,
    updateParameterValue,
    addParameter,
    removeParameter,
    hasParameter,
    setParametersFromString,
    parameters,
  }
}

type UseProperties = () => {
  properties: Property[]
}
// This hook encapsulates the logic for getting the user's GA properties using
// the management api.
export const useProperties: UseProperties = () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const [properties, setProperties] = React.useState<Property[]>([])

  React.useEffect(() => {
    if (gapi === undefined) {
      return
    }
    ;(async () => {
      const api = getAnalyticsApi(gapi)
      const summaries = (await api.management.accountSummaries.list({})).result
      const properties: Property[] = []
      summaries.items?.forEach(account => {
        const accountName = account.name || ""
        account.webProperties?.forEach(property => {
          const propertyName = property.name || ""
          const propertyId = property.id || ""
          properties.push({
            name: propertyName,
            id: propertyId,
            group: accountName,
          })
        })
      })
      setProperties(properties)
    })()
  }, [gapi])

  return { properties }
}
