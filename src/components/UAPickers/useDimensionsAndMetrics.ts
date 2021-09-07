import { Column, UAAccountPropertyView } from "@/types/ua"
import { createContext, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import useCached from "@/hooks/useCached"
import { StorageKey } from "@/constants"
import moment from "moment"
import { Requestable, RequestStatus } from "@/types"

export const UADimensionsAndMetricsRequestCtx = createContext<
  ReturnType<typeof useUADimensionsAndMetrics>
>({ status: RequestStatus.NotStarted })

interface Successful {
  columns: Column[]
  metrics: Column[]
  dimensions: Column[]
}

const useUADimensionsAndMetrics = ({
  account,
  property,
  view,
}: UAAccountPropertyView): Requestable<Successful> => {
  const gapi = useSelector((state: AppState) => state.gapi)

  const metadataAPI = useMemo(() => gapi?.client?.analytics?.metadata, [gapi])
  const managementAPI = useMemo(() => gapi?.client?.analytics?.management, [
    gapi,
  ])

  const requestReady = useMemo(() => {
    if (
      metadataAPI === undefined ||
      managementAPI === undefined ||
      account === undefined ||
      property === undefined ||
      view === undefined
    ) {
      return false
    }
    return true
  }, [metadataAPI, managementAPI, account, property, view])

  const makeRequest = useCallback(async () => {
    if (
      metadataAPI === undefined ||
      managementAPI === undefined ||
      account === undefined ||
      property === undefined ||
      view === undefined
    ) {
      throw new Error(
        "Invalid invariant - metadataAPI, managementAPI, account, property, and view must be defined here."
      )
    }
    const columnsResponse = await metadataAPI.columns.list({ reportType: "ga" })
    const columns = columnsResponse.result.items

    const [
      customDimensionsResponse,
      customMetricsResponse,
      goalsResponse,
    ] = await Promise.all([
      managementAPI.customDimensions.list({
        accountId: account.id!,
        webPropertyId: property.id!,
      }),
      managementAPI.customMetrics.list({
        accountId: account.id!,
        webPropertyId: property.id!,
      }),
      managementAPI.goals.list({
        accountId: account.id!,
        webPropertyId: property.id!,
        profileId: view.id!,
      }),
    ])

    const customDimensions = customDimensionsResponse.result.items
    const customMetrics = customMetricsResponse.result.items
    const goals = goalsResponse.result.items

    return columns?.flatMap(column => {
      if (customDimensions !== undefined && column.id === "ga:dimensionXX") {
        return customDimensions.map(
          dimension =>
            ({
              ...column,
              id: dimension.id,
              attributes: { ...column.attributes, uiName: dimension.name },
            } as Column)
        )
      }
      if (customMetrics !== undefined && column.id === "ga:metricXX") {
        return customMetrics.map(
          metric =>
            ({
              ...column,
              id: metric.id,
              attributes: { ...column.attributes, uiName: metric.name },
            } as Column)
        )
      }
      if (
        goals !== undefined &&
        column.attributes!.minTemplateIndex !== undefined &&
        /goalxx/i.test(column.id!)
      ) {
        return goals.map(goal => ({
          ...column,
          id: column.id!.replace("XX", goal.id!),
          attributes: {
            ...column.attributes,
            uiName: `${goal.name} (${column.attributes!.uiName.replace(
              "XX",
              goal.id!
            )})`,
          },
        }))
      }
      if (column.attributes!.minTemplateIndex !== undefined) {
        let min = 0
        let max = 0
        if (
          property?.level === "PREMIUM" &&
          column.attributes!.premiumMinTemplateIndex !== undefined
        ) {
          min = parseInt(column.attributes!.premiumMinTemplateIndex, 10)
          max = parseInt(column.attributes!.premiumMaxTemplateIndex, 10)
        } else {
          min = parseInt(column.attributes!.minTemplateIndex, 10)
          max = parseInt(column.attributes!.maxTemplateIndex, 10)
        }
        const columns: gapi.client.analytics.Column[] = []
        for (let i = min; i <= max; i++) {
          columns.push({
            ...column,
            id: column.id!.replace("XX", i.toString()),
            attributes: {
              ...column.attributes,
              uiName: column.attributes!.uiName.replace("XX", i.toString()),
            },
          })
        }
        return columns
      }
      return [column]
    })
  }, [metadataAPI, managementAPI, account, property, view])

  const columnsRequest = useCached(
    // Even though account is sometimes undefined it doesn't really matter
    // since this hook will re-run once it is. makeRequest is smartEnough to
    // not do anything when account property or view are undefined.
    `//ua-dims-mets/${account?.id}-${property?.id}-${view?.id}` as StorageKey,
    makeRequest,
    moment.duration(5, "minutes"),
    requestReady
  )

  return useMemo(() => {
    switch (columnsRequest.status) {
      case RequestStatus.Successful: {
        const columns = columnsRequest.value || []
        return {
          status: columnsRequest.status,
          columns,
          dimensions: columns.filter(c => c.attributes?.type === "DIMENSION"),
          metrics: columns.filter(c => c.attributes?.type === "METRIC"),
        }
      }
      default:
        return { status: columnsRequest.status }
    }
  }, [columnsRequest])
}

export default useUADimensionsAndMetrics
