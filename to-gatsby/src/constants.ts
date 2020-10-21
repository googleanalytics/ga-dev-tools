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

// All static links on the site should be put into this constant. This makes it
// easier to update all instances of a link on the site.
export const Url = {
  iosCampaignTracking:
    "https://developers.google.com/analytics/devguides/collection/ios/v3/campaigns#url-builder",
  googlePlayURLBuilder:
    "https://developers.google.com/analytics/devguides/collection/android/v4/campaigns#google-play-url-builder",
  customCampaigns: "https://support.google.com/analytics/answer/1033863",
  gaDebugger:
    "https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna",
  analyticsJSDevsite:
    "https://developers.google.com/analytics/devguides/collection/analyticsjs/",
  analyticsJSEnhancedEcommerce:
    "https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce",
  googleTagManagerEnhancedEcommerce:
    "https://developers.google.com/tag-manager/enhanced-ecommerce",
  enhancedEcommerceHelpCenter:
    "https://support.google.com/analytics/answer/6014841",
  enhancedEcommerceDemo: "https://enhancedecommerce.appspot.com/",
  gaDevToolsGitHub: "https://github.com/googleanalytics/ga-dev-tools",
  gaDevToolsGitHubNewIssue:
    "https://github.com/googleanalytics/ga-dev-tools/issues/new",
  gaDevsite: "http://developers.google.com/analytics",
  gaDevsiteHelp: "http://developers.google.com/analytics/help/",
  reportingApis: "https://developers.google.com/analytics/devguides/reporting/",
  spreadsheetAddOn:
    "https://developers.google.com/analytics/solutions/google-analytics-spreadsheet-add-on",
  spreadsheetAddOnExternal:
    "https://gsuite.google.com/marketplace/app/google_analytics/477988381226",
  tagAssistantExternal:
    "https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk",
  crossDomainTracking:
    "https://developers.google.com/analytics/devguides/collection/analyticsjs/cross-domain",
  protocolParameters:
    "https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters",
  commonHits:
    "https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#commonhits",
  crossDomainLinker:
    "https://developers.google.com/analytics/devguides/collection/analyticsjs/linker",
  aboutTagAssistant: "https://support.google.com/tagassistant/answer/2947093",
  aboutTagAssistantRecordings:
    "https://support.google.com/analytics/answer/6277302",
  measurementProtocol:
    "https://developers.google.com/analytics/devguides/collection/protocol/v1",
  validatingMeasurement:
    "https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits",
}

// All data in localStorage should have its keys here.
export const StorageKey = {
  campaignBuilderWebsiteUrl: "campaign-builder/website-url",
  campaignBuilderSource: "campaign-builder/source",
  campaignBuilderMedium: "campaign-builder/medium",
  campaignBuilderName: "campaign-builder/name",
  campaignBuilderTerm: "campaign-builder/term",
  campaignBuilderContent: "campaign-builder/content",
  campaignBuilderUseFragment: "campaign-builder/use-fragment",
  bitlyAccessToken: "bitly-auth/access-token",
  bitlyCache: "bitly-auth/cache-storage",
}

export const EventAction = {
  bitlyShorten: "bitly_shorten",
  bitlyAuth: "bitly_auth",
}

export const EventCategory = {
  campaignUrlBuilder: "Campaign URL Builder",
}
