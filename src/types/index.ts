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
  Successful = {},
  NotStarted = {},
  InProgress = {},
  Failed = {}
> =
  | (Successful & { status: RequestStatus.Successful })
  | (NotStarted & { status: RequestStatus.NotStarted })
  | (Failed & { status: RequestStatus.Failed })
  | (InProgress & { status: RequestStatus.InProgress })

export const successful = <A>(request: Requestable<A>): A | undefined => {
  if (request.status === RequestStatus.Successful) {
    return request
  }
  return undefined
}

export const notStarted = <A, B>(request: Requestable<A, B>): B | undefined => {
  if (request.status === RequestStatus.NotStarted) {
    return request
  }
  return undefined
}

export const inProgress = <A, B, C>(
  request: Requestable<A, B, C>
): C | undefined => {
  if (request.status === RequestStatus.InProgress) {
    return request
  }
  return undefined
}

export enum URLVersion {
  _1 = "1",
  _2 = "2",
}
