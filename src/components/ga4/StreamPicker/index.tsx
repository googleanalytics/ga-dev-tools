import * as React from "react"
import { Dispatch, RequestStatus, successful } from "@/types"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { makeStyles, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import usePropertyPicker from "./usePropertyPicker"
import {
  AccountSummary,
  PropertySummary,
  Stream,
} from "@/types/ga4/StreamPicker"
import useStreamPicker from "./useStreamPicker"

const useStyles = makeStyles(theme => ({
  picker: {
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

const typeFor = (stream: Stream) => {
  const name = stream.name
  if (name === undefined) {
    return undefined
  }
  if (name.includes("web")) {
    return "web"
  }
  if (name.includes("ios")) {
    return "iOS"
  }
  if (name.includes("android")) {
    return "android"
  }
  return undefined
}

interface Props {
  streams?: boolean

  account?: AccountSummary
  property?: PropertySummary
  stream?: Stream

  setAccount?: Dispatch<AccountSummary | undefined>
  setProperty?: Dispatch<PropertySummary | undefined>
  setStream?: Dispatch<Stream | undefined>
}

export enum Label {
  Account = "account",
}

const StreamPicker: React.FC<Props> = ({
  streams,
  account,
  property,
  stream,
  setAccount,
  setProperty,
  setStream,
}) => {
  const classes = useStyles()
  const propertyPicker = usePropertyPicker({
    account,
    setAccount,
    setProperty,
  })
  const streamPicker = useStreamPicker({ property, stream, setStream })

  return (
    <section className={classes.picker}>
      <Autocomplete<AccountSummary, false, false, false>
        fullWidth
        data-testid={Label.Account}
        loading={propertyPicker.status !== RequestStatus.Successful}
        options={successful(propertyPicker)?.accountSummaries || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={
          successful(propertyPicker) === undefined ? null : account || null
        }
        getOptionLabel={account => account.displayName!}
        getOptionSelected={(a, b) => a.name === b.name}
        onChange={(_event, value) => {
          if (value === null) {
            successful(propertyPicker)?.setAccountSummary(undefined)
            return
          }
          successful(propertyPicker)?.setAccountSummary(value)
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
        loading={propertyPicker.status !== RequestStatus.Successful}
        options={successful(propertyPicker)?.propertySummaries || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={
          successful(propertyPicker) === undefined || property === undefined
            ? null
            : property
        }
        getOptionLabel={summary => summary.displayName!}
        getOptionSelected={(a, b) => a.property === b.property}
        onChange={(_event, value) => {
          if (value === null) {
            successful(propertyPicker)?.setPropertySummary(undefined)
            return
          }
          successful(propertyPicker)?.setPropertySummary(value)
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
      {streams && (
        <Autocomplete<Stream, false, false, false>
          fullWidth
          loading={successful(streamPicker) === undefined}
          options={successful(streamPicker)?.streams || []}
          noOptionsText="You have no GA accounts with GA4 properties."
          value={
            successful(streamPicker) === undefined ||
            successful(streamPicker)?.streams.find(
              a => a.name === stream?.name
            ) === undefined
              ? null
              : stream || null
          }
          getOptionLabel={stream =>
            stream.name?.substring(stream.name.lastIndexOf("/") + 1) || ""
          }
          getOptionSelected={(a, b) => a.name === b.name}
          onChange={(_event, value) => {
            if (value === null) {
              setStream && setStream(undefined)
              return
            }
            setStream && setStream(value)
          }}
          renderOption={stream => (
            <RenderOption
              first={stream.displayName || "no display name"}
              second={
                stream.name?.substring(stream.name.lastIndexOf("/") + 1) || ""
              }
              third={typeFor(stream)}
            />
          )}
          renderInput={params => (
            <TextField
              {...params}
              label="stream"
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
  third?: string
}> = ({ first, second, third }) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <Typography variant="body1" component="div">
          {first}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {second}
        </Typography>
      </div>
      {third && (
        <div>
          <Typography variant="body2">{third}</Typography>
        </div>
      )}
    </div>
  )
}

export default StreamPicker
