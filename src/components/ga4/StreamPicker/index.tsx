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
    "&> :not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

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
  const request = useStreamPicker({
    account,
    property,
    stream,
    setAccount,
    setProperty,
    setStream,
  })

  return (
    <section className={classes.picker}>
      <Autocomplete<AccountSummary, false, false, false>
        fullWidth
        data-testid={Label.Account}
        loading={request.status !== RequestStatus.Successful}
        options={successful(request)?.accountSummaries || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={successful(request)?.account || null}
        getOptionLabel={account => account.displayName!}
        getOptionSelected={(a, b) => a.name === b.name}
        onChange={(_event, value) => {
          if (value === null) {
            successful(request)?.setAccountSummary(undefined)
            return
          }
          successful(request)?.setAccountSummary(value)
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
        loading={request.status !== RequestStatus.Successful}
        options={successful(request)?.propertySummaries || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={successful(request)?.property || null}
        getOptionLabel={summary => summary.displayName!}
        getOptionSelected={(a, b) => a.property === b.property}
        onChange={(_event, value) => {
          if (value === null) {
            successful(request)?.setPropertySummary(undefined)
            return
          }
          successful(request)?.setPropertySummary(value)
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
          loading={successful(request)?.streams === undefined}
          options={successful(request)?.streams || []}
          noOptionsText="You have no GA accounts with GA4 properties."
          value={successful(request)?.stream || null}
          getOptionLabel={stream =>
            stream.name?.substring(stream.name.lastIndexOf("/") + 1) || ""
          }
          getOptionSelected={(a, b) => a.name === b.name}
          onChange={(_event, value) => {
            if (value === null) {
              successful(request)?.setStream(undefined)
              return
            }
            successful(request)?.setStream(value)
          }}
          renderOption={stream => (
            <RenderOption
              first={stream.displayName || "no display name"}
              second={
                stream.name?.substring(stream.name.lastIndexOf("/") + 1) || ""
              }
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
