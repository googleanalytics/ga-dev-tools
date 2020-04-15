import * as React from "react";
import ViewSelector3, { PopulatedView } from "../../components/ViewSelector3";
import { ViewData } from "../../components/ViewSelector3";
import ViewTable from "./ViewTable";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import site from "../../site";

const useStyles = makeStyles((theme) => ({
  box: {
    background: "#fff",
    // TODO - figure out which grey is closest to existing.
    border: `1px solid ${theme.palette.grey[500]}`,
    "border-radius": theme.spacing(0.5),
    "margin-bottom": theme.spacing(1),
    padding: theme.spacing(0, 1, 1),
  },
  boxHeader: {
    margin: theme.spacing(0, 1, 0),
    padding: theme.spacing(0, 1, 0),
  },
  accountExplorerSearch: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    padding: theme.spacing(0, 1, 0),
    // Search title Title
    "& h3": {
      "font-size": theme.typography.h3.fontSize,
      "font-weight": theme.typography.h3.fontWeight,
      margin: theme.spacing(3),
      "text-align": "center",
    },
  },
  searchInput: {
    margin: theme.spacing(1),
    height: "auto",
    padding: theme.spacing(1, 1),
    // Keeps the input from being enormous on larger screens.
    width: "100%",
    "max-width": theme.breakpoints.width("sm"),
  },
  table: {
    "margin-top": theme.spacing(6),
  },
}));

const containsQuery = (
  searchQuery: string,
  populatedView: PopulatedView
): boolean => {
  const lower = searchQuery.toLowerCase();
  const propertiesToCheck = [
    populatedView.account?.name.toLowerCase(),
    populatedView.account?.id.toLowerCase(),
    populatedView.property?.name.toLowerCase(),
    populatedView.property?.id.toLowerCase(),
    populatedView.view?.name.toLowerCase(),
    populatedView.view?.id.toLowerCase(),
  ];
  return (
    propertiesToCheck.find(
      (property) => property && property.indexOf(lower) !== -1
    ) !== undefined
  );
};

const viewsForSearch = (
  searchQuery: string,
  populatedViews: PopulatedView[]
): PopulatedView[] => {
  return populatedViews.filter((populated) =>
    containsQuery(searchQuery, populated)
  );
};

const getSearchParam = (): string | undefined => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (query !== null) {
    return query;
  }
  return undefined;
};

const AccountExplorer: React.FC = () => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = React.useState(() => {
    return getSearchParam() || "";
  });
  const [selectedView, setSelectedView] = React.useState<PopulatedView>();
  const [populatedViews, setPopulatedViews] = React.useState<PopulatedView[]>(
    []
  );
  const [tableViews, setTableViews] = React.useState<PopulatedView[]>([]);

  React.useEffect(() => {
    if (populatedViews.length > 0) {
      site.setReadyState();
    }
  }, [populatedViews]);

  // Whenever the selected view changes, if it is defined, the search should be
  // cleared & the table views set to the newly selected view.
  React.useEffect(() => {
    if (selectedView != undefined) {
      setSearchQuery("");
      setTableViews([
        {
          view: selectedView.view,
          property: selectedView.property,
          account: selectedView.account,
        },
      ]);
    }
  }, [searchQuery, selectedView]);

  return (
    <>
      <section>
        <h2>Overview</h2>
        <p>
          Use this tool to search or browse through your accounts, properties,
          and views, See what accounts you have access to, and find the IDs that
          you need for the API or for another tool or service that integrates
          with Google Analytics.
        </p>
      </section>

      <div className={`${classes.box}`}>
        <header className={`${classes.boxHeader}`}>
          <div className={`${classes.accountExplorerSearch}`}>
            <h3>Search for your account information&hellip;</h3>
            <TextField
              className={classes.searchInput}
              placeholder="Start typing to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <h3>&hellip;or browse through all your accounts</h3>
            <ViewSelector3
              onPopulatedViewsChanged={(populatedViews) => {
                setPopulatedViews(populatedViews);
              }}
              onViewChanged={(viewData) => {
                setSelectedView(viewData);
                // If the selected view changes, regardless of the search,
                const q = getSearchParam();
                console.log({ q });
                if (q !== undefined && viewData.view !== undefined) {
                  // clear the param
                  console.log("should clear");
                } else {
                }
              }}
            />
            <ViewTable className={classes.table} views={tableViews} />
          </div>
        </header>
      </div>
    </>
  );
};

export default AccountExplorer;
