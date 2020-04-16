import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { HasView } from "../../components/ViewSelector3";
import Icon from "../../components/icon";
import classnames from "classnames";
import HighlightText from "./HighlightText";
import { useThrottle } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  table: {
    "table-layout": "fixed",
    width: "100%",
    "& thead": {
      "border-bottom": `1px solid ${theme.palette.text.secondary}`,
      "& tr": {
        "& th": {
          "text-align": "left",
          "padding-bottom": theme.spacing(1),
        },
      },
    },
    "& tbody": {
      "& tr:not(:last-child)": {
        "border-bottom": `1px solid ${theme.palette.text.secondary}`,
      },
      "& tr": {
        "& td": {
          width: "25%",
          "padding-top": theme.spacing(1),
          "padding-bottom": theme.spacing(1),
        },
      },
    },
  },
  id: {
    color: theme.palette.text.secondary,
  },
  mark: {
    backgroundColor: theme.palette.success.light,
  },
  link: {
    color: theme.palette.info.main,
  },
}));

interface ViewTableProps {
  views: HasView[];
  className?: string;
  search?: string;
}

// This table shows a list of populated views. A populated view is a combination
// of account, property, and view, & table ID.
const ViewsTable: React.FC<ViewTableProps> = ({ views, className, search }) => {
  const throttledSearch = useThrottle(search, 100);
  const classes = useStyles();
  return (
    <table className={classnames(classes.table, className)}>
      <thead>
        <tr>
          <th>Account</th>
          <th>Property</th>
          <th>View</th>
          <th>Table ID</th>
        </tr>
      </thead>
      <tbody>
        {views.length === 0 && (
          <tr>
            <td colSpan={4}></td>
          </tr>
        )}
        {views.map((populated) => {
          const { account, property, view } = populated;
          const viewUrl = `https://analytics.google.com/analytics/web/#/report/vistors-overview/a${account.id}w${property.internalWebPropertyId}p${view.id}`;
          return (
            <tr
              key={`${populated.account.name}-${populated.property.name}-${populated.view.name}`}
            >
              <td>
                <div>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={account.name || ""}
                  />
                </div>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={account.id || ""}
                  ></HighlightText>
                </div>
              </td>
              <td>
                <div>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={property.name || ""}
                  />
                </div>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={property.id || ""}
                  />
                </div>
              </td>
              <td>
                <div>
                  <a
                    className={classes.link}
                    href={viewUrl}
                    title="Open this view in Google Analytics"
                    target="_blank"
                  >
                    <HighlightText
                      className={classes.mark}
                      search={throttledSearch}
                      text={view.name || ""}
                    />
                    <Icon type="call-made" />
                  </a>
                </div>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={view.id || ""}
                  />
                </div>
              </td>
              <td>
                <div className={classes.id}>
                  <HighlightText
                    className={classes.mark}
                    search={throttledSearch}
                    text={`ga:${view.id}`}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ViewsTable;
