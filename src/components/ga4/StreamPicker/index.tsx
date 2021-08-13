import * as React from "react"
import { Dispatch, RequestStatus, successful } from "@/types"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { makeStyles, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import useStreamPicker from "./useStreamPicker"
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
  streams: true
}

interface OnlyProperty extends CommonProps {
  stream: Stream | undefined
  setStreamID: Dispatch<string | undefined>
  streams?: false | undefined
}

type StreamPickerProps = OnlyProperty | WithStreams

const StreamPicker: React.FC<StreamPickerProps> = props => {
  const { account, property, setAccountID, setPropertyID, autoFill } = props
  const classes = useStyles()

  const { accountsAndProperties } = useStreamPicker(account, property)

  return (
    <section className={classes.picker}>
      <Autocomplete<AccountSummary, false, false, false>
        fullWidth
        data-testid={Label.Account}
        loading={accountsAndProperties.status !== RequestStatus.Successful}
        options={successful(accountsAndProperties)?.accounts || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={account || null}
        getOptionLabel={account => account.displayName!}
        getOptionSelected={(a, b) => a.name === b.name}
        onChange={(_event, value) => {
          setAccountID(value === null ? undefined : value?.name)

          if (autoFill) {
            setPropertyID(value?.propertySummaries?.[0].property)
          }
          // TODO - handle autoFill for streams
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
        loading={accountsAndProperties.status !== RequestStatus.Successful}
        options={successful(accountsAndProperties)?.properties || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={property || null}
        getOptionLabel={summary => summary.displayName!}
        getOptionSelected={(a, b) => a.property === b.property}
        onChange={(_event, value) => {
          setPropertyID(value === null ? undefined : value?.property)

          // TODO - handle autoFill for streams
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

// {streams && (
//   <Autocomplete<Stream, false, false, false>
//     fullWidth
//     loading={successful(request)?.streams === undefined}
//     options={successful(request)?.streams || []}
//     noOptionsText="You have no GA accounts with GA4 properties."
//     value={successful(request)?.stream || null}
//     getOptionLabel={stream =>
//       stream.name?.substring(stream.name.lastIndexOf("/") + 1) || ""
//     }
//     getOptionSelected={(a, b) => a.name === b.name}
//     onChange={(_event, value) => {
//       if (value === null) {
//         successful(request)?.setStream(undefined)
//         return
//       }
//       successful(request)?.setStream(value)
//     }}
//     renderOption={stream => (
//       <RenderOption
//         first={stream.displayName || "no display name"}
//         second={
//           stream.name?.substring(stream.name.lastIndexOf("/") + 1) || ""
//         }
//       />
//     )}
//     renderInput={params => (
//       <TextField
//         {...params}
//         label="stream"
//         size="small"
//         variant="outlined"
//       />
//     )}
//   />
// )}
