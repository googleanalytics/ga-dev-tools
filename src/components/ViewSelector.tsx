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
import { usePersistantObject } from "../hooks"
import { StorageKey } from "../constants"
import { Dispatch } from "@/types"

const useStyles = makeStyles<Theme, ViewSelector3Props>(theme => ({
  root: props => ({
    display: "flex",
    flexDirection: props.vertical ? "column" : "unset",
    ...(props.vertical ? { marginBottom: theme.spacing(1) } : {}),
    width: "100%",
  }),
  formControl: {
    width: "100%",
    margin: theme.spacing(1),
    marginLeft: "unset",
  },
}))

// TODO - This naming should be cleaned up. HasView should probably be View,
// and SelectedView probably doesn't need to be external.
export type HasView = Required<Omit<SelectedView, "views">>
export interface SelectedView {
  account?: AccountSummary
  property?: WebPropertySummary
  view?: ProfileSummary
  // This is a filtered down list that has an account, view & property.
  views: HasView[]
}

interface ViewSelector3Props {
  // TODO - create one that's the partial view, and one that's only called when
  // the view is fully selected. ONce the fully selected callback exists,
  // switch the query-expoler and request composer to use that one.
  // A callback that will be called when the view changes.
  onViewChanged?: (hasView: Partial<HasView>) => void
  className?: string
  vertical?: true | undefined
  size?: "small" | "medium"
  variant?: "outlined" | "standard"
  onlyProperty?: boolean
  setPropertyID?: Dispatch<string | undefined>
}

