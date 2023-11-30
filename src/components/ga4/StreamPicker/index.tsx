import * as React from "react"
import { styled } from '@mui/material/styles';
import { Dispatch, successful } from "@/types"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import useAccountsAndProperties from "./useAccountsAndProperties"
import {
  AccountSummary,
  PropertySummary,
} from "@/types/ga4/StreamPicker"

const PREFIX = 'StreamPicker';

const classes = {
  picker: `${PREFIX}-picker`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.picker}`]: {
    "&> *": {
      marginBottom: theme.spacing(1),
    },
  }
}));

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


interface OnlyProperty extends CommonProps {
  streams?: false | undefined
}

type StreamPickerProps = OnlyProperty

const StreamPicker: React.FC<StreamPickerProps> = props => {
  const { account, property, setAccountID, setPropertyID, autoFill } = props


  const accountsAndPropertiesRequest = useAccountsAndProperties(account)

  return (
      <Root>
        <section className={classes.picker}>
          <Autocomplete<AccountSummary, false, false, false>
            fullWidth
            data-testid={Label.Account}
            loading={!successful(accountsAndPropertiesRequest)}
            options={successful(accountsAndPropertiesRequest)?.accounts || []}
            noOptionsText="You have no GA accounts with GA4 properties."
            value={account || null}
            getOptionLabel={account => account.displayName!}
            isOptionEqualToValue={(a, b) => a.name === b.name}
            onChange={(_event, value) => {
              setAccountID(value === null ? undefined : value?.name)

              if (autoFill) {
                const property = value?.propertySummaries?.[0]
                setPropertyID(property?.property)
              }
            }}
            renderOption={(props, account) => (
                <li {...props}>
                  <RenderOption
                    first={account.displayName!}
                    second={account.name!.substring("accountSummaries/".length)}
                  />
                </li>
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
            isOptionEqualToValue={(a, b) => a.property === b.property}
            onChange={(_event, value) => {
              const property = value === null ? undefined : value
              setPropertyID(property?.property)
            }}
            renderOption={(props, summary) => (
                <li {...props}>
                  <RenderOption
                    first={summary.displayName!}
                    second={summary.property!.substring("properties/".length)}
                  />
                </li>
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
      </Root>
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
  );
}

export default StreamPicker
