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
import Filter, { FilterType } from "../_Filter/_index"
import { RequestStatus } from "../../../../types"
import OrderBys from "../_OrderBys"
import ExternalLink from "../../../../components/ExternalLink"

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
  <ExternalLink href={Url.ga4RequestComposerBasicDimensions}>
    dimensions
  </ExternalLink>
)

const iso4217 = <ExternalLink href={Url.iso4217Wiki}>ISO 4217</ExternalLink>

const metricsLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicMetrics}>metrics</ExternalLink>
)

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
    metricFilter,
    setMetricFilter,
    offset,
    setOffset,
    limit,
    setLimit,
    orderBys,
    setOrderBys,
    currencyCode,
    setCurrencyCode,
  } = useInputs()
  const useMake = useMakeRequest({
    property: propertyString,
    dimensionFilter,
    offset,
    limit,
    metricFilter,
    dateRanges,
    dimensions,
    metrics,
    orderBys,
    currencyCode,
  })
  const {
    validRequest,
    makeRequest,
    request,
    response,
    requestStatus,
  } = useMake

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
        href={Url.ga4RequestComposerBasicProperty}
        linkTitle="See property on devsite."
        label="property"
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
      <DateRanges
        className={classes.dateRanges}
        setDateRanges={setDateRanges}
        dateRanges={dateRanges}
      />
      <Filter
        storageKey={StorageKey.ga4RequestComposerBasicDimensionFilter}
        type={FilterType.Dimension}
        fields={dimensions}
        setFilterExpression={setDimensionFilter}
      />
      <Filter
        storageKey={StorageKey.ga4RequestComposerBasicMetricFilter}
        type={FilterType.Metric}
        fields={metrics}
        setFilterExpression={setMetricFilter}
      />
      <LinkedTextField
        href={Url.runReportOffset}
        linkTitle="See offset on devsite."
        label="offset"
        value={offset}
        helperText="The row count of the start row. The first row is row 0."
        onChange={setOffset}
      />
      <LinkedTextField
        href={Url.runReportLimit}
        linkTitle="See limit on devsite."
        label="limit"
        value={limit}
        helperText="The maximum number of rows to return."
        onChange={setLimit}
      />
      <OrderBys
        metric
        metricOptions={metrics}
        dimension
        dimensionOptions={dimensions}
        orderBys={orderBys}
        setOrderBys={setOrderBys}
      />
      <LinkedTextField
        value={currencyCode || ""}
        onChange={setCurrencyCode}
        href={Url.ga4RequestComposerBasicCurrencyCode}
        linkTitle="See currencyCode on devsite."
        label="currency code"
        helperText={<>The {iso4217} currency code to use for the request.</>}
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
        error={
          useMake.requestStatus === RequestStatus.Failed
            ? useMake.error
            : undefined
        }
        requestStatus={requestStatus}
        shouldCollapse={shouldCollapseRequest}
      />
    </>
  )
}

export default BasicReport
