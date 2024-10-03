import { useCopy } from "@/hooks"
import { Requestable, RequestStatus } from "@/types"
import { Validator } from "./validator"
import { baseContentSchema } from "./schemas/baseContent"
import { formatCheckLib } from "./handlers/formatCheckLib"
import { formatErrorMessages, formatValidationMessage } from "./handlers/responseUtil"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { EventCtx, UseFirebaseCtx } from ".."
import { InstanceId, ValidationMessage } from "../types"
import usePayload from "./usePayload"
import useInputs from "../useInputs"
import useEvent from "../useEvent"
import useSharableLink from "./useSharableLink"
import {JSONError} from 'json-schema-library';

// Build the query param for the instance that should be used for the event.
// Defaults to an empty measurement_id if neither one is set.
const instanceQueryParamFor = (instanceId: InstanceId) => {
  if (instanceId.firebase_app_id) {
    return `&firebase_app_id=${instanceId.firebase_app_id}`
  }
  if (instanceId.measurement_id) {
    return `&measurement_id=${instanceId.measurement_id}`
  }
  return ``
}

const validateHit = async (
  payload: {},
  instanceId: InstanceId,
  api_secret: string
): Promise<ValidationMessage[]> => {
  const url = `https://www.google-analytics.com/debug/mp/collect?api_secret=${api_secret}${instanceQueryParamFor(
    instanceId
  )}`
  const body = Object.assign({}, payload, {
    validationBehavior: "ENFORCE_RECOMMENDATIONS",
  })
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  const asJson = await result.json()
  return asJson.validationMessages as ValidationMessage[]
}

const sendHit = async (
  payload: {},
  instanceId: InstanceId,
  api_secret: string
): Promise<void> => {
  const url = `https://www.google-analytics.com/mp/collect?${instanceQueryParamFor(
    instanceId
  )}&api_secret=${api_secret}`
  const body = Object.assign({}, payload, {
    validationBehavior: "ENFORCE_RECOMMENDATIONS",
  })
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })
  return
}

export type ValidationSuccessful = {
  sent: boolean
  sendToGA: () => void
  copyPayload: () => void
  copySharableLink: () => void
}
export type ValidationNotStarted = { validateEvent: () => void }
export type ValidationInProgress = {}
export type ValidationFailed = {
  validationMessages: ValidationMessage[]
  validateEvent: () => void
  payloadErrors: string | undefined
}

export const ValidationRequestCtx = createContext<
  ReturnType<typeof useValidateEvent> | undefined
>(undefined)

const useValidateEvent = (): Requestable<
  ValidationSuccessful,
  ValidationNotStarted,
  ValidationInProgress,
  ValidationFailed
> => {
  const useFirebase = useContext(UseFirebaseCtx)
  const { useTextBox } = useContext(EventCtx)!
  const [status, setStatus] = useState(RequestStatus.NotStarted)
  const [validationMessages, setValidationMessages] = useState<
    ValidationMessage[]
  >([])
  const payload = usePayload()
  const [sent, setSent] = useState(false)
  const { instanceId, api_secret } = useContext(EventCtx)!
  const { categories } = useEvent()
  const { payloadErrors } = useInputs(categories)

  useEffect(() => {
    if (!useTextBox) {
      setStatus(RequestStatus.NotStarted)
      setSent(false)
    }
  }, [payload, useTextBox])


  const sendToGA = useCallback(() => {
    if (status !== RequestStatus.Successful) {
      return
    }
    sendHit(payload, instanceId, api_secret).then(() => setSent(true))
  }, [status, payload, instanceId, api_secret])

  const copyPayload = useCopy(
    JSON.stringify(payload, undefined, "  "),
    "copied payload"
  )

  const url = useSharableLink()

  const copySharableLink = useCopy(url, "copied link to event")

  const validatePayloadAttributes = useCallback((payload: any) => {
    const validator = new Validator(baseContentSchema)
    const formatCheckErrors: ValidationMessage[] | [] = formatCheckLib(
          payload,
          instanceId,
          api_secret,
          useFirebase
      )

      if (!validator.isValid(payload) || formatCheckErrors) {
        let validatorErrors: ValidationMessage[] = validator.getErrors(payload).map((err) => {
          return {
            description: err.message,
            validationCode: err?.data?.validationError?.code ? err?.data?.validationError?.code : err.code,
            fieldPath: defineFieldCode(err)
          }
        })

        return [...validatorErrors, ...formatCheckErrors]
      }

      return []
  }, [api_secret, instanceId, useFirebase])

    const validateEvent = useCallback(() => {
      if (status === RequestStatus.InProgress) {
        return
      }
      setStatus(RequestStatus.InProgress)
      setValidationMessages([])

      if (!useTextBox || Object.keys(payload).length !== 0) {
        let validatorErrors = validatePayloadAttributes(payload)

        validateHit(payload, instanceId, api_secret)
            .then(messages => {
              setTimeout(() => {
                if (messages.length > 0 || validatorErrors.length > 0) {
                  const apiValidationErrors = messages.filter(a =>
                      a.fieldPath === "measurement_id"
                          ? !useFirebase
                          : a.fieldPath === "firebase_app_id"
                              ? useFirebase
                              : true
                  )

                  apiValidationErrors.forEach(err => {
                    if (!validatorErrors.map(e => e.description).includes(err.description)) {
                      validatorErrors.push(err)
                    }
                  })

                  validatorErrors = formatErrorMessages(validatorErrors, payload, useFirebase)

                  setValidationMessages(validatorErrors)
                  setStatus(RequestStatus.Failed)
                } else {
                  setStatus(RequestStatus.Successful)
                }
              }, 250)
            })
            .catch(e => {
              console.error(e)
            })
      } else {
        const validatorErrors = formatValidationMessage()
        setValidationMessages(validatorErrors)
        setStatus(RequestStatus.Failed)
      }
    }, [status, payload, api_secret, instanceId, useFirebase, useTextBox, validatePayloadAttributes])

  const defineFieldCode = (error: JSONError) => {
    const { data } = error

    if (data?.pointer) {
      if (data?.key) {
        return data.pointer + '/' + data.key
      } else if (data?.missingProperty) {
        return data.pointer + '/' + data.missingProperty
      }

      return data?.pointer
    }

    return data?.key
  }

  if (status === RequestStatus.Successful) {
    return { status, sendToGA, copyPayload, copySharableLink, sent }
  } else if (status === RequestStatus.NotStarted) {
    return { status, validateEvent }
  } else if (status === RequestStatus.Failed) {
    return { status, validationMessages, validateEvent, payloadErrors}
  } else {
    return { status }
  }
}

export default useValidateEvent
