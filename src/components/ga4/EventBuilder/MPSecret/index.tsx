import { PAB, SAB } from "@/components/Buttons"
import ExternalLink from "@/components/ExternalLink"
import Spinner from "@/components/Spinner"
import WithHelpText from "@/components/WithHelpText"
import { StorageKey, Url } from "@/constants"
import { usePersistantObject } from "@/hooks"
import useFormStyles from "@/hooks/useFormStyles"
import { Dispatch, RequestStatus, successful } from "@/types"
import {
  AccountSummary,
  PropertySummary,
  Stream,
  StreamType,
} from "@/types/ga4/StreamPicker"
import {
  Dialog,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import * as React from "react"
import StreamPicker, { RenderOption } from "../../StreamPicker"
import useMPSecrets, { MPSecret as MPSecretT } from "./useMPSecrets"

const useStyles = makeStyles(theme => ({
  mpSecret: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  secret: {
    display: "flex",
    alignItems: "center",
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  createSecretDialog: {
    padding: theme.spacing(1),
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

interface Props {
  setAPISecret: Dispatch<string | undefined>
  api_secret: string | undefined
  setMeasurementId: Dispatch<string | undefined>
  setFirebaseAppId: Dispatch<string | undefined>
  setUseFirebase: Dispatch<boolean>
}

const api_secret_reference = (
  <ExternalLink href={Url.ga4MPApiKeyReference}>api_secret</ExternalLink>
)

const MPSecret: React.FC<Props> = ({
  setAPISecret,
  api_secret,
  setFirebaseAppId,
  setMeasurementId,
  setUseFirebase,
}) => {
  const formClasses = useFormStyles()
  const classes = useStyles()

  const [account, setAccount] = usePersistantObject<AccountSummary>(
    StorageKey.ga4EventBuilderAccount
  )
  const [property, setProperty] = usePersistantObject<PropertySummary>(
    StorageKey.ga4EventBuilderProperty
  )
  const [stream, setStream] = usePersistantObject<Stream>(
    StorageKey.ga4EventBuilderStream
  )

  React.useEffect(() => {
    if (stream !== undefined) {
      if (stream.streamType === StreamType.Web) {
        setMeasurementId("G-" + stream.measurementId)
        setUseFirebase(false)
      } else {
        setFirebaseAppId(stream.firebaseAppId)
        setUseFirebase(true)
      }
    }
  }, [stream, setFirebaseAppId, setMeasurementId, setUseFirebase])

  const [secret, setSecret] = React.useState<MPSecretT | undefined>(
    api_secret === undefined
      ? undefined
      : {
          secretValue: api_secret,
        }
  )

  React.useMemo(() => {
    if (secret === undefined) {
      return
    }
    setAPISecret(secret.secretValue)
  }, [secret, setAPISecret])

  const [displayName, setDisplayName] = React.useState("")
  const [creatingSecret, setCreatingSecret] = React.useState(false)
  const secretsRequest = useMPSecrets({ stream, setSecret })

  React.useEffect(() => {
    if (
      secretsRequest.status === RequestStatus.Successful ||
      secretsRequest.status === RequestStatus.Failed
    ) {
      setCreatingSecret(false)
    }
  }, [secretsRequest.status])

  return (
    <section className={classes.mpSecret}>
      <Typography>Choose an account, property, and stream.</Typography>
      <StreamPicker
        streams
        account={account}
        property={property}
        stream={stream}
        setAccount={setAccount}
        setProperty={setProperty}
        setStream={setStream}
      />
      <Typography>
        Select an api_secret. You can also create a new secret.
      </Typography>
      <WithHelpText
        helpText={
          <>
            The API secret for the property to send the event to. See{" "}
            {api_secret_reference} on devsite
          </>
        }
      >
        <section className={classes.secret}>
          <Autocomplete<MPSecretT, false, false, true>
            className={formClasses.grow}
            loading={
              secretsRequest.status !== RequestStatus.Successful &&
              stream !== undefined
            }
            options={successful(secretsRequest)?.secrets || []}
            value={secret || null}
            noOptionsText="No options."
            getOptionLabel={secret => secret.secretValue}
            getOptionSelected={(a, b) => a.name === b.name}
            onChange={(_event, value) => {
              if (value === null) {
                setSecret(undefined)
                return
              }
              if (typeof value === "string") {
                setSecret({ secretValue: value })
                return
              }
              setSecret(value)
            }}
            renderOption={secret => (
              <RenderOption
                first={
                  (typeof secret === "string"
                    ? "manually entered secret"
                    : secret.displayName) || ""
                }
                second={secret.secretValue}
              />
            )}
            renderInput={params => (
              <TextField
                {...params}
                label="api_secret"
                size="small"
                variant="outlined"
              />
            )}
          />
          <div>
            <SAB
              title="Create a new secret under the current stream."
              disabled={successful(secretsRequest)?.newSecret === undefined}
              onClick={() => {
                setCreatingSecret(true)
              }}
            >
              new secret
            </SAB>
          </div>

          <Dialog
            open={creatingSecret}
            onClose={() => setCreatingSecret(false)}
          >
            <DialogTitle>Create new secret</DialogTitle>
            <section className={classes.createSecretDialog}>
              {successful(secretsRequest)?.newSecretStatus ===
              RequestStatus.NotStarted ? (
                <TextField
                  label="secret name"
                  variant="outlined"
                  size="small"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
              ) : successful(secretsRequest)?.newSecretStatus ===
                RequestStatus.InProgress ? (
                <Spinner ellipses>creating new secret</Spinner>
              ) : null}
              <div>
                <PAB
                  add
                  onClick={() => {
                    successful(secretsRequest)?.newSecret(displayName)
                  }}
                >
                  Create
                </PAB>
              </div>
            </section>
          </Dialog>
        </section>
      </WithHelpText>
    </section>
  )
}

export default MPSecret
