import * as React from "react"
import { useSelector } from "react-redux"
import { useMemo, useEffect } from "react"
import { usePersistantObject } from "../hooks"
import { StorageKey } from "../constants"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { TextField, makeStyles, Typography } from "@material-ui/core"
import { Dispatch } from "../types"

const useStyles = makeStyles(theme => ({
  propertySelector: {
    display: "flex",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

interface GA4PropertySelectorProps {
  accountSummariesKey: StorageKey
  selectedAccountKey: StorageKey
  selectedPropertyKey: StorageKey
  setSelectedProperty: Dispatch<SelectableProperty | undefined>
}

interface SelectableAccount {
  displayName: string
  name: string
}

export interface SelectableProperty {
  displayName: string
  property: string
}

const GA4PropertySelector: React.FC<GA4PropertySelectorProps> = ({
  accountSummariesKey,
  selectedAccountKey,
  selectedPropertyKey,
  setSelectedProperty,
}) => {
  const classes = useStyles()
  const [selectedAccount, setSelectedAccount] = usePersistantObject<
    SelectableAccount
  >(selectedAccountKey)
  const [localProperty, setLocalProperty] = usePersistantObject<
    SelectableProperty
  >(selectedPropertyKey)

  const accountSummaries = useGA4AccountSummaries(accountSummariesKey)
  const accounts = useMemo<SelectableAccount[] | undefined>(
    () =>
      accountSummaries?.map(summary => ({
        name: summary.name || "",
        displayName: summary.displayName || "",
      })),
    [accountSummaries]
  )

  const properties = useMemo<SelectableProperty[] | undefined>(() => {
    if (selectedAccount === undefined) {
      return []
    }
    return accountSummaries
      ?.find(summary => summary.name === selectedAccount.name)
      ?.propertySummaries?.map(propertySummary => ({
        displayName: propertySummary.displayName || "",
        property: propertySummary.property || "",
      }))
  }, [accountSummaries, selectedAccount])

  useEffect(() => {
    if (selectedAccount === undefined) {
      setLocalProperty(undefined)
    }
  }, [selectedAccount, setLocalProperty])

  useEffect(() => {
    setSelectedProperty(localProperty)
  }, [localProperty, setSelectedProperty])

  const onAccountChange = React.useCallback(
    (account: SelectableAccount | undefined) => {
      setSelectedAccount(account)
      // If the account wasn't cleared out, find the properties for it. If
      // there is only one select it, otherwise clear out the property
      // selector.
      if (account !== undefined) {
        const properties = accountSummaries?.find(
          summary => summary.name === account.name
        )?.propertySummaries
        const toSet =
          properties === undefined
            ? undefined
            : properties.length === 1
            ? {
                displayName: properties[0].displayName || "",
                property: properties[0].property || "",
              }
            : undefined
        setLocalProperty(toSet)
      }
    },
    [setSelectedAccount, accountSummaries, setLocalProperty]
  )

  return (
    <section className={classes.propertySelector}>
      <Autocomplete<SelectableAccount, false, false, false>
        fullWidth
        options={accounts || []}
        value={selectedAccount || null}
        getOptionLabel={account => account.displayName}
        onChange={(_event, value) =>
          onAccountChange(
            value === null ? undefined : (value as SelectableAccount)
          )
        }
        renderOption={account => (
          <RenderOption
            first={account.displayName}
            second={account.name.substring("accountSummaries/".length)}
          />
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="Account"
            size="small"
            variant="outlined"
          />
        )}
      />
      <Autocomplete<SelectableProperty, false, false, false>
        fullWidth
        options={properties || []}
        value={localProperty || null}
        noOptionsText="Choose an account first."
        getOptionLabel={property => property.displayName}
        onChange={(_event, value) =>
          setLocalProperty(
            value === null ? undefined : (value as SelectableProperty)
          )
        }
        renderOption={property => (
          <RenderOption
            first={property.displayName}
            second={property.property.substring("properties/".length)}
          />
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="Property"
            size="small"
            variant="outlined"
          />
        )}
      />
    </section>
  )
}

const RenderOption: React.FC<{
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

type AccountSummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAccountSummary

type UseGA4AccountSummaries = (key: StorageKey) => AccountSummary[] | undefined
const useGA4AccountSummaries: UseGA4AccountSummaries = (key: StorageKey) => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])
  const [accountSummaries, setAccountSummaryies] = usePersistantObject<
    AccountSummary[]
  >(key)

  useEffect(() => {
    if (adminAPI === undefined) {
      return
    }
    adminAPI.accountSummaries.list().then(response => {
      // TODO add in pagination.
      setAccountSummaryies(response.result.accountSummaries)
    })
  }, [adminAPI, setAccountSummaryies])

  return accountSummaries
}

export default GA4PropertySelector
