// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// All static links on the site should be put into this enum. This makes it
// easier to update all instances of a link on the site.
export enum Url {
  termsOfService = "https://policies.google.com/terms",
  privacyPolicy = "https://policies.google.com/privacy",
  ga4MeasurementProtocol = "https://developers.google.com/analytics/devguides/collection/protocol/ga4",
  ga4DataAPIGetMetadata = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/getMetadata",
  cohortsRangeStartOffset = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/CohortSpec#CohortsRange.FIELDS.start_offset",
  cohortsRangeEndOffset = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/CohortSpec#CohortsRange.FIELDS.end_offset",
  ga4RequestComposerBasicRunReport = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport",
  ga4RequestComposerBasicRunReportLimit = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.limit",
  ga4RequestComposerBasicRunReportDimensionFilter = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.dimension_filter",
  ga4RequestComposerBasicRunReportMetricFilter = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.metric_filter",
  ga4RequestComposerBasicRunReportOffset = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.offset",
  ga4RequestComposerBasicMetrics = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.metrics",
  ga4RequestComposerBasicKeepEmptyRows = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.keep_empty_rows",
  ga4RequestComposerBasicDimensions = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.dimensions",
  ga4RequestComposerBasicProperty = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.PATH_PARAMETERS.property",
  ga4RequestComposerBasicCurrencyCode = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.currency_code",
  ga4RequestComposerBasicCohortSpec = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.cohort_spec",
  ga4RequestComposerBasicMetricAggregations = "https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.metric_aggregations",
  iso4217Wiki = "https://en.wikipedia.org/wiki/ISO_4217",
  ga4DataAPI = "https://developers.google.com/analytics/devguides/reporting/data/v1",
  ga4AdminAPI = "https://developers.google.com/analytics/devguides/config/admin/v1",
  aboutCampaign = "https://support.google.com/analytics/answer/1033863?",
  aboutCustomCampaigns = "https://support.google.com/analytics/answer/1033863",
  bestPracticesForCreatingCustomCampaigns = "https://support.google.com/analytics/answer/1037445",
  aboutReferralTrafficReport = "https://support.google.com/analytics/topic/3125765?",
  aboutTrafficSourceDimensions = "https://support.google.com/analytics/answer/1033173",
  googleAdsAutoTagging = "https://support.google.com/google-ads/answer/1752125",
  iosCampaignMeasurement = "https://developers.google.com/analytics/devguides/collection/ios/v3/campaigns#url-builder",
  googlePlayURLBuilder = "https://developers.google.com/analytics/devguides/collection/android/v4/campaigns#google-play-url-builder",
  gaDebugger = "https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna",
  analyticsJSDevsite = "https://developers.google.com/analytics/devguides/collection/analyticsjs/",
  analyticsJSEnhancedEcommerce = "https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce",
  googleTagManagerEnhancedEcommerce = "https://developers.google.com/tag-manager/enhanced-ecommerce",
  enhancedEcommerceHelpCenter = "https://support.google.com/analytics/answer/6014841",
  enhancedEcommerceDemo = "https://enhancedecommerce.appspot.com/",
  gaDevToolsGitHub = "https://github.com/googleanalytics/ga-dev-tools",
  gaDevToolsGitHubNewIssue = "https://github.com/googleanalytics/ga-dev-tools/issues/new?assignees=&labels=&template=bug_report.md&title=",
  gaDevToolsGitHubNewFeatureRequest = "https://github.com/googleanalytics/ga-dev-tools/issues/new?assignees=&labels=&template=feature_request.md&title=",
  gaDevsite = "http://developers.google.com/analytics",
  gaDevsiteHelp = "http://developers.google.com/analytics/help/",
  reportingApis = "https://developers.google.com/analytics/devguides/reporting/",
  spreadsheetAddOn = "https://developers.google.com/analytics/solutions/google-analytics-spreadsheet-add-on",
  spreadsheetAddOnExternal = "https://gsuite.google.com/marketplace/app/google_analytics/477988381226",
  tagAssistantExternal = "https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk",
  crossDomainMeasurement = "https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain",
  protocolParameters = "https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters",
  commonHits = "https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#commonhits",
  crossDomainLinker = "https://developers.google.com/analytics/devguides/collection/analyticsjs/linker",
  aboutTagAssistant = "https://support.google.com/tagassistant/answer/2947093",
  aboutTagAssistantRecordings = "https://support.google.com/analytics/answer/6277302",
  measurementProtocol = "https://developers.google.com/analytics/devguides/collection/protocol/v1",
  validatingMeasurement = "https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits",
  coreReportingApi = "https://developers.google.com/analytics/devguides/reporting/core/v3/",
}

