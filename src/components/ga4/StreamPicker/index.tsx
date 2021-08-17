import * as React from "react"
import { Dispatch, Requestable, successful } from "@/types"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { makeStyles, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import useAccountsAndProperties from "./useAccountsAndProperties"
import {
  AccountSummary,
  PropertySummary,
  Stream,
} from "@/types/ga4/StreamPicker"

const useStyles = makeStyles(theme => ({
  picker: {
    "&> *": {
      marginBottom: theme.spacing(1),
    },
  },
}))

export enum Label {
  Account = "account",
  Property = "property",
  Stream = "stream",
}

interface CommonProps {
  account: AccountSummary | undefined
  property: PropertySummary | undefined
  setAccountID: Dispatch<string | undefined>
  setPropertyID: Dispatch<string | undefined>
  autoFill?: boolean
}

interface WithStreams extends CommonProps {
  // If needed this can be updated to only show web, firebase, or ios streams.
  streams: true
  stream: Stream | undefined
  setStreamID: Dispatch<string | undefined>
  streamsRequest: Requestable<{ streams: Stream[] }>
  updateToFirstStream: () => void
}

interface OnlyProperty extends CommonProps {
  streams?: false | undefined
}

type StreamPickerProps = OnlyProperty | WithStreams

const StreamPicker: React.FC<StreamPickerProps> = props => {
  const { account, property, setAccountID, setPropertyID, autoFill } = props
  const classes = useStyles()

  const accountsAndPropertiesRequest = useAccountsAndProperties(account)

  return (
    <section className={classes.picker}>
      <Autocomplete<AccountSummary, false, false, false>
        fullWidth
        data-testid={Label.Account}
        loading={!successful(accountsAndPropertiesRequest)}
        options={successful(accountsAndPropertiesRequest)?.accounts || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={account || null}
        getOptionLabel={account => account.displayName!}
        getOptionSelected={(a, b) => a.name === b.name}
        onChange={(_event, value) => {
          setAccountID(value === null ? undefined : value?.name)

          if (autoFill) {
            const property = value?.propertySummaries?.[0]
            setPropertyID(property?.property)
            props.streams && props.updateToFirstStream()
          }
        }}
        renderOption={account => (
          <RenderOption
            first={account.displayName!}
            second={account.name!.substring("accountSummaries/".length)}
          />
        )}
        renderInput={params => (
          <TextField
            {...params}
            label={Label.Account}
            size="small"
            variant="outlined"
          />
        )}
      />
      <Autocomplete<PropertySummary, false, false, false>
        fullWidth
        data-testid={Label.Property}
        loading={!successful(accountsAndPropertiesRequest)}
        options={successful(accountsAndPropertiesRequest)?.properties || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={property || null}
        getOptionLabel={summary => summary.displayName!}
        getOptionSelected={(a, b) => a.property === b.property}
        onChange={(_event, value) => {
          const property = value === null ? undefined : value
          setPropertyID(property?.property)

          if (autoFill) {
            props.streams && props.updateToFirstStream()
          }
        }}
        renderOption={summary => (
          <RenderOption
            first={summary.displayName!}
            second={summary.property!.substring("properties/".length)}
          />
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="property"
            size="small"
            variant="outlined"
          />
        )}
      />
      {props.streams && (
        <Autocomplete<Stream, false, false, false>
          fullWidth
          data-testid={Label.Stream}
          loading={property !== undefined && !successful(props.streamsRequest)}
          options={successful(props.streamsRequest)?.streams || []}
          noOptionsText={
            property === undefined
              ? "Select an account an property to populate this dropdown."
              : "There are no streams for the selected property."
          }
          value={props.stream || null}
          getOptionLabel={stream => stream.value.displayName!}
          getOptionSelected={(a, b) => a.value.name === b.value.name}
          onChange={(_event, value) => {
            props.setStreamID(value?.value.name)
          }}
          renderOption={stream => (
            <RenderOption
              first={stream.value.displayName!}
              second={stream.type + " stream"}
            />
          )}
          renderInput={params => (
            <TextField
              {...params}
              label={Label.Stream}
              size="small"
              variant="outlined"
            />
          )}
        />
      )}
    </section>
  )
}

export const RenderOption: React.FC<{
  first: string
  second: string
}> = ({ first, second }) => {
  return (
    <div>
      <Typography variant="body1" component="div">
        {first}
      </Typography>
      <Typography variant="subtitle2" color="primary">
        {second}
      </Typography>
    </div>
  )
}

export default StreamPicker
