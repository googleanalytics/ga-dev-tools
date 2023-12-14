import * as React from "react"

import { styled } from '@mui/material/styles';

import Autocomplete from "@mui/material/Autocomplete"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Paper from "@mui/material/Paper"

import { GAVersion, Url } from "@/constants"
import InlineCode from "@/components/InlineCode"
import { CopyIconButton } from "@/components/CopyButton"
import useInputs from "./useInputs"
import useGenerateURL from "./useGenerateURL"
import ExternalLink from "@/components/ExternalLink"
import { AdNetwork, supportedAdNetworks } from "../adNetworks"

const PREFIX = 'PlayURLBuilder';

const classes = {
  generatedInput: `${PREFIX}-generatedInput`,
  denseTableCell: `${PREFIX}-denseTableCell`,
  buttons: `${PREFIX}-buttons`,
  shortened: `${PREFIX}-shortened`,
  inputs: `${PREFIX}-inputs`,
  bold: `${PREFIX}-bold`,
  share: `${PREFIX}-share`,
  shareInvalid: `${PREFIX}-shareInvalid`,
  form: `${PREFIX}-form`
};

const Root = styled('section')((
  {
    theme
  }
) => ({
  [`& .${classes.generatedInput}`]: {
    wordBreak: "break-all",
  },

  [`& .${classes.denseTableCell}`]: {
    whiteSpace: "nowrap",
    "& p": {
      paddingBottom: theme.spacing(0.5),
    },
  },

  [`& .${classes.buttons}`]: {
    display: "flex",
    "& > button": {
      margin: theme.spacing(1),
    },
  },

  [`& .${classes.shortened}`]: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    "& > :first-child": {
      flexGrow: 1,
    },
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.inputs}`]: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
    maxWidth: "600px",
  },

  [`& .${classes.bold}`]: {
    fontWeight: "bold",
  },

  [`& .${classes.share}`]: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },

  [`& .${classes.shareInvalid}`]: {
    display: "flex",
    flexDirection: "row",
    paddingTop: theme.spacing(3),
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(2),
    },
    "& p": {
      paddingBottom: "unset",
    },
  },

  [`& .${classes.form}`]: {
    maxWidth: "80ch",
  }
}));

interface PlayURLBuilderProps {
  version: GAVersion
}

const customCampaigns = (
  <ExternalLink href={Url.aboutCustomCampaigns}>Custom Campaigns</ExternalLink>
)

const PlayURLBuilder: React.FC<PlayURLBuilderProps> = () => {


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
    <Root className={classes.form}>
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
        isOptionEqualToValue={(a, b) => a.networkID === b.networkID}
        value={adNetwork}
        onChange={(_event, value) => setAdNetwork(value)}
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
    </Root>
  );
}

export default PlayURLBuilder