export enum GAVersion {
  UniversalAnalytics = "ua",
  GoogleAnalytics4 = "ga4",
}

// All data in localStorage should have its keys here.
export enum StorageKey {
  gaVersion = "/ga-version",
  uaColumns = "//ua-columns",
  uaAccounts = "//ua-accounts",
  uaCustomMetrics = "//ua-custom-metrics",
  uaCustomDimensions = "//ua-custom-dimensions",
  uaSegments = "//ua-segments-2",
  viewSelectorData = "//view-selector/data",

  // Acount Explorer
  accountExplorerAPV = "/account-explorer/apv",

  // GA4 Dimensions and metrics explorer
  ga4DimensionsMetricsSearch = "/ga4/dimensions-metrics-explorer/search",
  ga4DimensionsMetricsFields = "/ga4/dimensions-metrics-explorer/fields",
  ga4DimensionsMetricsAccountSummaries = "/ga4/dimensions-metrics-explorer/account-summaries",
  ga4DimensionsMetricsSelectedAccount = "/ga4/dimensions-metrics-explorer/selected-account",
  ga4DimensionsMetricsSelectedProperty = "/ga4/dimensions-metrics-explorer/selected-property",

  // GA4 Request Composer
  ga4RequestComposerTab = "/ga4/request-composer/tab",
  ga4RequestComposerBasicAccountSummaries = "/ga4/request-composer/basic-report/account-summaries",
  ga4RequestComposerBasicSelectedAccount = "/ga4/request-composer/basic-report/selected-account",
  ga4RequestComposerBasicSelectedProperty = "/ga4/request-composer/basic-report/selected-property",
  ga4RequestComposerBasicSelectedPropertyString = "/ga4/request-composer/basic-report/selected-property-string",
  ga4RequestComposerBasicResponse = "/ga4/request-composer/basic-report/response",
  ga4RequestComposerBasicSelectedDimensions = "/ga4/request-composer/basic-report/selected-dimensions",
  ga4RequestComposerBasicSelectedMetrics = "/ga4/request-composer/basic-report/selected-metrics",
  ga4RequestComposerBasicShowRequestJSON = "/ga4/request-composer/basic-report/show-request-json",
  ga4RequestComposerBasicCohortSpec = "/ga4/request-composer/basic-report/cohort-spec",
  ga4RequestComposerBasicKeepEmptyRows = "/ga4/request-composer/basic-report/keep-empty-rows",
  ga4RequestComposerBasicDimensionFilter = "/ga4/request-composer/basic-report/dimension-filter",
  ga4RequestComposerBasicMetricFilter = "/ga4/request-composer/basic-report/metric-filter",
  ga4RequestComposerBasicSelectedOffset = "/ga4/request-composer/basic-report/offset",
  ga4RequestComposerBasicSelectedLimit = "/ga4/request-composer/basic-report/limit",
  ga4RequestComposerBasicDateRanges = "/ga4/request-composer/basic-report/date-ranges",
  ga4RequestComposerBasicOrderBys = "/ga4/request-composer/basic-report/order-bys",
  ga4RequestComposerBasicMetricAggregations = "/ga4/request-composer/basic-report/metric-aggregations",
  ga4RequestComposerBasicSelectedCurrencyCode = "/ga4/request-composer/basic-report/currency-code",
  ga4RequestComposerBasicShowAdvanced = "/ga4/request-composer/basic-report/show-advanced",

