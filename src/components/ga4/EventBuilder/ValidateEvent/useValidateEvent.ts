import { useCopy } from "@/hooks"
import { Requestable, RequestStatus } from "@/types"
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
import useSharableLink from "./useSharableLink"

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
  const [status, setStatus] = useState(RequestStatus.NotStarted)
  const [validationMessages, setValidationMessages] = useState<
    ValidationMessage[]
  >([])
  const payload = usePayload()
  const [sent, setSent] = useState(false)
  const { instanceId, api_secret } = useContext(EventCtx)!

  // Whenever the payload changes, we start the "request" over.
  useEffect(() => {
    setStatus(RequestStatus.NotStarted)
    setSent(false)
  }, [payload])

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

  const validateEvent = useCallback(() => {
    if (status === RequestStatus.InProgress) {
      return
    }
    setStatus(RequestStatus.InProgress)
    validateHit(payload, instanceId, api_secret)
      .then(messages => {
        setTimeout(() => {
          if (messages.length > 0) {
            setValidationMessages(
              messages.filter(a =>
                a.fieldPath === "measurement_id"
                  ? !useFirebase
                  : a.fieldPath === "firebase_app_id"
                  ? useFirebase
                  : true
              )
            )
            setStatus(RequestStatus.Failed)
          } else {
            setStatus(RequestStatus.Successful)
          }
        }, 250)
      })
      .catch(e => {
        console.error(e)
      })
  }, [status, payload, api_secret, instanceId, useFirebase])

  if (status === RequestStatus.Successful) {
    return { status, sendToGA, copyPayload, copySharableLink, sent }
  } else if (status === RequestStatus.NotStarted) {
    return { status, validateEvent }
  } else if (status === RequestStatus.Failed) {
    return { status, validationMessages, validateEvent }
  } else {
    return { status }
  }
}

export default useValidateEvent
