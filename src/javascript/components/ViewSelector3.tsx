// This is called ViewSelector3 now because I want to join in on the fun of
// adding numbers to the end of components.

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const whenReady = (cb: () => void) => {
  gapi.analytics.ready(function() {
    if (gapi.analytics.auth.isAuthorized()) {
      cb();
    } else {
      gapi.analytics.auth.once("success", cb);
    }
  });
};

const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    // TODO - min-width might be too big here. Check this again after I do flex on root.
    "min-width": theme.spacing(25),
    margin: theme.spacing(1)
  }
}));

interface ViewSelector3Props {
  // A callback that will be called when the view changes.
  onViewChanged?: (
    account: Account | undefined,
    property: WebProperty | undefined,
    view: Profile | undefined
  ) => void;
}

interface Profile {
  name: string;
}

interface WebProperty {
  name: string;
  profiles: Profile[];
}

interface Account {
  name: string;
  webProperties: WebProperty[];
}

const ViewSelector3: React.FC<ViewSelector3Props> = ({ onViewChanged }) => {
  const classes = useStyles();

  const [accounts, setAccounts] = React.useState<Account[]>([]);

  const [account, setAccount] = React.useState<Account>();
  const [property, setProperty] = React.useState<WebProperty>();
  const [view, setView] = React.useState<Profile>();

  const [accountIdx, setAccountIdx] = React.useState<number | undefined>();
  const [propertyIdx, setPropertyIdx] = React.useState<number | undefined>();
  const [viewIdx, setViewIdx] = React.useState<number | undefined>();

  const [propertyOptions, setPropertyOptions] = React.useState<WebProperty[]>(
    []
  );
  const [viewOptions, setViewOptions] = React.useState<Profile[]>([]);

  React.useEffect(() => {
    whenReady(() => {
      // Load the Google Analytics client library.
      gapi.client.load("analytics", "v3").then(function() {
        // Get a list of all Google Analytics accounts for this user
        gapi.client.analytics.management.accountSummaries
          .list()
          .then(({ result }) => {
            const accounts: Account[] = result.items;
            setAccounts(accounts);
            if (accounts.length > 0) {
              setAccountIdx(0);
              const account = accounts[0];
              if (account.webProperties.length > 0) {
                setPropertyIdx(0);
                const property = account.webProperties[0];
                const profiles = property.profiles;
                if (profiles.length > 0) {
                  setViewIdx(0);
                }
              }
            }
          });
      });
    });
  }, []);

  // When accounts or accountIdx change, we should update the selected account,
  // and choose the first property & view (if there is a property or view for
  // the account).
  React.useEffect(() => {
    if (accountIdx !== undefined) {
      const account = accounts[accountIdx];
      setAccount(account);
      const properties = account.webProperties;
      setPropertyOptions(properties);
      console.log(properties);
      if (properties.length > 0) {
        setPropertyIdx(0);
      } else {
        setPropertyIdx(undefined);
      }
    } else {
      setAccount(undefined);
      setProperty(undefined);
      setPropertyOptions([]);
      setView(undefined);
      setViewOptions([]);
    }
  }, [accounts, accountIdx]);

  // When the account or propertyIdx change, we should update the selected
  // property, and choose the first view ( if there is a view for the property.)
  React.useEffect(() => {
    if (account !== undefined && propertyIdx !== undefined) {
      const property = account.webProperties[propertyIdx];
      setProperty(property);
      const views = property.profiles;
      setViewOptions(views);
      if (views.length > 0) {
        setViewIdx(0);
      } else {
        setViewIdx(undefined);
      }
    } else {
      setProperty(undefined);
      setView(undefined);
      setViewOptions([]);
    }
  }, [account, propertyIdx]);

  // When the property or viewIdx change, we should update the selected view.
  React.useEffect(() => {
    if (property !== undefined && viewIdx !== undefined) {
      const view = property.profiles[viewIdx];
      setView(view);
    } else {
      setView(undefined);
    }
  }, [property, viewIdx]);

  // Call onViewChanged callback whenever the selected account, property, or
  // view changes.
  React.useEffect(() => {
    if (onViewChanged !== undefined) {
      onViewChanged(account, property, view);
    }
  }, [account, property, view]);

  const accountOnChange = React.useCallback(
    (e: React.ChangeEvent<{ value?: unknown }>) => {
      if (e.target.value !== "") {
        setAccountIdx(e.target.value as number);
      } else {
        setAccountIdx(undefined);
      }
    },
    []
  );
  const propertyOnChange = React.useCallback(
    (e: React.ChangeEvent<{ value?: unknown }>) => {
      if (e.target.value !== "") {
        setPropertyIdx(e.target.value as number);
      } else {
        setPropertyIdx(undefined);
      }
    },
    []
  );
  const viewOnChange = React.useCallback(
    (e: React.ChangeEvent<{ value?: unknown }>) => {
      if (e.target.value !== "") {
        setViewIdx(e.target.value as number);
      } else {
        setViewIdx(undefined);
      }
    },
    []
  );

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel>Account</InputLabel>
        <Select
          value={accountIdx === undefined ? "" : accountIdx}
          onChange={accountOnChange}
        >
          {accounts.map((account, idx) => (
            <MenuItem key={account.name} value={idx}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Property</InputLabel>
        <Select
          value={propertyIdx === undefined ? "" : propertyIdx}
          onChange={propertyOnChange}
        >
          {propertyOptions.map((property, idx) => (
            <MenuItem key={property.name} value={idx}>
              {property.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>View</InputLabel>
        <Select
          value={viewIdx === undefined ? "" : viewIdx}
          onChange={viewOnChange}
        >
          {viewOptions.map((view, idx) => (
            <MenuItem key={view.name} value={idx}>
              {view.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ViewSelector3;
