export interface WithEtag<T> {
  value: T
  etag: string
}

export type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

export enum RequestStatus {
  Successful,
  NotStarted,
  InProgress,
  Failed,
}

export type Requestable<
  Successful = { status: RequestStatus.Successful },
  NotStarted = { status: RequestStatus.NotStarted },
  InProgress = { status: RequestStatus.InProgress },
  Failed = { status: RequestStatus.Failed }
> =
  | (Successful & { status: RequestStatus.Successful })
  | (NotStarted & { status: RequestStatus.NotStarted })
  | (Failed & { status: RequestStatus.Failed })
  | (InProgress & { status: RequestStatus.InProgress })