  // Query Explorer
  queryExplorerAPV = "query-explorer/apv",
  queryExplorerAccount = "query-explorer/account",
  queryExplorerProperty = "query-explorer/property",
  queryExplorerView = "query-explorer/view",
  queryExplorerViewID = "query-explorer/view-id",
  queryExplorerDimensions = "query-explorer/dimensions",
  queryExplorerSelectedDimensions = "query-explorer/selected-dimensions-2",
  queryExplorerMetrics = "query-explorer/metrics",
  queryExplorerSelectedMetrics = "query-explorer/selected-metrics-2",
  queryExplorerSegment = "query-explorer/segment-2",
  queryExplorerSamplingLevel = "query-explorer/sampling-level",
  queryExplorerShowSegmentDefinition = "query-explorer/show-segment-definition",
  queryExplorerStartDate = "query-explorer/start-date",
  queryExplorerEndDate = "query-explorer/end-date",
  queryExplorerStartIndex = "query-explorer/start-index",
  queryExplorerMaxResults = "query-explorer/max-results",
  queryExplorerFilters = "query-explorer/filters",
  queryExplorerIncludeEmptyRows = "query-explorer/include-empty-rows",
  queryExplorerSort = "query-explorer/sort-2",

  // Dimensions and metrics explorer
  dimensionsMetricsExplorerColumns = "dimensions-metrics-explorer/columns",
  dimensionsMetricsExplorerSearch = "dimensions-metrics-explorer/search",
  dimensionsMetricsExplorerAllowDeprecated = "dimensions-metrics-explorer/allow-deprecated",
  dimensionsMetricsExplorerOnlySegments = "dimensions-metrics-explorer/only-segments",

  // Web Campaign Builder
  campaignBuilderWebsiteURL = "campaign-builder/website-url",
  campaignBuilderSource = "campaign-builder/source",
  campaignBuilderMedium = "campaign-builder/medium",
  campaignBuilderName = "campaign-builder/name",
  campaignBuilderID = "campaign-builder/id",
  campaignBuilderTerm = "campaign-builder/term",
  campaignBuilderContent = "campaign-builder/content",
  campaignBuilderUseFragment = "campaign-builder/use-fragment",
  bitlyAccessToken = "bitly-auth/access-token",
  bitlyCache = "bitly-auth/cache-storage",

  // UA Request Composer
  requestComposerAPV = "request-composer/apv",
  requestComposerHistogramDimensions = "request-composer/histogram/dimensions",
  requestComposerHistogramMetrics = "request-composer/histogram/metrics",
  requestComposerHistogramSegment = "request-composer/histogram/segment",
  histogramBuckets = "request-composer/histogram-buckets",
  histogramStartDate = "request-composer/histogram-start-date",
  histogramEndDate = "request-composer/histogram-end-date",
  histogramFiltersExpression = "request-composer/histogram-filters-expression",
  histogramSamplingLevel = "request-composer/histogram-sampling-level",
  histogramRequestShowSegmentDefinition = "request-composer/histogram-request-show-segment-definition",
  requestComposerPivotMetrics = "request-composer/pivot/metrics",
  requestComposerPivotPivotMetrics = "request-composer/pivot/pivot-metrics",
  requestComposerPivotDimensions = "request-composer/pivot/dimensions",
  requestComposerPivotPivotDimensions = "request-composer/pivot/pivot-dimensions",
  requestComposerPivotSegment = "request-composer/pivot-request-segment",
  pivotSamplingLevel = "request-composer/pivot-sampling-level",
  pivotRequestStartDate = "request-composer/pivot-request-start-date",
  pivotRequestEndDate = "request-composer/pivot-request-end-date",
  pivotRequestStartGroup = "request-composer/pivot-request-start-group",
  pivotRequestMaxGroupCount = "request-composer/pivot-request-max-group-count",
  pivotRequestPageToken = "request-composer/pivot-request-page-token",
  pivotRequestPageSize = "request-composer/pivot-request-page-size",
  pivotRequestIncludeEmptyRows = "request-composer/pivot-request-include-empty-rows",
  pivotRequestShowSegmentDefinition = "request-composer/pivot-request-show-segment-definition",
  cohortRequestSamplingLevel = "request-composer/cohort-request-sampling-level",
  requestComposerCohortMetric = "request-composer/cohort/metric",
  requestComposerCohortSegment = "request-composer/cohort/segment",
  cohortRequestCohortSize = "request-composer/cohort-request-cohort-size",
  cohortRequestShowSegmentDefinition = "request-composer/cohort-request-show-segment-definition",
  requestComposerMetricExpressionDimensions = "request-composer/metric-expression/dimensions",
  requestComposerMetricExpressionSegment = "request-composer/metric-expression/segment",
  metricExpressionSamplingLevel = "request-composer/metric-expression-sampling-level",
  metricExpressionStartDate = "request-composer/metric-expression-start-date",
  metricExpressionEndDate = "request-composer/metric-expression-end-date",
  metricExpressionMetricExpressions = "request-composer/metric-expression-metric-expressions",
  metricExpressionMetricAliases = "request-composer/metric-expression-metric-aliases",
  metricExpressionFiltersExpression = "request-composer/metric-expression-filters-expression",
  metricExpressionPageToken = "request-composer/metric-expression-page-token",
  metricExpressionPageSize = "request-composer/metric-expression-page-size",
  metricExpressionRequestShowSegmentDefinition = "request-composer/metric-expression-show-segment-definition",

