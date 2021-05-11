import * as React from "react"

import { PAB } from "@/components/Buttons"
import { ValidationStatus } from "../types"

interface Props {
  validationStatus: ValidationStatus
  validateEvent: () => void
}

const ValidateEventButton: React.FC<Props> = ({
  validationStatus,
  validateEvent,
}) => {
  let buttonText: string
  switch (validationStatus) {
    case ValidationStatus.Invalid:
      buttonText = "Revalidate event"
      break
    case ValidationStatus.Pending:
      buttonText = "Validating..."
      break
    default:
      buttonText = "Validate event"
      break
  }

  return (
    <PAB
      disabled={validationStatus === ValidationStatus.Pending}
      onClick={validateEvent}
    >
      {buttonText}
    </PAB>
  )
}

export default ValidateEventButton
