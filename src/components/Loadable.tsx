import * as React from "react"

import { Requestable, RequestStatus } from "@/types"
import { Typography } from "@material-ui/core"
import Spinner from "./Spinner"

interface LoadableProps<
  Successful = {},
  NotStarted = {},
  InProgress = {},
  Failed = {}
> {
  request: Requestable<Successful, NotStarted, InProgress, Failed>
  renderSuccessful: (successful: Successful) => JSX.Element
  renderFailed?: (failed: Failed) => JSX.Element
  renderNotStarted?: (notStarted: NotStarted) => JSX.Element
  renderInProgress?: (InProgress: InProgress) => JSX.Element
  inProgressText?: string
}

const Loadable = <
  Successful extends {},
  NotStarted extends {},
  InProgress extends {},
  Failed extends {}
>({
  request,
  renderSuccessful,
  renderFailed,
  renderNotStarted,
  renderInProgress,
  inProgressText,
}: LoadableProps<Successful, NotStarted, InProgress, Failed> &
  Parameters<React.FC>["0"]): ReturnType<React.FC> => {
  if (request.status === RequestStatus.Successful) {
    return renderSuccessful(request)
  } else if (request.status === RequestStatus.Failed) {
    return renderFailed !== undefined ? (
      renderFailed(request)
    ) : (
      <Typography>An error has occured.</Typography>
    )
  } else if (request.status === RequestStatus.NotStarted) {
    return renderNotStarted !== undefined ? renderNotStarted(request) : null
  } else if (request.status === RequestStatus.InProgress) {
    return renderInProgress !== undefined ? (
      renderInProgress(request)
    ) : inProgressText !== undefined ? (
      <Spinner ellipses>{inProgressText}</Spinner>
    ) : null
  }

  return null
}

export default Loadable