type UseViewSelector = () => {
  accounts: AccountSummary[] | undefined
  properties: WebPropertySummary[] | undefined
  views: ProfileSummary[] | undefined
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
  const [localData, setLocalData] = usePersistantObject<{
    [key: string]: {
      apiResponse?: AccountSummary[]
      selectedAccount?: AccountSummary
      selectedProperty?: WebPropertySummary
      selectedView?: ProfileSummary
    }
  }>(StorageKey.viewSelectorData)
  // const [localData, setLocalData] = useTypedLocalStorage<{
  // [key: string]: {
  //   apiResponse: AccountSummary[]
  //   selectedAccount: AccountSummary | undefined
  //   selectedProperty: WebPropertySummary | undefined
  // selectedView: AccountSummary | undefined
  // }
  // }>("viewSelector - apiResponse", () => "{}" as any, false)

  const [account, setAccount] = React.useState<AccountSummary>()
  const [property, setProperty] = React.useState<WebPropertySummary>()
  const [view, setView] = React.useState<AccountSummary>()

  // Use last selected account
  React.useEffect(() => {
    if (
      user === undefined ||
      hasRun.selectedAccount ||
      localData === undefined
    ) {
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
    if (
      user === undefined ||
      hasRun.selectedProperty ||
      localData === undefined
    ) {
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
    if (user === undefined || hasRun.selectedView || localData === undefined) {
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
      setLocalData(old => {
        if (old === undefined) {
          return {
            [user.getId()]: {
              selectedView: view,
            },
          }
        }
        return {
          ...old,
          [user.getId()]: {
            ...old[user.getId()],
            selectedView: view,
          },
        }
      })
      setView(view)
    },
    [user, setLocalData]
  )

  const setSelectedProperty = React.useCallback(
    (property: WebPropertySummary | undefined) => {
      if (user === undefined) {
        return
      }
      setLocalData(old => {
        if (old === undefined) {
          return {
            [user.getId()]: {
              selectedProperty: property,
            },
          }
        }
        return {
          ...old,
          [user.getId()]: {
            ...old[user.getId()],
            selectedProperty: property,
          },
        }
      })
      setProperty(property)
      if (property?.profiles?.length === 1) {
        setSelectedView(property.profiles[0])
      } else {
        setSelectedView(undefined)
      }
    },
    [user, setLocalData, setSelectedView]
  )

  const setSelectedAccount = React.useCallback(
    (account: AccountSummary | undefined) => {
      if (user === undefined) {
        return
      }
      setLocalData(old => {
        if (old === undefined) {
          return {
            [user.getId()]: {
              selectedAccount: account,
            },
          }
        }
        return {
          ...old,
          [user.getId()]: {
            ...old[user.getId()],
            selectedAccount: account,
          },
        }
      })
      setAccount(account)
      if (account?.webProperties?.length === 1) {
        setSelectedProperty(account.webProperties[0])
      } else {
        setSelectedProperty(undefined)
        setSelectedView(undefined)
      }
    },
    [user, setLocalData, setSelectedProperty, setSelectedView]
  )

  const accounts = React.useMemo(() => {
    if (user === undefined || localData === undefined) {
      return undefined
    }
    if (localData[user.getId()] === undefined) {
      return undefined
    }
    const accountsForUser = localData[user.getId()].apiResponse
    return accountsForUser
  }, [localData, user])

  const properties = React.useMemo(() => {
    if (account === undefined || accounts === undefined) {
      return undefined
    }
    // TODO - not sure if this is the right logic.
    const a = accounts.find(a => a.id === account.id)
    if (a === undefined) {
      return undefined
    }
    return a.webProperties || []
  }, [accounts, account])

  const views = React.useMemo(() => {
    if (property === undefined || properties === undefined) {
      return undefined
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
        setLocalData(old => {
          if (old === undefined) {
            return {
              [user.getId()]: {
                apiResponse: response.result.items!,
              },
            }
          }
          return {
            ...old,
            [user.getId()]: {
              ...old[user.getId()],
              apiResponse: response.result.items!,
            },
          }
        })
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

const ViewSelector: React.FC<ViewSelector3Props> = props => {
  const {
    onlyProperty,
    setPropertyID,
    onViewChanged,
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
    if (onViewChanged !== undefined) {
      onViewChanged({
        account: selectedAccount,
        property: selectedProperty,
        view: selectedView,
      })
    }
  }, [selectedAccount, selectedProperty, selectedView, onViewChanged])

  React.useEffect(() => {
    if (setPropertyID !== undefined) {
      setPropertyID(selectedProperty?.id)
    }
  }, [selectedProperty, setPropertyID])

  return (
    <div className={classnames(classes.root, className)}>
      <Autocomplete<AccountSummary>
        blurOnSelect
        openOnFocus
        autoHighlight
        className={classes.formControl}
        options={accounts || []}
        value={selectedAccount || null}
        onChange={(_, a: AccountSummary | null) => {
          setSelectedAccount(a || undefined)
        }}
        getOptionSelected={(a, b) => a.id === b.id}
        getOptionLabel={account => account.name || ""}
        renderInput={params => (
          <TextField
            {...params}
            label="account"
            size={size}
            variant={variant}
          />
        )}
      />
      <Autocomplete<WebPropertySummary>
        blurOnSelect
        openOnFocus
        autoHighlight
        className={classes.formControl}
        options={properties || []}
        value={selectedProperty || null}
        onChange={(_, p: WebPropertySummary | null) => {
          setSelectedProperty(p || undefined)
        }}
        getOptionSelected={(a, b) => a.id === b.id}
        getOptionLabel={property => property.name || ""}
        renderInput={params => (
          <TextField
            {...params}
            label="property"
            size={size}
            variant={variant}
          />
        )}
      />
      {onlyProperty ? null : (
        <Autocomplete<ProfileSummary>
          blurOnSelect
          openOnFocus
          autoHighlight
          className={classes.formControl}
          options={views || []}
          value={selectedView || null}
          getOptionSelected={(a, b) => a.id === b.id}
          onChange={(_, v: ProfileSummary | null) => {
            setSelectedView(v || undefined)
          }}
          getOptionLabel={view => view.name || ""}
          renderInput={params => (
            <TextField {...params} label="view" size={size} variant={variant} />
          )}
        />
      )}
    </div>
  )
}

export default ViewSelector
