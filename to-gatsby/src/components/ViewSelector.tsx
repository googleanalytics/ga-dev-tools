import * as React from "react"
import { makeStyles, Theme } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { useSelector } from "react-redux"
import classnames from "classnames"

import {
  getAnalyticsApi,
  AccountSummary,
  ProfileSummary,
  WebPropertySummary,
} from "../api"
import { useTypedLocalStorage } from "../hooks"

const useStyles = makeStyles<Theme, ViewSelector3Props>(theme => ({
  root: props => ({
    display: "flex",
    flexDirection: props.vertical ? "column" : "unset",
    width: "100%",
  }),
  formControl: {
    width: "100%",
    margin: theme.spacing(1),
    marginLeft: "unset",
  },
}))

export type HasView = Required<Omit<SelectedView, "views">>
export interface SelectedView {
  account?: AccountSummary
  property?: WebPropertySummary
  view?: ProfileSummary
  // This is a filtered down list that has an account, view & property.
  views: HasView[]
}

interface ViewSelector3Props {
  // A callback that will be called when the view changes.
  onViewChanged?: (hasView: HasView) => void
  className?: string
  vertical?: true | undefined
  size?: "small" | "medium"
  variant?: "outlined" | "standard"
}

type UseViewSelector = () => {
  accounts: AccountSummary[]
  properties: WebPropertySummary[]
  views: ProfileSummary[]
  selectedAccount: AccountSummary | undefined
  setSelectedAccount: (account: AccountSummary | undefined) => void
  selectedProperty: WebPropertySummary | undefined
  setSelectedProperty: (property: WebPropertySummary | undefined) => void
  selectedView: ProfileSummary | undefined
  setSelectedView: (view: ProfileSummary | undefined) => void
}
const useViewSelector: UseViewSelector = () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  const user = useSelector((state: AppState) => state.user)

  const [hasRun, setHasRun] = React.useState<{
    selectedAccount: boolean
    selectedProperty: boolean
    selectedView: boolean
  }>({
    selectedAccount: false,
    selectedProperty: false,
    selectedView: false,
  })
  const [localData, setLocalData] = useTypedLocalStorage<{
    [key: string]: {
      apiResponse: AccountSummary[]
      selectedAccount: AccountSummary | undefined
      selectedProperty: WebPropertySummary | undefined
      selectedView: AccountSummary | undefined
    }
  }>("viewSelector - apiResponse", () => "{}" as any, false)

  const [account, setAccount] = React.useState<AccountSummary>()
  const [property, setProperty] = React.useState<WebPropertySummary>()
  const [view, setView] = React.useState<AccountSummary>()

  // Use last selected account
  React.useEffect(() => {
    if (user === undefined || hasRun.selectedAccount) {
      return
    }
    const forUser = localData[user.getId()]
    if (forUser === undefined) {
      return
    }
    setAccount(forUser.selectedAccount)
    setHasRun(old => ({ ...old, selectedAccount: true }))
  }, [user, localData, hasRun])

  // Use last selected property
  React.useEffect(() => {
    if (user === undefined || hasRun.selectedProperty) {
      return
    }
    const forUser = localData[user.getId()]
    if (forUser === undefined) {
      return
    }
    setProperty(forUser.selectedProperty)
    setHasRun(old => ({ ...old, selectedProperty: true }))
  }, [user, localData, hasRun])

  // Use last selected property
  React.useEffect(() => {
    if (user === undefined || hasRun.selectedView) {
      return
    }
    const forUser = localData[user.getId()]
    if (forUser === undefined) {
      return
    }
    setView(forUser.selectedView)
    setHasRun(old => ({ ...old, selectedView: true }))
  }, [user, localData, hasRun])

  const setSelectedView = React.useCallback(
    (view: ProfileSummary | undefined) => {
      if (user === undefined) {
        return
      }
      setLocalData(old => ({
        ...old,
        [user.getId()]: {
          ...old[user.getId()],
          selectedView: view,
        },
      }))
      setView(view)
    },
    [user, setLocalData]
  )

  const setSelectedProperty = React.useCallback(
    (property: WebPropertySummary | undefined) => {
      if (user === undefined) {
        return
      }
      setLocalData(old => ({
        ...old,
        [user.getId()]: {
          ...old[user.getId()],
          selectedProperty: property,
        },
      }))
      setProperty(property)
      setSelectedView(undefined)
    },
    [user, setLocalData, setSelectedView]
  )

  const setSelectedAccount = React.useCallback(
    (account: AccountSummary | undefined) => {
      if (user === undefined) {
        return
      }
      setLocalData(old => ({
        ...old,
        [user.getId()]: {
          ...old[user.getId()],
          selectedAccount: account,
        },
      }))
      setAccount(account)
      // Since this is only called from the controls, it is always good to
      // clear the other options here.
      setSelectedProperty(undefined)
      setSelectedView(undefined)
    },
    [user, setLocalData, setSelectedProperty, setSelectedView]
  )

  const accounts = React.useMemo(() => {
    if (user === undefined) {
      return []
    }
    if (localData[user.getId()] === undefined) {
      return []
    }
    const accountsForUser = localData[user.getId()].apiResponse
    return accountsForUser
  }, [localData, user])

  const properties = React.useMemo(() => {
    if (account === undefined) {
      return []
    }
    // TODO - not sure if this is the right logic.
    const a = accounts.find(a => a.id === account.id)
    if (a === undefined) {
      return []
    }
    return a.webProperties || []
  }, [accounts, account])

  const views = React.useMemo(() => {
    if (property === undefined) {
      return []
    }
    // TODO - not sure if this is the right logic.
    const p = properties.find(p => p.id === property.id)
    if (p === undefined) {
      return []
    }
    return p.profiles || []
  }, [properties, property])

  React.useEffect(() => {
    if (user === undefined) {
      return
    }
    if (gapi !== undefined) {
      const api = getAnalyticsApi(gapi)
      api.management.accountSummaries.list({}).then(response => {
        setLocalData(old => ({
          ...old,
          [user.getId()]: {
            ...old[user.getId()],
            apiResponse: response.result.items!,
          },
        }))
      })
    }
  }, [gapi, user, setLocalData])
  return {
    accounts,
    selectedAccount: account,
    setSelectedAccount,
    properties,
    selectedProperty: property,
    setSelectedProperty,
    views,
    selectedView: view,
    setSelectedView,
  }
}

