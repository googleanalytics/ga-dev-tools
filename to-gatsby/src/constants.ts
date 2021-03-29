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
// TODO - Add in a bulid step that makes sure the values in this enum are unique.
export enum Url {
  iosCampaignTracking = "https=//developers.google.com/analytics/devguides/collection/ios/v3/campaigns#url-builder",
  googlePlayURLBuilder = "https=//developers.google.com/analytics/devguides/collection/android/v4/campaigns#google-play-url-builder",
  customCampaigns = "https://support.google.com/analytics/answer/1033863",
  gaDebugger = "https=//chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna",
  analyticsJSDevsite = "https=//developers.google.com/analytics/devguides/collection/analyticsjs/",
  analyticsJSEnhancedEcommerce = "https=//developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce",
  googleTagManagerEnhancedEcommerce = "https=//developers.google.com/tag-manager/enhanced-ecommerce",
  enhancedEcommerceHelpCenter = "https=//support.google.com/analytics/answer/6014841",
  enhancedEcommerceDemo = "https://enhancedecommerce.appspot.com/",
  gaDevToolsGitHub = "https://github.com/googleanalytics/ga-dev-tools",
  gaDevToolsGitHubNewIssue = "https=//github.com/googleanalytics/ga-dev-tools/issues/new",
  gaDevsite = "http://developers.google.com/analytics",
  gaDevsiteHelp = "http://developers.google.com/analytics/help/",
  reportingApis = "https://developers.google.com/analytics/devguides/reporting/",
  spreadsheetAddOn = "https=//developers.google.com/analytics/solutions/google-analytics-spreadsheet-add-on",
  spreadsheetAddOnExternal = "https=//gsuite.google.com/marketplace/app/google_analytics/477988381226",
  tagAssistantExternal = "https=//chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk",
  crossDomainTracking = "https=//developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain",
  protocolParameters = "https=//developers.google.com/analytics/devguides/collection/protocol/v1/parameters",
  commonHits = "https=//developers.google.com/analytics/devguides/collection/protocol/v1/devguide#commonhits",
  crossDomainLinker = "https=//developers.google.com/analytics/devguides/collection/analyticsjs/linker",
  aboutTagAssistant = "https://support.google.com/tagassistant/answer/2947093",
  aboutTagAssistantRecordings = "https=//support.google.com/analytics/answer/6277302",
  measurementProtocol = "https=//developers.google.com/analytics/devguides/collection/protocol/v1",
  validatingMeasurement = "https=//developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits",
  coreReportingApi = "https=//developers.google.com/analytics/devguides/reporting/core/v3/",
}

export enum GAVersion {
  UniversalAnalytics = "ua",
  GoogleAnalytics4 = "ga4",
}

// All data in localStorage should have its keys here.
// TODO - Add in a build step that makes sure the values in this enum are unique.
export enum StorageKey {
  gaVersion = "/ga-version",
  campaignBuilderWebsiteUrl = "campaign-builder/website-url",
  campaignBuilderSource = "campaign-builder/source",
  campaignBuilderMedium = "campaign-builder/medium",
  campaignBuilderName = "campaign-builder/name",
  campaignBuilderTerm = "campaign-builder/term",
  campaignBuilderContent = "campaign-builder/content",
  campaignBuilderUseFragment = "campaign-builder/use-fragment",
  bitlyAccessToken = "bitly-auth/access-token",
  bitlyCache = "bitly-auth/cache-storage",
  requestComposerTab = "request-composer/tab",

  histogramRequestDimension = "request-composer/histogram-request-dimension",
  histogramRequestMetric = "request-composer/histogram-request-metric",
  histogramBuckets = "request-composer/histogram-buckets",
  histogramStartDate = "request-composer/histogram-start-date",
  histogramEndDate = "request-composer/histogram-end-date",
  histogramFiltersExpression = "request-composer/histogram-filters-expression",
  histogramRequestSegment = "request-composer/histogram-request-segment",
  histogramSamplingLevel = "request-composer/histogram-sampling-level",

  cohortSamplingLevel = "request-composer/cohort-sampling-level",
  cohortRequestMetric = "request-composer/cohort-request-metric",
  cohortSize = "request-composer/cohort-size",
  cohortRequestSegment = "request-composer/cohort-request-segment",

  pivotRequestMetrics = "request-composer/pivot-request-metrics",
  pivotRequestPivotMetrics = "request-composer/pivot-request-pivot-metrics",
  pivotRequestSegment = "request-composer/pivot-request-segment",
  pivotSamplingLevel = "request-composer/pivot-sampling-level",
  pivotRequestDimensions = "request-composer/pivot-request-dimensions",
  pivotRequestPivotDimensions = "request-composer/pivot-request-pivot-dimensions",
  pivotRequestStartDate = "request-composer/pivot-request-start-date",
  pivotRequestEndDate = "request-composer/pivot-request-end-date",
  pivotRequestStartGroup = "request-composer/pivot-request-start-group",
  pivotRequestMaxGroupCount = "request-composer/pivot-request-max-group-count",
  pivotRequestPageToken = "request-composer/pivot-request-page-token",
  pivotRequestPageSize = "request-composer/pivot-request-page-size",
  pivotRequestIncludeEmptyRows = "request-composer/pivot-request-include-empty-rows",

  metricExpressionRequestDimensions = "request-composer/metric-expression-request-dimensions",
  metricExpressionRequestSegment = "request-composer/metric-expression-request-segment",
  metricExpressionSamplingLevel = "request-composer/metric-expression-sampling-level",
  metricExpressionStartDate = "request-composer/metric-expression-start-date",
  metricExpressionEndDate = "request-composer/metric-expression-end-date",
  metricExpressionMetricExpressions = "request-composer/metric-expression-metric-expressions",
  metricExpressionMetricAliases = "request-composer/metric-expression-metric-aliases",
  metricExpressionFiltersExpression = "request-composer/metric-expression-filters-expression",
  metricExpressionPageToken = "request-composer/metric-expression-page-token",
  metricExpressionPageSize = "request-composer/metric-expression-page-size",

  eventBuilderCategory = "ga4/event-builder/event-category",
}

export const EventAction = {
  bitlyShorten: "bitly_shorten",
  bitlyAuth: "bitly_auth",
}

export const EventCategory = {
  campaignUrlBuilder: "Campaign URL Builder",
}
