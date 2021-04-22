import * as React from "react"
import { Typography, makeStyles } from "@material-ui/core"
import GA4PropertySelector from "../../../../components/GA4PropertySelector"
import { StorageKey, Url } from "../../../../constants"
import LinkedTextField from "../../../../components/LinkedTextField"
import { PAB } from "../../../../components/Buttons"
import DateRanges from "../_DateRanges"
import PrettyJson from "../../../../components/PrettyJson"
import {
  DimensionsPicker,
  MetricsPicker,
} from "../../../../components/GA4Pickers"
import useInputs from "./_useInputs"
import useMakeRequest from "./_useMakeRequest"
import Response from "../_Response"
import LabeledCheckbox from "../../../../components/LabeledCheckbox"
import DimensionFilter from "../_DimensionFilter/_index"

const useStyles = makeStyles(theme => ({
  dateRanges: {
    marginTop: theme.spacing(-1),
  },
}))

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

const metricsLink = <a href={Url.ga4RequestComposerBasicMetrics}>metrics</a>

const BasicReport = () => {
  const classes = useStyles()
  const {
    setSelectedProperty,
    setInputPropertyString,
    inputPropertyString,
    propertyString,
    dateRanges,
    setDateRanges,
    dimensions,
    setDimensions,
    metrics,
    setMetrics,
    showRequestJSON,
    setShowRequestJSON,
    dimensionFilter,
    setDimensionFilter,
  } = useInputs()
  const {
    validRequest,
    makeRequest,
    request,
    response,
    requestStatus,
  } = useMakeRequest({
    property: propertyString,
    dimensionFilter,
    dateRanges,
    dimensions,
    metrics,
  })

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
      <br />
      <LinkedTextField
        value={inputPropertyString || ""}
        onChange={setInputPropertyString}
        href="https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.PATH_PARAMETERS.property"
        linkTitle="See property on devsite."
        label="Property"
        helperText="The property to use for the request."
      />
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
      <MetricsPicker
        storageKey={StorageKey.ga4RequestComposerBasicSelectedMetrics}
        property={propertyString}
        setMetrics={setMetrics}
        helperText={
          <>
            The metrics to include in the request. See {metricsLink} on devsite.
          </>
        }
      />
      <DateRanges className={classes.dateRanges} onChange={setDateRanges} />
      <DimensionFilter
        dimensions={dimensions}
        setDimensionFilter={setDimensionFilter}
      />
      <div>
        <LabeledCheckbox
          checked={showRequestJSON}
          setChecked={setShowRequestJSON}
        >
          Show request JSON
        </LabeledCheckbox>
      </div>
      {showRequestJSON && (
        <PrettyJson object={request} shouldCollapse={shouldCollapseRequest} />
      )}
      <PAB onClick={makeRequest} disabled={!validRequest}>
        Make Request
      </PAB>
      <Response
        response={response}
        requestStatus={requestStatus}
        shouldCollapse={shouldCollapseRequest}
      />
    </>
  )
}

export default BasicReport
