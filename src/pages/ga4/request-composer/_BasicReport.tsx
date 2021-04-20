import * as React from "react"
import { Typography } from "@material-ui/core"
import GA4PropertySelector, {
  SelectableProperty,
} from "../../../components/GA4PropertySelector"
import { StorageKey, Url } from "../../../constants"
import { usePersistentString, usePersistantObject } from "../../../hooks"
import LinkedTextField from "../../../components/LinkedTextField"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { PAB } from "../../../components/Buttons"
import DateRanges, { DateRange } from "./_DateRanges"
import PrettyJson from "../../../components/PrettyJson"
import { DimensionsPicker, GA4Dimensions } from "../../../components/GA4Pickers"

const useInputs = () => {
  const [selectedProperty, setSelectedProperty] = useState<SelectableProperty>()
  const [dateRanges, setDateRanges] = useState<DateRange[]>([])
  const [dimensions, setDimensions] = useState<GA4Dimensions>()

  const [propertyString, setPropertyStringLocal] = usePersistentString(
    StorageKey.ga4RequestComposerBasicSelectedPropertyString
  )

  const setPropertyString = useCallback(
    (e: string) => {
      setPropertyStringLocal(e)
    },
    [setPropertyStringLocal]
  )

  useEffect(() => {
    if (selectedProperty !== undefined) {
      setPropertyStringLocal(selectedProperty.property)
    }
  }, [selectedProperty, setPropertyStringLocal])

  return {
    selectedProperty,
    setSelectedProperty,
    propertyString,
    setPropertyString,
    dateRanges,
    setDateRanges,
    dimensions,
    setDimensions,
  }
}

enum RequestStatus {
  NotStarted,
  Pending,
  Complete,
}

type RunReportRequest = gapi.client.analyticsdata.RunReportRequest
type RunReportResponse = gapi.client.analyticsdata.RunReportResponse

type UseMakeRequestArgs = {
  property: string
  dateRanges: DateRange[]
  dimensions: GA4Dimensions
}
type UseMakeRequest = (
  args: UseMakeRequestArgs
) => {
  makeRequest: () => void
  validRequest: boolean
  request: RunReportRequest | undefined
} & (
  | {
      requestStatus: RequestStatus.Complete
      response: RunReportResponse
    }
  | {
      requestStatus: RequestStatus.NotStarted | RequestStatus.Pending
      response: undefined
    }
)
const useMakeRequest: UseMakeRequest = ({
  property,
  dateRanges,
  dimensions,
}) => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const dataAPI = useMemo(() => gapi?.client.analyticsdata, [gapi])
  const [requestStatus, setRequestStatus] = useState(RequestStatus.NotStarted)
  const [response, setResponse] = usePersistantObject<object>(
    StorageKey.ga4RequestComposerBasicResponse
  )

  const request = useMemo<RunReportRequest | undefined>(() => {
    if (dimensions === undefined) {
      return undefined
    }
    const r: RunReportRequest = {
      dimensions: dimensions.map(dimension => ({
        name: dimension.apiName!,
      })),
      dateRanges: dateRanges.map(({ from, to }) => ({
        startDate: from,
        endDate: to,
      })),
    }
    return r
  }, [dateRanges, dimensions])

  const validRequest = useMemo(() => {
    return true
  }, [])

  const makeRequest = useCallback(() => {
    if (dataAPI === undefined || request === undefined) {
      return
    }
    if (response === undefined) {
      setRequestStatus(RequestStatus.Pending)
    }
    dataAPI.properties
      .runReport({ property, resource: request })
      .then(response => {
        const result = response.result
        setResponse(result)
      })
  }, [property, dataAPI, response, request, setResponse])

  return {
    requestStatus,
    makeRequest,
    response,
    validRequest,
    request,
  } as ReturnType<UseMakeRequest>
}

const shouldCollapseRequest = ({ namespace }: any) => {
  // The number 4 refers to the number of levels to show by default, this value
  // was gotten to mostly by trial an error, but concretely it's the number of
  // unique "keys" in "object" that we want to show by default.
  // {
  //   // "reportRequests" is namespace.length === 1
  //   "reportRequests": [
  //     // "0" is namespace.length === 2
  //   {
  //     // "viewId" is namespace.length === 3
  //     "viewId": "viewIdString",
  //     // "dateRanges" is namespace.length === 3
  //     "dateRanges": [...]
  //   }]
  // }
  if (namespace.length < 4) {
    return false
  }
  return true
}

const dimensionsLink = (
  <a href={Url.ga4RequestComposerBasicDimensions}>dimensions</a>
)

const BasicReport = () => {
  const {
    setSelectedProperty,
    setPropertyString,
    propertyString,
    dateRanges,
    setDateRanges,
    dimensions,
    setDimensions,
  } = useInputs()
  const { validRequest, makeRequest, request, response } = useMakeRequest({
    property: propertyString || "",
    dateRanges,
    dimensions,
  })

  console.log({ response })

  return (
    <>
      <Typography>
        Returns a customized report of your Google Analytics event data. Reports
        contain statistics derived from data collected by the Google Analytics
        tracking code.
      </Typography>
      <GA4PropertySelector
        accountSummariesKey={StorageKey.ga4RequestComposerBasicAccountSummaries}
        selectedAccountKey={StorageKey.ga4RequestComposerBasicSelectedAccount}
        selectedPropertyKey={StorageKey.ga4RequestComposerBasicSelectedProperty}
        setSelectedProperty={setSelectedProperty}
      />
      <LinkedTextField
        value={propertyString || ""}
        onChange={setPropertyString}
        href="https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.PATH_PARAMETERS.property"
        linkTitle="See property on devsite."
        label="Property"
        helperText="The property to use for the request."
      />
      <DateRanges onChange={setDateRanges} />
      <DimensionsPicker
        required
        storageKey={StorageKey.ga4RequestComposerBasicSelectedDimensions}
        property={propertyString}
        setDimensions={setDimensions}
        helperText={
          <>
            The dimensions to include in the request. See {dimensionsLink} on
            devsite.
          </>
        }
      />
      <PrettyJson object={request} shouldCollapse={shouldCollapseRequest} />
      <PAB onClick={makeRequest} disabled={!validRequest}>
        Make Request
      </PAB>
    </>
  )
}

export default BasicReport
