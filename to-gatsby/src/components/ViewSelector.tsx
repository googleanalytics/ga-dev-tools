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
  view?: ProfileSummary
  property?: WebPropertySummary
  // This is a filtered down list that has an account, view & property.
  views: HasView[]
}

interface ViewSelector3Props {
  // A callback that will be called when the view changes.
  onViewChanged?: (hasView: HasView) => void
  // A callback that will be called when the available views change.
  onViewsChanged?: (views: HasView[]) => void
  className?: string
  vertical?: true | undefined
  size?: "small" | "medium"
  variant?: "outlined" | "standard"
}

const ViewSelector: React.FC<ViewSelector3Props> = props => {
  const {
    onViewChanged,
    onViewsChanged,
    className,
    size = "medium",
    variant = "standard",
  } = props
  const classes = useStyles(props)

  // Options for selects
  const [accounts, setAccounts] = React.useState<AccountSummary[]>([])
  const [properties, setProperties] = React.useState<WebPropertySummary[]>([])
  const [views, setViews] = React.useState<ProfileSummary[]>([])

  // Selected values
  const [account, setAccount] = React.useState<AccountSummary>()
  const [property, setProperty] = React.useState<WebPropertySummary>()
  const [view, setView] = React.useState<ProfileSummary>()

  const gapi = useSelector((state: AppState) => state.gapi)
  const user = useSelector((state: AppState) => state.user)

  // Filtered list of account, property, view that has all values populated.
  const [hasViews, setHasViews] = React.useState<HasView[]>([])

  React.useEffect(() => {
    if (user === undefined) {
      setHasViews([])
      setAccount(undefined)
      setProperty(undefined)
      setView(undefined)
      return
    }
    if (gapi !== undefined) {
      const api = getAnalyticsApi(gapi)
      const getData = async () => {
        // TODO - handle rejected promise from .list
        // TODO - here and for all api requests. If the api isn't enabled, show
        // a toast that lets the developer navigate to the API console to enable
        // the api.
        const response = await api.management.accountSummaries.list({})
        const accounts = response.result.items
        if (accounts === undefined) {
          return
        }
        setAccounts(accounts)

        if (accounts.length === 0) {
          return
        }
        const account = accounts[0]
        setAccount(account)

        if (
          account.webProperties === undefined ||
          account.webProperties.length === 0
        ) {
          return
        }

        const property = account.webProperties[0]
        setProperty(property)

        if (property.profiles === undefined || property.profiles.length === 0) {
          return
        }
        const view = property.profiles[0]
        setView(view)

        const hasViews: HasView[] = []
        accounts.forEach(account => {
          account.webProperties?.forEach(property => {
            property.profiles?.forEach(view => {
              hasViews.push({ account, property, view })
            })
          })
        })
        setHasViews(hasViews)
      }
      getData()
    }
  }, [gapi, user])

  // When account changes, update the property options.
  React.useEffect(() => {
    if (account !== undefined) {
      const properties = account.webProperties
      setProperties(properties || [])
    } else {
      setProperties([])
    }
  }, [account])

  // When property changes, update the view options.
  React.useEffect(() => {
    if (property !== undefined) {
      setViews(property.profiles || [])
    } else {
      setViews([])
    }
  }, [property])

  // If accounts changes and there is at least one in the list, default to the first.
  React.useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
    } else {
      setAccount(undefined)
    }
  }, [accounts])

  // If the property options change and there is at least one in the list, default to the first.
  React.useEffect(() => {
    if (properties.length > 0) {
      setProperty(properties[0])
    } else {
      setProperty(undefined)
    }
  }, [properties])

  // If the view options change and there is at least on in the list, default to the first.
  React.useEffect(() => {
    if (views.length > 0) {
      setView(views[0])
    } else {
      setView(undefined)
    }
  }, [views])

  // Call onViewChanged callback whenever the selected account, property, or
  // view changes via user interaction.
  React.useEffect(() => {
    if (
      onViewChanged !== undefined &&
      account !== undefined &&
      property !== undefined &&
      view !== undefined
    ) {
      onViewChanged({ account, property, view })
    }
  }, [account, property, view, onViewChanged])

  React.useEffect(() => {
    if (onViewsChanged !== undefined) {
      onViewsChanged(hasViews)
    }
  }, [hasViews, onViewsChanged])

  const accountOnChange = React.useCallback((_, a: AccountSummary | null) => {
    setAccount(a || undefined)
  }, [])

  const propertyOnChange = React.useCallback(
    (_, a: WebPropertySummary | null) => {
      setProperty(a || undefined)
    },
    []
  )

  const viewOnChange = React.useCallback((_, a: ProfileSummary | null) => {
    setView(a || undefined)
  }, [])

  return (
    <div className={classnames(classes.root, className)}>
      <Autocomplete<AccountSummary>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={accounts}
        value={account || null}
        onChange={accountOnChange}
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
        value={property || null}
        onChange={propertyOnChange}
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
        value={view || null}
        onChange={viewOnChange}
        getOptionLabel={view => view.name || ""}
        renderInput={params => (
          <TextField {...params} label="View" size={size} variant={variant} />
        )}
      />
    </div>
  )
}

export default ViewSelector