  // Play Campaign URL Builder
  campaignBuilderPlayAppID = "campaign-builder/play/app-id",
  campaignBuilderPlaySource = "campaign-builder/play/source",
  campaignBuilderPlayMedium = "campaign-builder/play/medium",
  campaignBuilderPlayTerm = "campaign-builder/play/term",
  campaignBuilderPlayContent = "campaign-builder/play/content",
  campaignBuilderPlayName = "campaign-builder/play/name",

  // IOS Campaign URL Builder
  campaignBuilderIOSAPV = "campaign-builder/ios/apv",
  campaignBuilderIOSAppID = "campaign-builder/ios/app-id",
  campaignBuilderIOSSource = "campaign-builder/ios/source",
  campaignBuilderIOSMedium = "campaign-builder/ios/medium",
  campaignBuilderIOSTerm = "campaign-builder/ios/term",
  campaignBuilderIOSContent = "campaign-builder/ios/content",
  campaignBuilderIOSName = "campaign-builder/ios/name",
  campaignBuilderIOSPropertyIDUA = "campaign-builder/ios/property-id-ua",
  campaignBuilderIOSPropertyIDGA4 = "campaign-builder/ios/property-id-ga4",
  campaignBuilderIOSRedirectURL = "campaign-builder/ios/redirect-url",
  campaignBuilderIOSDeviceID = "campaign-builder/ios/device-id",
  campaignBuilderIOSCustomFields = "campaign-builder/ios/custom-fields",
  campaignBuilderIOSAdNetwork = "campaign-builder/ios/ad-network",
  campaignBuilderIOSMethod = "campaign-builder/ios/method",
  campaignBuilderIOSGA4Account = "campaign-builder/ios/ga4-account",
  campaignBuilderIOSGA4Property = "campaign-builder/ios/ga4-property",

  // GA4 Event Builder
  eventBuilderCategory = "ga4/event-builder/event-category",
  eventBuilderApiSecret = "ga4/event-builder/api-secret",
  eventBuilderFirebaseAppId = "ga4/event-builder/firebase-app-id",
  eventBuilderMeasurementId = "ga4/event-builder/measurement-id",
  eventBuilderAppInstanceId = "ga4/event-builder/app-instance-id",
  eventBuilderClientId = "ga4/event-builder/client-id",
  eventBuilderUserId = "ga4/event-builder/user-id",
  eventBuilderTimestampMicros = "ga4/event-builder/timestamp-micros",
  eventBuilderNonPersonalizedAds = "ga4/event-builder/non-personalized-ads",
  eventBuilderUseFirebase = "ga4/event-builder/use-firebase",
  ga4EventBuilderEvents = "ga4/event-builder/events",
  ga4EventBuilderLastEventType = "ga4/event-builder/last-event-type",
  ga4EventBuilderParameters = "ga4/event-builder/parameters",
  ga4EventBuilderItems = "ga4/event-builder/items",
  ga4EventBuilderEventName = "ga4/event-builder/event-name",
  ga4EventBuilderUserProperties = "ga4/event-builder/user-properties",
}

export const EventAction = {
  bitlyShorten: "bitly_shorten",
  bitlyAuth: "bitly_auth",
}

export const EventCategory = {
  campaignUrlBuilder: "Campaign URL Builder",
}
