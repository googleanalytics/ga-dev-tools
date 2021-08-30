import { PAB, SAB } from "@/components/Buttons"
import ExternalLink from "@/components/ExternalLink"
import Spinner from "@/components/Spinner"
import Warning from "@/components/Warning"
import WithHelpText from "@/components/WithHelpText"
import { StorageKey, Url } from "@/constants"
import useFormStyles from "@/hooks/useFormStyles"
import { Dispatch, RequestStatus, successful } from "@/types"
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
import useAccountPropertyStream from "../../StreamPicker/useAccountPropertyStream"
import { QueryParam } from "../types"
import useInputs, { CreationStatus } from "./useInputs"
import useMPSecretsRequest, {
  MPSecret as MPSecretT,
} from "./useMPSecretsRequest"

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
  setSecret: Dispatch<MPSecretT | undefined>
  secret: MPSecretT | undefined
  useFirebase: boolean
}

const api_secret_reference = (
  <ExternalLink href={Url.ga4MPAPISecretReference}>api_secret</ExternalLink>
)

const MPSecret: React.FC<Props> = ({ secret, setSecret, useFirebase }) => {
  const formClasses = useFormStyles()
  const classes = useStyles()

  const aps = useAccountPropertyStream(StorageKey.eventBuilderAPS, QueryParam, {
    androidStreams: useFirebase,
    webStreams: !useFirebase,
  })
  const secretsRequest = useMPSecretsRequest({ aps })
  const [creationError, setCreationError] = React.useState<any>()

  const {
    displayName,
    setDisplayName,
    creationStatus,
    setCreationStatus,
  } = useInputs()

  return (
    <section className={classes.mpSecret}>
      <Typography>Choose an account, property, and stream.</Typography>
      <StreamPicker autoFill streams {...aps} />
      <Typography>
        Select an existing api_secret or create a new secret.
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
            loading={secretsRequest.status !== RequestStatus.Successful}
            options={successful(secretsRequest)?.secrets || []}
            noOptionsText="There are no secrets for the selected stream."
            loadingText={
              aps.stream === undefined
                ? "Choose an account, property, and stream to see existing secrets."
                : "Loading..."
            }
            value={secret || null}
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
              disabled={!successful(secretsRequest)}
              onClick={() => {
                setCreationStatus(CreationStatus.ShowDialog)
              }}
            >
              new secret
            </SAB>
          </div>

          <Dialog
            open={
              creationStatus === CreationStatus.ShowDialog ||
              creationStatus === CreationStatus.Creating
            }
            onClose={() => setCreationStatus(CreationStatus.NotStarted)}
          >
            <DialogTitle>Create new secret</DialogTitle>
            <section className={classes.createSecretDialog}>
              {creationStatus === CreationStatus.ShowDialog ? (
                <TextField
                  label="secret name"
                  variant="outlined"
                  size="small"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
              ) : (
                <Spinner ellipses>creating new secret</Spinner>
              )}
              <div>
                <PAB
                  add
                  onClick={async () => {
                    setCreationStatus(CreationStatus.Creating)
                    try {
                      const nuSecret = await successful(
                        secretsRequest
                      )!.createMPSecret(displayName)
                      setCreationStatus(CreationStatus.Done)
                      setSecret(nuSecret)
                    } catch (e) {
                      setCreationError(e)
                      setCreationStatus(CreationStatus.Failed)
                    }
                  }}
                >
                  Create
                </PAB>
              </div>
            </section>
          </Dialog>
        </section>
        {creationError && <Warning>{creationError?.message}</Warning>}
      </WithHelpText>
    </section>
  )
}

export default MPSecret
