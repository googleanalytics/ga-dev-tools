export interface WithEtag<T> {
  value: T
  etag: string
}

export type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

export enum RequestStatus {
  Complete,
  NotStarted,
  Pending,
  Failed,
}

export type Requestable<NotStarted, Pending, Successful, Failed> =
  | (Successful & { requestStatus: RequestStatus.Complete })
  | (NotStarted & { requestStatus: RequestStatus.NotStarted })
  | (Failed & { requestStatus: RequestStatus.Failed })
  | (Pending & { requestStatus: RequestStatus.Pending })
