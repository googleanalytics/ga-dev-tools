import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PopulatedView } from "../../components/ViewSelector3";
import Icon from "../../components/icon";
import classnames from "classnames";

const useStyles = makeStyles((theme) => ({
  table: {
    "table-layout": "fixed",
    width: "100%",
    "& thead": {
      "border-bottom": `1px solid ${theme.palette.grey[300]}`,
      "& tr": {
        "& th": {
          "text-align": "left",
          "padding-bottom": theme.spacing(1),
        },
      },
    },
    "& tbody": {
      "& tr:not(:last-child)": {
        "border-bottom": `1px solid ${theme.palette.grey[300]}`,
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
    color: theme.palette.grey[500],
  },
}));

interface ViewTableProps {
  views: PopulatedView[];
  className?: string;
}

// This table is used to show the IDs needed for various API calls.
const ViewTable: React.FC<ViewTableProps> = ({ views, className }) => {
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
                <div>{populated.account.name}</div>
                <div className={classes.id}>{populated.account.id}</div>
              </td>
              <td>
                <div>{populated.property.name}</div>
                <div className={classes.id}>{populated.property.id}</div>
              </td>
              <td>
                <div>
                  <a
                    href={viewUrl}
                    title="Open this view in Google Analytics"
                    target="_blank"
                  >
                    {populated.view.name}
                    <Icon type="call-made" />
                  </a>
                </div>
                <div className={classes.id}>{populated.view.id}</div>
              </td>
              <td>
                <div className={classes.id}>ga:{populated.view.id}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ViewTable;

/* '<a href="//www.google.com/analytics/web/#report/visitors-overview/a' +
 * results[i].account.id +
 * "w" +
 * results[i].property.internalWebPropertyId +
 * "p" +
 * results[i].view.id +
 * '" title="Open this view in Google Analytics">' +
 * highlightSafe(results[i].view.name) +
 * " " +
 * '<svg class="Icon" viewBox="0 0 24 24">' +
 * '<use xlink:href="/public/images/icons.svg#icon-call-made"></use>' +
 * "</svg></a> " + */
