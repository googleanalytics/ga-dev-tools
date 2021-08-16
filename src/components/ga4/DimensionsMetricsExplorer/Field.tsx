import * as React from "react"

import IconLink from "@material-ui/icons/Link"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Typography from "@material-ui/core/Typography"
import { Link } from "gatsby"

import InlineCode from "@/components/InlineCode"
import { CopyIconButton } from "@/components/CopyButton"
import ExternalLink from "@/components/ExternalLink"
import { Dimension, Metric } from "./useDimensionsAndMetrics"
import { QueryParam } from "."
import { AccountSummary, PropertySummary } from "@/types/ga4/StreamPicker"

const knownLinks: [string, JSX.Element][] = [
  [
    "<https://support.google.com/analytics/answer/9267568>",
    <ExternalLink href="https://support.google.com/analytics/answer/9267568">
      Set up and manage conversion events
    </ExternalLink>,
  ],
  [
    "<https://support.google.com/google-ads/answer/6323>",
    <ExternalLink href="https://support.google.com/google-ads/answer/6323">
      Keywords: Definition
    </ExternalLink>,
  ],
  [
    "<https://support.google.com/analytics/answer/9213390>",
    <ExternalLink href="https://support.google.com/analytics/answer/9213390">
      User-ID for cross-platform analysis
    </ExternalLink>,
  ],
  [
    "<https://support.google.com/analytics/answer/10108813>",
    <ExternalLink href="https://support.google.com/analytics/answer/10108813">
      Data filters
    </ExternalLink>,
  ],
]

const linkifyText = (
  remainingString: string,
  elements: (JSX.Element | string)[]
): [string, (JSX.Element | string)[]] => {
  const firstMatch = knownLinks.reduce(
    (acc, [inText], idx) => {
      const { matchIndex } = acc
      const currentMatchIndex = remainingString.indexOf(inText)
      if (currentMatchIndex !== -1) {
        if (currentMatchIndex < matchIndex || matchIndex === -1) {
          return {
            matchIndex: currentMatchIndex,
            knownLinksIndex: idx,
          }
        }
      }
      return acc
    },
    { knownLinksIndex: -1, matchIndex: -1 }
  )
  if (firstMatch.matchIndex === -1) {
    elements.push(remainingString)
    return ["", elements]
  } else {
    const [inText, link] = knownLinks[firstMatch.knownLinksIndex]
    const before = remainingString.substring(0, firstMatch.matchIndex)
    const after = remainingString.substring(
      firstMatch.matchIndex + inText.length
    )
    elements.push(before)
    elements.push(link)
    return [after, elements]
  }
}

const useStyles = makeStyles(theme => ({
  heading: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    "&> button": {
      display: "none",
    },
    "&:hover": {
      "&> button": {
        display: "unset",
        padding: "unset",
      },
    },
  },
  apiName: {
    margin: theme.spacing(0, 1),
    fontSize: "0.75em",
  },
}))

interface FieldProps {
  field:
    | { type: "dimension"; value: Dimension }
    | { type: "metric"; value: Metric }
  account: AccountSummary | undefined
  property: PropertySummary | undefined
}
const Field: React.FC<FieldProps> = ({ field, account, property }) => {
  const apiName = field.value.apiName || ""
  const uiName = field.value.uiName || ""
  const description = field.value.description || ""

  const link = React.useMemo(() => {
    let baseURL = `${window.location.origin}${window.location.pathname}`
    let search = ``
    if (!field.value.customDefinition && account && property) {
      let urlParams = new URLSearchParams()
      urlParams.append(QueryParam.Account, account.name!)
      urlParams.append(QueryParam.Property, property.property!)
      search = `?${urlParams.toString()}`
    }
    return `${baseURL}${search}#${apiName}`
  }, [field, apiName, account, property])

  const classes = useStyles()

  const withLinks = React.useMemo(() => {
    let remainingText = description
    let elements: (JSX.Element | string)[] = []
    let mightHaveLinks = true
    while (mightHaveLinks) {
      const result = linkifyText(remainingText, elements)
      remainingText = result[0]
      elements = result[1]
      if (remainingText === "") {
        mightHaveLinks = false
      }
    }
    return (
      <>
        {elements.map((e, idx) => (
          <React.Fragment key={idx}>{e}</React.Fragment>
        ))}
      </>
    )
  }, [description])

  return (
    <div id={apiName} key={apiName}>
      <Typography variant="h3" className={classes.heading}>
        <Link to={`#${apiName}`}>{uiName}</Link>
        <InlineCode className={classes.apiName}>{apiName}</InlineCode>
        <CopyIconButton
          icon={<IconLink color="primary" />}
          toCopy={link}
          tooltipText={`Copy link to ${apiName}`}
        />
      </Typography>
      <Typography>{withLinks}</Typography>
    </div>
  )
}

export default Field
