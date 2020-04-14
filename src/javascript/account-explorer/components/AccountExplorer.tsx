import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  box: {
    background: "#fff",
    // TODO - figure out which grey is closest to existing.
    border: `1px solid ${theme.palette.grey[500]}`,
    "border-radius": theme.spacing(0.5),
    "margin-bottom": theme.spacing(1),
    padding: theme.spacing(1)
  },
  boxHeader: {
    "border-bottom": `1px solid ${theme.palette.grey[500]}`,
    margin: theme.spacing(1, 1, 1),
    padding: theme.spacing(1)
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
      "text-align": "center"
    },
    "& input": {
      margin: theme.spacing(1),
      height: "auto",
      padding: theme.spacing(1, 1),
      // Keeps the input from being enormous on larger screens.
      "max-width": theme.breakpoints.width("sm")
    }
  }
}));

const AccountExplorer: React.FC = () => {
  const classes = useStyles();
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
            <input
              className="FormField"
              id="search-box"
              placeholder="Start typing to search..."
            />
            <h3>&hellip;or browse through all your accounts</h3>
            <div id="view-selector-container" />
          </div>
        </header>
        <main className="AccountExplorerResults">
          <h3 className="AccountExplorerResults-title" id="results-title" />
          <div id="results-container" />
        </main>
      </div>
    </>
  );
};

export default AccountExplorer;
