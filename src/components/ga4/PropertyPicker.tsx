import * as React from "react"
import { useSelector } from "react-redux"
import { useMemo } from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { TextField, makeStyles, Typography } from "@material-ui/core"
import { Dispatch, Requestable, RequestStatus } from "../../types"

type AccountSummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaAccountSummary
export type PropertySummary = gapi.client.analyticsadmin.GoogleAnalyticsAdminV1alphaPropertySummary

interface Props {
  column?: boolean
}
const useStyles = makeStyles(theme => ({
  propertySelector: ({ column }: Props) => ({
    display: "flex",
    flexDirection: column ? "column" : "row",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& > *:not(:first-child)": ({ column }: Props) => ({
      [column ? "marginTop" : "marginLeft"]: theme.spacing(1),
    }),
  }),
}))

const finished = <A extends {}>(t: Requestable<A>): A | undefined => {
  if (t.status === RequestStatus.Successful) {
    return t
  }
  return undefined
}

const prefix = "properties/"
const fixPropertyId = (s: string | undefined) => {
  if (s === undefined) {
    return undefined
  }
  if (s.startsWith(prefix)) {
    return s
  }
  return `${prefix}${s}`
}

interface PropertyPickerProps {
  setPropertyId: Dispatch<string | undefined>
  propertyId: string | undefined
  column?: boolean
}
const PropertyPicker: React.FC<PropertyPickerProps> = ({
  setPropertyId,
  propertyId,
  column,
}) => {
  const classes = useStyles({ column })

  const [account, setAccount] = React.useState<string>()
  const fixed = useMemo(() => fixPropertyId(propertyId), [propertyId])

  const request = useAccountSummaries({ property: fixed, account })

  React.useEffect(() => {
    if (
      propertyId === undefined ||
      request.status !== RequestStatus.Successful
    ) {
      return
    }
    setAccount(finished(request)?.accountForPropertyId(fixed)?.name)
  }, [propertyId, request, fixed])

  return (
    <section className={classes.propertySelector}>
      <Autocomplete<AccountSummary, false, false, false>
        fullWidth
        loading={request.status !== RequestStatus.Successful}
        options={finished(request)?.accounts || []}
        noOptionsText="You have no GA accounts with GA4 properties."
        value={
          finished(request)?.accountForPropertyId(fixed) ||
          finished(request)?.accountForAccountId(account) ||
          null
        }
        getOptionLabel={account => account.displayName!}
        getOptionSelected={(a, b) => a.name === b.name}
        onChange={(_event, value) => {
          if (value === null) {
            setAccount(undefined)
            setPropertyId(undefined)
            return
          }
          setAccount(value.name!)
          const firstProperty = value.propertySummaries?.find((a, idx) =>
            idx === 0 ? a : undefined
          )?.property
          setPropertyId(firstProperty)
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
            label="account"
            size="small"
            variant="outlined"
          />
        )}
      />
      <Autocomplete<PropertySummary, false, false, false>
        fullWidth
        loading={request.status !== RequestStatus.Successful}
        options={finished(request)?.properties || []}
        value={finished(request)?.propertyForPropertyId(fixed) || null}
        getOptionLabel={account => account.displayName!}
        getOptionSelected={(a, b) => a.property === b.property}
        disabled={account === undefined}
        noOptionsText={account ? "No properties for that account." : undefined}
        onChange={(_event, value) =>
          setPropertyId(value === null ? undefined : value.property!)
        }
        renderOption={account => (
          <RenderOption
            first={account.displayName!}
            second={account.property!}
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

type UseGA4AccountSummaries = (arg: {
  property: string | undefined
  account: string | undefined
}) => Requestable<{
  accounts: AccountSummary[]
  properties: PropertySummary[]
  accountForPropertyId: (id: string | undefined) => AccountSummary | undefined
  accountForAccountId: (id: string | undefined) => AccountSummary | undefined
  propertyForPropertyId: (id: string | undefined) => PropertySummary | undefined
}>
const useAccountSummaries: UseGA4AccountSummaries = ({ property, account }) => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const adminAPI = useMemo(() => gapi?.client.analyticsadmin, [gapi])

  const [status, setStatus] = React.useState(RequestStatus.NotStarted)
  const [pageToken, setPageToken] = React.useState<string>()
  const [summaries, setSummaries] = React.useState<AccountSummary[]>()

  const properties = React.useMemo(
    () =>
      summaries?.find(
        aSummary =>
          aSummary.propertySummaries?.find(
            pSummary => pSummary.property === property
          ) || aSummary.name === account
      )?.propertySummaries || [],
    [summaries, property, account]
  )

  const accountForPropertyId = React.useCallback(
    property =>
      summaries?.find(aSummary =>
        aSummary.propertySummaries?.find(
          pSummary => pSummary.property === property
        )
      ),
    [summaries]
  )

  const accountForAccountId = React.useCallback(
    id => {
      return summaries?.find(aSummary => aSummary.name === id)
    },
    [summaries]
  )

  const propertyForPropertyId = React.useCallback(
    propertyId => {
      if (status !== RequestStatus.Successful) {
        return
      }
      return properties?.find(pSummary => pSummary.property === propertyId)
    },
    [properties, status]
  )

  React.useEffect(() => {
    if (
      adminAPI === undefined ||
      status === RequestStatus.Successful ||
      status === RequestStatus.Failed
    ) {
      return
    }
    if (status === RequestStatus.NotStarted) {
      setStatus(RequestStatus.InProgress)
    }
    if (status === RequestStatus.InProgress) {
      adminAPI.accountSummaries
        .list({ pageToken })
        .then(response => {
          const nextToken = response.result.nextPageToken
          setSummaries((old = []) =>
            old.concat(response.result.accountSummaries || [])
          )
          if (nextToken === undefined) {
            setStatus(RequestStatus.Successful)
          } else {
            setPageToken(nextToken)
          }
        })
        .catch(e => {
          console.error({ e })
          setSummaries(undefined)
          setStatus(RequestStatus.Failed)
        })
    }
  }, [adminAPI, pageToken, status])

  switch (status) {
    case RequestStatus.Failed:
      return { status: RequestStatus.Failed }
    case RequestStatus.InProgress:
      return { status: RequestStatus.InProgress }
    case RequestStatus.NotStarted:
      return { status: RequestStatus.NotStarted }
    case RequestStatus.Successful: {
      if (summaries === undefined) {
        throw new Error("Invalid invariant. summaries must be defined here")
      }
      if (properties === undefined) {
        return { status: RequestStatus.InProgress }
      }
      return {
        status: RequestStatus.Successful,
        accounts: summaries,
        properties,
        accountForPropertyId,
        accountForAccountId,
        propertyForPropertyId,
      }
    }
  }
}

export default PropertyPicker
