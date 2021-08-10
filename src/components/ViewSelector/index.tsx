import * as React from "react"
import { makeStyles, Theme } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import classnames from "classnames"

import { Dispatch } from "@/types"
import useViewSelector, {
  AccountSummary,
  ProfileSummary,
  WebPropertySummary,
} from "./useViewSelector"

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
  account: AccountSummary | undefined
  setAccountID: Dispatch<string | undefined>
  property: WebPropertySummary | undefined
  setPropertyID: Dispatch<string | undefined>
  vertical?: boolean
  className?: string
  size?: "small" | "medium"
  variant?: "outlined" | "standard"
}

interface OnlyProperty extends CommonProps {
  onlyProperty: true
}

interface AlsoView extends CommonProps {
  view: ProfileSummary | undefined
  setViewID: Dispatch<string | undefined>
  onlyProperty?: false | undefined
}

type ViewSelectorProps = AlsoView | OnlyProperty

const ViewSelector: React.FC<ViewSelectorProps> = props => {
  const {
    account,
    setAccountID,
    property,
    setPropertyID,
    className,
    size = "medium",
    variant = "standard",
  } = props
  const classes = useStyles(props)

  const { accounts, properties, views } = useViewSelector(account, property)

  return (
    <div className={classnames(classes.root, className)}>
      <Autocomplete<AccountSummary>
        blurOnSelect
        openOnFocus
        autoHighlight
        className={classes.formControl}
        options={accounts || []}
        value={account || null}
        onChange={(_, a: AccountSummary | null) => {
          setAccountID(a?.id || undefined)
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
        value={property || null}
        onChange={(_, p: WebPropertySummary | null) => {
          setPropertyID(p?.id || undefined)
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
          options={views || []}
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