// TODO - This should keep the last value you selected instead of making you
// reselect every time.
const ViewSelector: React.FC<ViewSelector3Props> = props => {
  const {
    onViewChanged,
    // TODO - Implement this.
    className,
    size = "medium",
    variant = "standard",
  } = props
  const classes = useStyles(props)

  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    properties,
    selectedProperty,
    setSelectedProperty,
    views,
    selectedView,
    setSelectedView,
  } = useViewSelector()

  // Call onViewChanged callback whenever the selected account, property, or
  // view changes via user interaction.
  React.useEffect(() => {
    if (
      onViewChanged !== undefined &&
      selectedAccount !== undefined &&
      selectedProperty !== undefined &&
      selectedView !== undefined
    ) {
      onViewChanged({
        account: selectedAccount,
        property: selectedProperty,
        view: selectedView,
      })
    }
  }, [selectedAccount, selectedProperty, selectedView, onViewChanged])

  return (
    <div className={classnames(classes.root, className)}>
      <Autocomplete<AccountSummary>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={accounts}
        value={selectedAccount || null}
        onChange={(_, a: AccountSummary | null) => {
          setSelectedAccount(a || undefined)
        }}
        getOptionSelected={(a, b) => a.id === b.id}
        getOptionLabel={account => account.name || ""}
        renderInput={params => (
          <TextField
            {...params}
            label="Account"
            size={size}
            variant={variant}
          />
        )}
      />
      <Autocomplete<WebPropertySummary>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={properties}
        value={selectedProperty || null}
        onChange={(_, p: WebPropertySummary | null) => {
          setSelectedProperty(p || undefined)
        }}
        getOptionSelected={(a, b) => a.id === b.id}
        getOptionLabel={property => property.name || ""}
        renderInput={params => (
          <TextField
            {...params}
            label="Property"
            size={size}
            variant={variant}
          />
        )}
      />
      <Autocomplete<ProfileSummary>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={views}
        value={selectedView || null}
        getOptionSelected={(a, b) => a.id === b.id}
        onChange={(_, v: ProfileSummary | null) => {
          setSelectedView(v || undefined)
        }}
        getOptionLabel={view => view.name || ""}
        renderInput={params => (
          <TextField {...params} label="View" size={size} variant={variant} />
        )}
      />
    </div>
  )
}

export default ViewSelector
