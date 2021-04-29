import { GAVersion } from "../../constants"

interface Heading {
  type: "heading"
  text: string
  versions: GAVersion[]
}

interface LinkT {
  type: "link"
  versions: GAVersion[]
  text: string
  href: string
}

interface ToggleT {
  type: "ga4toggle"
  versions: GAVersion[]
}
export type LinkData = LinkT | Heading | ToggleT

// TODO - Add an enum for the slugs so they aren't magic strings.
export const linkData: LinkData[] = [
  {
    text: "Demos & Tools",
    type: "heading",
    versions: [GAVersion.GoogleAnalytics4, GAVersion.UniversalAnalytics],
  },
  {
    type: "ga4toggle",
    versions: [GAVersion.GoogleAnalytics4, GAVersion.UniversalAnalytics],
  },
  {
    text: "Account Explorer",
    href: "/account-explorer/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Campaign URL Builder",
    href: "/campaign-url-builder/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Campaign URL Builder",
    href: "/ga4/campaign-url-builder/",
    type: "link",
    versions: [GAVersion.GoogleAnalytics4],
  },
  {
    text: "Dimensions & Metrics Explorer",
    href: "/dimensions-metrics-explorer/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Enhanced Ecommerce",
    href: "/enhanced-ecommerce/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Hit Builder",
    href: "/hit-builder/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Event Builder",
    href: "/ga4/event-builder/",
    type: "link",
    versions: [GAVersion.GoogleAnalytics4],
  },
  {
    text: "Dimensions & Metrics Explorer",
    href: "/ga4/dimensions-metrics-explorer/",
    type: "link",
    versions: [GAVersion.GoogleAnalytics4],
  },
  {
    text: "Query Explorer",
    href: "/ga4/query-explorer/",
    type: "link",
    versions: [GAVersion.GoogleAnalytics4],
  },
  {
    text: "Query Explorer",
    href: "/query-explorer/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Request Composer",
    href: "/request-composer/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Spreadsheet Add-on",
    href: "/spreadsheet-add-on/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Tag Assistant",
    href: "/tag-assistant/",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Resources",
    type: "heading",
    versions: [GAVersion.UniversalAnalytics, GAVersion.GoogleAnalytics4],
  },
  {
    text: "About this Site",
    href: "/#about",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "Help & feedback",
    href: "/#help",
    type: "link",
    versions: [GAVersion.UniversalAnalytics],
  },
  {
    text: "About this Site",
    href: "/ga4/#about",
    type: "link",
    versions: [GAVersion.GoogleAnalytics4],
  },
  {
    text: "Help & feedback",
    href: "/ga4/#help",
    type: "link",
    versions: [GAVersion.GoogleAnalytics4],
  },
]
