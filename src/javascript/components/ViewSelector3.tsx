import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getAnalyticsApi,
  AccountSummary,
  ProfileSummary,
  WebPropertySummary,
} from "../wrappedTypes";

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

export type HasView = Required<Omit<SelectedView, "views">>;
export interface SelectedView {
  account?: AccountSummary;
  view?: ProfileSummary;
  property?: WebPropertySummary;
  // This is a filtered down list that has an account, view & property.
  views: HasView[];
}

interface ViewSelector3Props {
  // A callback that will be called when the view changes.
  onViewChanged?: (hasView: HasView) => void;
  // A callback that will be called when the available views change.
  onViewsChanged?: (views: HasView[]) => void;
}

// This is called ViewSelector3 now because I want to join in on the fun of
// adding numbers to the end of components.
const ViewSelector3: React.FC<ViewSelector3Props> = ({
  onViewChanged,
  onViewsChanged,
}) => {
  const classes = useStyles();

  // Options for selects
  const [accounts, setAccounts] = React.useState<AccountSummary[]>([]);
  const [properties, setProperties] = React.useState<WebPropertySummary[]>([]);
  const [views, setViews] = React.useState<ProfileSummary[]>([]);

  // Selected values
  const [account, setAccount] = React.useState<AccountSummary>();
  const [property, setProperty] = React.useState<WebPropertySummary>();
  const [view, setView] = React.useState<ProfileSummary>();

  // Filtered list of account, property, view that has all values populated.
  const [hasViews, setHasViews] = React.useState<HasView[]>([]);

  React.useEffect(() => {
    getAnalyticsApi().then(async (api) => {
      const response = await api.management.accountSummaries.list({});
      const accounts = response.result.items;
      if (accounts === undefined) {
        return;
      }
      setAccounts(accounts);

      if (accounts.length === 0) {
        return;
      }
      const account = accounts[0];
      setAccount(account);

      if (
        account.webProperties === undefined ||
        account.webProperties.length === 0
      ) {
        return;
      }

      const property = account.webProperties[0];
      setProperty(property);

      if (property.profiles === undefined || property.profiles.length === 0) {
        return;
      }
      const view = property.profiles[0];
      setView(view);

      const hasViews: HasView[] = [];
      accounts.forEach((account) => {
        account.webProperties?.forEach((property) => {
          property.profiles?.forEach((view) => {
            hasViews.push({ account, property, view });
          });
        });
      });
      setHasViews(hasViews);
    });
  }, []);

  // When account changes, update the property options.
  React.useEffect(() => {
    if (account !== undefined) {
      const properties = account.webProperties;
      setProperties(properties || []);
    } else {
      setProperties([]);
    }
  }, [account]);

  // When property changes, update the view options.
  React.useEffect(() => {
    if (property !== undefined) {
      setViews(property.profiles || []);
    } else {
      setViews([]);
    }
  }, [property]);

  // If accounts changes and there is at least one in the list, default to the first.
  React.useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  }, [accounts]);

  // If the property options change and there is at least one in the list, default to the first.
  React.useEffect(() => {
    if (properties.length > 0) {
      setProperty(properties[0]);
    } else {
      setProperty(undefined);
    }
  }, [properties]);

  // If the view options change and there is at least on in the list, default to the first.
  React.useEffect(() => {
    if (views.length > 0) {
      setView(views[0]);
    } else {
      setView(undefined);
    }
  }, [views]);

  // Call onViewChanged callback whenever the selected account, property, or
  // view changes via user interaction.
  React.useEffect(() => {
    if (
      onViewChanged !== undefined &&
      account !== undefined &&
      property !== undefined &&
      view !== undefined
    ) {
      onViewChanged({ account, property, view });
    }
  }, [account, property, view]);

  React.useEffect(() => {
    if (onViewsChanged !== undefined) {
      onViewsChanged(hasViews);
    }
  }, [hasViews]);

  const accountOnChange = React.useCallback((_, a: AccountSummary | null) => {
    setAccount(a || undefined);
  }, []);

  const propertyOnChange = React.useCallback(
    (_, a: WebPropertySummary | null) => {
      setProperty(a || undefined);
    },
    []
  );

  const viewOnChange = React.useCallback((_, a: ProfileSummary | null) => {
    setView(a || undefined);
  }, []);

  return (
    <div className={classes.root}>
      <Autocomplete<AccountSummary>
        blurOnSelect
        openOnFocus
        autoSelect
        autoHighlight
        className={classes.formControl}
        options={accounts}
        value={account || null}
        onChange={accountOnChange}
        getOptionLabel={(account) => account.name || ""}
        renderInput={(params) => <TextField {...params} label="Account" />}
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
        getOptionLabel={(property) => property.name || ""}
        renderInput={(params) => <TextField {...params} label="Property" />}
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
        getOptionLabel={(view) => view.name || ""}
        renderInput={(params) => <TextField {...params} label="View" />}
      />
    </div>
  );
};

export default ViewSelector3;
