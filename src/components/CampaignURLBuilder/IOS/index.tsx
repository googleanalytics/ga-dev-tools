import * as React from "react"

import Autocomplete from "@material-ui/lab/Autocomplete"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper"

import { GAVersion, Url } from "@/constants"
import useFormStyles from "@/hooks/useFormStyles"
import InlineCode from "@/components/InlineCode"
import { CopyIconButton } from "@/components/CopyButton"
import useInputs from "./useInputs"
import useGenerateUrl from "./useGenerateUrl"
import useStyles from "../Web/useStyles"
import ExternalLink from "@/components/ExternalLink"
import { AdNetwork, supportedAdNetworks } from "../adNetworks"
import ViewSelector from "@/components/ViewSelector"

interface IOSUrlBuilderProps {
  version: GAVersion
}

const customCampaigns = (
  <ExternalLink href={Url.aboutCustomCampaigns}>Custom Campaigns</ExternalLink>
)

const IOSUrlBuilder: React.FC<IOSUrlBuilderProps> = ({ version }) => {
  const classes = useStyles()
  const formClasses = useFormStyles()

  const {
    setAdNetwork,
    setAppID,
    setSource,
    setMedium,
    setTerm,
    setContent,
    setName,
    setPropertyID,
    setRedirectURL,
    setDeviceID,
    updateCustomField,
    ...values
  } = useInputs()
  const {
    adNetwork,
    appID,
    source,
    medium,
    term,
    content,
    name,
    propertyID,
    redirectURL,
    deviceID,
    customFields,
  } = values

  const url = useGenerateUrl(values)

  const qrCodeSrc = React.useMemo(() => {
    if (url === undefined) {
      return
    }
    var qrCodeUrl =
      "https://chart.googleapis.com/chart?cht=qr&chs=250x250&chld=L|0&chl=" +
      encodeURIComponent(url)
    return qrCodeUrl
  }, [url])

  const propertySelector = React.useMemo(() => {
    if (version === GAVersion.UniversalAnalytics) {
      return (
        <ViewSelector
          onlyProperty
          variant="outlined"
          size="small"
          setPropertyId={setPropertyID}
        />
      )
    } else {
      return null
    }
  }, [version, setPropertyID])

  const propertyIdTextField = React.useMemo(() => {
    if (version === GAVersion.UniversalAnalytics) {
      return (
        <TextField
          required
          size="small"
          variant="outlined"
          fullWidth
          label="Google Analytics property ID"
          helperText="e.g. UA-XXXX-Y"
          value={propertyID || ""}
          onChange={e => setPropertyID(e.target.value)}
        />
      )
    } else {
      return null
    }
  }, [version, propertyID, setPropertyID])

  const redirectURLTextField = React.useMemo(() => {
    if (adNetwork?.method === "redirect") {
      return (
        <TextField
          required
          size="small"
          variant="outlined"
          fullWidth
          label="redirect URL"
          helperText={
            <>
              The URL to which the user will be redirected, e.g.{" "}
              <InlineCode>
                https://itunes.apple.com/us/app/my-app/id123456789
              </InlineCode>
            </>
          }
          value={redirectURL || ""}
          onChange={e => setRedirectURL(e.target.value)}
        />
      )
    } else {
      return null
    }
  }, [adNetwork?.method, redirectURL, setRedirectURL])

  const deviceIdTextField = React.useMemo(() => {
    if (adNetwork?.label === "Custom") {
      return (
        <TextField
          required
          size="small"
          variant="outlined"
          fullWidth
          label="device ID macro"
          helperText={
            <>
              The macro the ad network will use to populate the device ID, e.g.{" "}
              <InlineCode>&#123;idfa&#125;</InlineCode>
            </>
          }
          value={deviceID || ""}
          onChange={e => setDeviceID(e.target.value)}
        />
      )
    } else {
      return null
    }
  }, [adNetwork, deviceID, setDeviceID])

  const customFieldInputs = React.useMemo(() => {
    if (customFields !== undefined) {
      return customFields.map((customField, idx) =>
        customField.visible ? (
          <TextField
            key={`${customField.label || `custom field ${idx}`}`}
            required={customField.required}
            size="small"
            variant="outlined"
            fullWidth
            label={customField.label || `custom field ${idx}`}
            helperText={
              <>
                {customField.helperText ||
                  `value for ${customField.label || `custom field ${idx}`}`}
              </>
            }
            value={customField.value || ""}
            onChange={e =>
              updateCustomField(idx, old => ({ ...old, value: e.target.value }))
            }
          />
        ) : null
      )
    }
  }, [customFields, updateCustomField])

  return (
    <section className={formClasses.form}>
      <Typography variant="body1">
        This tool allows you to easily add campaign parameters to URLs so you
        can measure {customCampaigns} in Google Analytics.
      </Typography>
      <Typography variant="h3">Select your property</Typography>
      {propertySelector}
      {propertyIdTextField}
      <Typography variant="h3">Enter the campaign information</Typography>
      <Autocomplete<AdNetwork, false, true, false>
        disableClearable
        fullWidth
        autoComplete
        autoHighlight
        options={Object.values(supportedAdNetworks)}
        getOptionLabel={a => a.label}
        getOptionSelected={(a, b) => a.networkId === b.networkId}
        value={adNetwork}
        onChange={(_event, value) => setAdNetwork(value)}
        renderOption={a => a.label}
        renderInput={params => (
          <TextField
            {...params}
            required
            label="ad network"
            helperText="The ad network you are using"
            size="small"
            variant="outlined"
          />
        )}
      />
      {redirectURLTextField}
      <TextField
        required
        size="small"
        variant="outlined"
        fullWidth
        label="application ID"
        helperText="The final package that is used in your built .apk's manifest, e.g. com.example.application"
        value={appID}
        onChange={e => setAppID(e.target.value)}
      />
      {deviceIdTextField}
      {customFieldInputs}
      <TextField
        required
        size="small"
        variant="outlined"
        fullWidth
        label="campaign source"
        helperText={
          <>
            original referrer, e.g. <InlineCode>google</InlineCode>,{" "}
            <InlineCode>citysearch</InlineCode>,{" "}
            <InlineCode>newsletter4</InlineCode>
          </>
        }
        value={source}
        onChange={e => setSource(e.target.value)}
      />
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        label="campaign medium"
        helperText={
          <>
            marketing medium, e.g. <InlineCode>cpc</InlineCode>,{" "}
            <InlineCode>banner</InlineCode>, <InlineCode>email</InlineCode>
          </>
        }
        value={medium}
        onChange={e => setMedium(e.target.value)}
      />
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        label="campaign term"
        helperText={
          <>
            paid keywords, e.g. <InlineCode>running+shoes</InlineCode>
          </>
        }
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        label="campaign content"
        helperText="ad-specific content used to differentiate ads"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        label="campaign name"
        helperText="product, promotion code, or slogan"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Paper className={classes.share}>
        {!url && (
          <Typography>
            Fill out all required inputs and your url will appear here.
          </Typography>
        )}
        {url && (
          <section>
            <TextField
              className={classes.generatedInput}
              InputProps={{
                endAdornment: <CopyIconButton toCopy={url} />,
              }}
              fullWidth
              id="generated-url"
              label="generated URL"
              multiline
              value={url}
              variant="outlined"
            />
          </section>
        )}
        {qrCodeSrc && (
          <div>
            <img alt="qr code to test via phone" src={qrCodeSrc} />
            <Typography>Scan the QR code to test your URL.</Typography>
          </div>
        )}
      </Paper>
    </section>
  )
}

export default IOSUrlBuilder
