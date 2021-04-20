export interface WithEtag<T> {
  value: T
  etag: string
}

export type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

export enum RequestStatus {
  Complete,
  NotStarted,
  Pending,
}

export type Requestable<Complete, NotStarted, All = {}, Pending = NotStarted> =
  | (Complete & All & { requestStatus: RequestStatus.Complete })
  | (NotStarted & All & { requestStatus: RequestStatus.NotStarted })
  | (Pending & All & { requestStatus: RequestStatus.Pending })
