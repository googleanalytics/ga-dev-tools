import * as React from "react"
import { makeStyles, Theme } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import classnames from "classnames"

import { Dispatch, RequestStatus, successful } from "@/types"
import {
  AccountSummary,
  ProfileSummary,
  WebPropertySummary,
} from "./useAccountPropertyView"
import useAccountSummaries from "./useAccountSummaries"

const useStyles = makeStyles<Theme, ViewSelectorProps>(theme => ({
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

interface CommonProps {
  account?: AccountSummary
  setAccountID: Dispatch<string | undefined>
  property?: WebPropertySummary
  setPropertyID: Dispatch<string | undefined>
  vertical?: boolean
  className?: string
  size?: "small" | "medium"
  variant?: "outlined" | "standard"
  autoFill?: boolean
}

interface OnlyProperty extends CommonProps {
  onlyProperty: true
}

interface AlsoView extends CommonProps {
  view?: ProfileSummary
  setViewID: Dispatch<string | undefined>
  onlyProperty?: false | undefined
}

type ViewSelectorProps = AlsoView | OnlyProperty

const ViewSelector: React.FC<ViewSelectorProps> = props => {
  const {
    autoFill,
    account,
    setAccountID,
    property,
    setPropertyID,
    className,
    size = "medium",
    variant = "standard",
  } = props
  const classes = useStyles(props)

  const request = useAccountSummaries(account, property)

  return (
    <div className={classnames(classes.root, className)}>
      <Autocomplete<AccountSummary>
        blurOnSelect
        openOnFocus
        autoHighlight
        noOptionsText="You don't have any Google Analytics accounts."
        className={classes.formControl}
        loading={request.status === RequestStatus.InProgress}
        options={successful(request)?.accountSummaries || []}
        value={account || null}
        onChange={(_, a: AccountSummary | null) => {
          setAccountID(a?.id || undefined)

          if (autoFill) {
            // Update property ID based on new account.
            const firstWebProperty = a?.webProperties?.[0]
            setPropertyID(firstWebProperty?.id || undefined)

            // Update view ID based on new property if not onlyProperty.
            const firstView = firstWebProperty?.profiles?.[0]
            !props.onlyProperty && props.setViewID(firstView?.id || undefined)
          }
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
        loading={request.status === RequestStatus.InProgress}
        options={successful(request)?.propertySummaries || []}
        noOptionsText={
          account === undefined
            ? "Select an account to show available properties."
            : "You don't have any properties for this account."
        }
        value={property || null}
        onChange={(_, p: WebPropertySummary | null) => {
          setPropertyID(p?.id || undefined)

          if (autoFill) {
            // Update view ID based on new property if not onlyProperty.
            const firstView = p?.profiles?.[0]
            !props.onlyProperty && props.setViewID(firstView?.id || undefined)
          }
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
      {props.onlyProperty ? null : (
        <Autocomplete<ProfileSummary>
          blurOnSelect
          openOnFocus
          autoHighlight
          className={classes.formControl}
          loading={request.status === RequestStatus.InProgress}
          options={successful(request)?.profileSummaries || []}
          noOptionsText={
            account === undefined
              ? "Select an account and property to show available views."
              : property === undefined
              ? "Select a property to show available views"
              : "You don't have any views for this property."
          }
          value={props.view || null}
          getOptionSelected={(a, b) => a.id === b.id}
          onChange={(_, v: ProfileSummary | null) => {
            props.setViewID(v?.id || undefined)
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
