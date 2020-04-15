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
    padding: theme.spacing(1),
  },
  boxHeader: {
    margin: theme.spacing(1, 1, 1),
    padding: theme.spacing(1),
  },
  accountExplorerSearch: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    padding: theme.spacing(1),
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
  // TODO - add in IDs.
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
  console.log({ populatedViews });
  return populatedViews.filter((populated) =>
    containsQuery(searchQuery, populated)
  );
};

const AccountExplorer: React.FC = () => {
  const classes = useStyles();
  // TODO - make search a controlled component.
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewData, setViewData] = React.useState<ViewData>();
  const [tableViews, setTableViews] = React.useState<PopulatedView[]>([]);

  //
  React.useEffect(() => {
    if (viewData !== undefined && viewData.populatedViews.length > 0) {
      site.setReadyState();
    }
  }, [viewData]);

  // Update the selected table(s) based on either a search query (has priorty) or a selected view.
  React.useEffect(() => {
    if (searchQuery !== "" && viewData !== undefined) {
      setTableViews(viewsForSearch(searchQuery, viewData.populatedViews));
      return;
    }
    if (
      viewData != undefined &&
      viewData.property !== undefined &&
      viewData.account !== undefined &&
      viewData.view !== undefined
    ) {
      return setTableViews([
        {
          view: viewData.view,
          property: viewData.property,
          account: viewData.account,
        },
      ]);
    }
    setTableViews([]);
  }, [searchQuery, viewData]);

  // TODO add in effect for when the selector is used to clear the current search query.

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
              onViewChanged={(viewData) => setViewData(viewData)}
            />
            <ViewTable className={classes.table} views={tableViews} />
          </div>
        </header>
      </div>
    </>
  );
};

export default AccountExplorer;
