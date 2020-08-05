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

import { Params, Param, ValidationMessage, HitStatus, Property } from "./_types"
import * as hitUtils from "./_hit"
import { useSelector } from "react-redux"
import { getAnalyticsApi } from "../../api"
import { useLocation, useNavigate } from "@reach/router"
import { useSendEvent } from "../../hooks"

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

type UseValidationServer = (
  parameters: Params
) => {
  validationMessages: ValidationMessage[]
  hitStatus: HitStatus
  // Validate the hit against the measurement protocol validation server
  validateHit: () => void
  // Send the hit to GA
  sendHit: () => void
}

const sleep = async (milliseconds: number): Promise<void> => {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

// This hook encapsulates the logic needed for the validation server
export const useValidationServer: UseValidationServer = parameters => {
  const sendEvent = useSendEvent()
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
          sendEvent("validate", {
            event_category: "Hit Builder",
            event_label: "valid",
          })
        } else {
          setHitStatus(HitStatus.Invalid)
          sendEvent("validate", {
            event_category: "Hit Builder",
            event_label: "invalid",
          })
        }
      })
    } catch (e) {
      sendEvent("validate", {
        event_category: "Hit Builder",
        event_label: "error",
      })
    }
  }, [parameters, sendEvent])

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
    sendEvent("validate", {
      event_category: "Hit Builder",
      event_label: "sent hit through tool",
    })
  }, [parameters, sendEvent])

  return { validationMessages, validateHit, hitStatus, sendHit }
}

type UseParameters = () => {
  updateParameterName: (id: number, newName: string) => void
  updateParameterValue: (id: number, newValue: any) => void
  addParameter: (parameterName?: string) => void
  removeParameter: (id: number) => void
  hasParameter: (parameterName: string) => boolean
  setParametersFromString: (paramString: string) => void
  parameters: Params
}

let id = 0
const nextId = () => {
  id++
  return id
}

// This hook encapsulates the logic needed for adding, removing & updating parameters.
export const useParameters: UseParameters = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [parameters, setParameters] = React.useState<Params>(() => {
    const initial = hitUtils.getInitialHitAndUpdateUrl(location, navigate)
    return hitUtils.convertHitToParams(nextId, initial)
  })

  // TODO - see if there's a simple way to keep track of some state for whether
  // or not a parameter name or value should be focused.
  // TODO - This shouldn't focus the parameter name if it was already there.
  const setParametersFromString = React.useCallback((paramString: string) => {
    setParameters(hitUtils.convertHitToParams(nextId, paramString))
  }, [])

  const hasParameter = React.useCallback(
    (parameterName: string): boolean => {
      const param = parameters.find(p => p.name === parameterName)
      return param !== undefined
    },
    [parameters]
  )

  const addParameter = React.useCallback((parameterName?: string) => {
    const id = nextId()
    // TODO - If a parameter name is provided, we should focus the value, not
    // the parameter name.
    const nuParameter: Param = { id, name: parameterName || "", value: "" }
    setParameters(([v, t, tid, cid, ...others]) => {
      return [v, t, tid, cid, ...others.concat([nuParameter])]
    })
  }, [])

  const removeParameter = React.useCallback((id: number) => {
    setParameters(([v, t, tid, cid, ...others]) => {
      return [v, t, tid, cid, ...others.filter(a => a.id !== id)]
    })
  }, [])

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
