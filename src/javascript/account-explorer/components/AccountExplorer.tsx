import * as React from "react";

const AccountExplorer: React.FC = () => {
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

      <div className="Box">
        <header className="Box-header">
          <div className="AccountExplorerSearch">
            <h3 className="AccountExplorerSearch-title">
              Search for your account information&hellip;
            </h3>
            <input
              className="AccountExplorerSearch-field FormField"
              id="search-box"
              placeholder="Start typing to search..."
            />
            <h3 className="AccountExplorerSearch-title">
              &hellip;or browse through all your accounts
            </h3>
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
