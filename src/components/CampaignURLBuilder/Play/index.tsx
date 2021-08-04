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
import useGenerateURL from "./useGenerateURL"
import useStyles from "../Web/useStyles"
import ExternalLink from "@/components/ExternalLink"
import { AdNetwork, supportedAdNetworks } from "../adNetworks"

interface PlayURLBuilderProps {
  version: GAVersion
}

const customCampaigns = (
  <ExternalLink href={Url.aboutCustomCampaigns}>Custom Campaigns</ExternalLink>
)

const PlayURLBuilder: React.FC<PlayURLBuilderProps> = () => {
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
    ...values
  } = useInputs()
  const { adNetwork, appID, source, medium, term, content, name } = values

  const url = useGenerateURL(values)

  const qrCodeSrc = React.useMemo(() => {
    if (url === undefined) {
      return
    }
    var qrCodeURL =
      "https://chart.googleapis.com/chart?cht=qr&chs=250x250&chld=L|0&chl=" +
      encodeURIComponent(url)
    return qrCodeURL
  }, [url])

  return (
    <section className={formClasses.form}>
      <Typography variant="body1">
        This tool allows you to easily add campaign parameters to URLs so you
        can measure {customCampaigns} in Google Analytics.
      </Typography>
      <Typography variant="h3">Enter the campaign information</Typography>
      <Autocomplete<AdNetwork, false, true, false>
        disableClearable
        fullWidth
        autoComplete
        autoHighlight
        options={Object.values(supportedAdNetworks)}
        getOptionLabel={a => a.label}
        getOptionSelected={(a, b) => a.networkID === b.networkID}
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

export default PlayURLBuilder
