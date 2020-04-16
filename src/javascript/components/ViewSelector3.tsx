import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const whenReady = (cb: () => void) => {
  gapi.analytics.ready(function () {
    if (gapi.analytics.auth.isAuthorized()) {
      cb();
    } else {
      gapi.analytics.auth.once("success", cb);
    }
  });
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  formControl: {
    width: "100%",
    margin: theme.spacing(1),
  },
}));

interface ViewSelector3Props {
  // A callback that will be called when the view changes.
  onViewChanged?: (populatedView: PopulatedView) => void;
  // A callback that will be called when the available views change.
  onPopulatedViewsChanged?: (populatedViews: PopulatedView[]) => void;
}

export interface View {
  name: string;
  id: string;
}

export interface Property {
  name: string;
  id: string;
  internalWebPropertyId: string;
  profiles: View[];
}

export interface Account {
  name: string;
  id: string;
  webProperties: Property[];
}

export type PopulatedView = Required<Omit<ViewData, "populatedViews">>;

export interface ViewData {
  account?: Account;
  view?: View;
  property?: Property;
  populatedViews: PopulatedView[];
}

// This is called ViewSelector3 now because I want to join in on the fun of
// adding numbers to the end of components.
const ViewSelector3: React.FC<ViewSelector3Props> = ({
  onViewChanged,
  onPopulatedViewsChanged,
}) => {
  const classes = useStyles();

  const [accounts, setAccounts] = React.useState<Account[]>([]);

  const [account, setAccount] = React.useState<Account | null>(null);
  const [property, setProperty] = React.useState<Property | null>(null);
  const [view, setView] = React.useState<View | null>(null);

  const [propertyOptions, setPropertyOptions] = React.useState<Property[]>([]);
  const [viewOptions, setViewOptions] = React.useState<View[]>([]);

  const [populatedViews, setPopulatedViews] = React.useState<PopulatedView[]>(
    []
  );
  React.useEffect(() => {
    whenReady(() => {
      // Load the Google Analytics client library.
      gapi.client.load("analytics", "v3").then(function () {
        // Get a list of all Google Analytics accounts for this user
        gapi.client.analytics.management.accountSummaries
          .list()
          .then(({ result }) => {
            const accounts: Account[] = result.items;
            setAccounts(accounts);
            if (accounts.length > 0) {
              const account = accounts[0];
              setAccount(account);
              if (account.webProperties.length > 0) {
                const property = account.webProperties[0];
                setProperty(property);
                const profiles = property.profiles;
                if (profiles.length > 0) {
                  const view = profiles[0];
                  setView(view);
                }
              }
            }
            // Set
            const populatedViews: PopulatedView[] = [];
            accounts.forEach((account) => {
              account.webProperties.forEach((property) => {
                property.profiles.forEach((view) => {
                  populatedViews.push({ account, property, view });
                });
              });
            });
            setPopulatedViews(populatedViews);
          });
      });
    });
  }, []);

  // When account changes, update the property options.
  React.useEffect(() => {
    if (account !== null) {
      const properties = account.webProperties;
      setPropertyOptions(properties);
    } else {
      setPropertyOptions([]);
    }
  }, [account]);

  // When property changes, update the view options.
  React.useEffect(() => {
    if (property !== null) {
      setViewOptions(property.profiles);
    } else {
      setViewOptions([]);
    }
  }, [property]);

  // If accounts changes and there is at least one in the list, default to the first.
  React.useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  }, [accounts]);

  // If the property options change and there is at least one in the list, default to the first.
  React.useEffect(() => {
    if (propertyOptions.length > 0) {
      setProperty(propertyOptions[0]);
    } else {
      setProperty(null);
    }
  }, [propertyOptions]);

  // If the view options change and there is at least on in the list, default to the first.
  React.useEffect(() => {
    if (viewOptions.length > 0) {
      setView(viewOptions[0]);
    } else {
      setView(null);
    }
  }, [viewOptions]);

  // Call onViewChanged callback whenever the selected account, property, or
  // view changes via user interaction.
  React.useEffect(() => {
    if (
      onViewChanged !== undefined &&
      account !== null &&
      property !== null &&
      view !== null
    ) {
      onViewChanged({ account, property, view });
    }
  }, [account, property, view]);

  React.useEffect(() => {
    if (onPopulatedViewsChanged !== undefined) {
      onPopulatedViewsChanged(populatedViews);
    }
  }, [populatedViews]);

  const accountOnChange = React.useCallback((_, a: Account | null) => {
    setAccount(a);
  }, []);

  const propertyOnChange = React.useCallback((_, a: Property | null) => {
    setProperty(a);
  }, []);

  const viewOnChange = React.useCallback((_, a: View | null) => {
    setView(a);
  }, []);

  return (
    <div className={classes.root}>
      <Autocomplete<Account>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={accounts}
        value={account}
        onChange={accountOnChange}
        getOptionLabel={(account) => account.name}
        renderInput={(params) => <TextField {...params} label="Account" />}
      />
      <Autocomplete<Property>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={propertyOptions}
        value={property}
        onChange={propertyOnChange}
        getOptionLabel={(property) => property.name}
        renderInput={(params) => <TextField {...params} label="Property" />}
      />
      <Autocomplete<View>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={viewOptions}
        value={view}
        onChange={viewOnChange}
        getOptionLabel={(view) => view.name}
        renderInput={(params) => <TextField {...params} label="View" />}
      />
    </div>
  );
};

export default ViewSelector3;
