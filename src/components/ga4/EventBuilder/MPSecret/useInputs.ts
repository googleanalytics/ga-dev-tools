import { useState } from "react"

import { MPSecret } from "./useMPSecretsRequest"

export enum CreationStatus {
  NotStarted = "not-started",
  ShowDialog = "show-dialog",
  Creating = "creating",
  Done = "done",
  Failed = "failed",
}

const useInputs = () => {
  const [displayName, setDisplayName] = useState("")
  const [creationStatus, setCreationStatus] = useState<CreationStatus>(
    CreationStatus.NotStarted
  )

  return {
    displayName,
    setDisplayName,
    creationStatus,
    setCreationStatus,
  }
}

export default useInputs
