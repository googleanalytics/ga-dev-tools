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

export type Requestable<
  Complete,
  NotStarted,
  Failed,
  All = {},
  Pending = NotStarted
> =
  | (Complete & All & { requestStatus: RequestStatus.Complete })
  | (NotStarted & All & { requestStatus: RequestStatus.NotStarted })
  | (Failed & All & { requestStatus: RequestStatus.Failed })
  | (Pending & All & { requestStatus: RequestStatus.Pending })
