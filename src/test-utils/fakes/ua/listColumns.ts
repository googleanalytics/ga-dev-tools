import { Column } from "@/types/ua"

const columns: Column[] = [
  {
    id: "ga:userType",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "User Type",
      description:
        "A boolean, either New Visitor or Returning Visitor, indicating if the users are new or returning.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:visitorType",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:userType",
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "DEPRECATED",
      uiName: "User Type",
      description:
        "A boolean, either New Visitor or Returning Visitor, indicating if the users are new or returning.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:sessionCount",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "Count of Sessions",
      description:
        "The session index for a user. Each session from a unique user will get its own incremental index starting from 1 for the first session. Subsequent sessions do not change previous session indices. For example, if a user has 4 sessions to the website, sessionCount for that user will have 4 distinct values of '1' through '4'.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:visitCount",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:sessionCount",
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "DEPRECATED",
      uiName: "Count of Sessions",
      description:
        "The session index for a user. Each session from a unique user will get its own incremental index starting from 1 for the first session. Subsequent sessions do not change previous session indices. For example, if a user has 4 sessions to the website, sessionCount for that user will have 4 distinct values of '1' through '4'.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:daysSinceLastSession",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "Days Since Last Session",
      description:
        "The number of days elapsed since users last visited the property, used to calculate user loyalty.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:userDefinedValue",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "User Defined Value",
      description:
        "The value provided when defining custom user segments for the property.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:userBucket",
    kind: "analytics#column",
    attributes: {
      type: "DIMENSION",
      dataType: "STRING",
      group: "User",
      status: "PUBLIC",
      uiName: "User Bucket",
      description:
        "Randomly assigned users tag to allow A/B testing and splitting of remarketing lists. Ranges from 1-100.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:users",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "Users",
      description: "The total number of users for the requested time period.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:visitors",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:users",
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "DEPRECATED",
      uiName: "Users",
      description: "The total number of users for the requested time period.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:newUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "New Users",
      description: "The number of sessions marked as a user's first sessions.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:newVisits",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:newUsers",
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "DEPRECATED",
      uiName: "New Users",
      description: "The number of sessions marked as a user's first sessions.",
      allowedInSegments: "true",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:percentNewSessions",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "PERCENT",
      group: "User",
      status: "PUBLIC",
      uiName: "% New Sessions",
      description:
        "The percentage of sessions by users who had never visited the property before.",
      calculation: "ga:newUsers / ga:sessions",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:percentNewVisits",
    kind: "analytics#column",
    attributes: {
      replacedBy: "ga:percentNewSessions",
      type: "METRIC",
      dataType: "PERCENT",
      group: "User",
      status: "DEPRECATED",
      uiName: "% New Sessions",
      description:
        "The percentage of sessions by users who had never visited the property before.",
      calculation: "ga:newUsers / ga:sessions",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:1dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "1 Day Active Users",
      description:
        "Total number of 1-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 1-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:7dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "7 Day Active Users",
      description:
        "Total number of 7-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 7-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:14dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "14 Day Active Users",
      description:
        "Total number of 14-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 14-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:28dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "28 Day Active Users",
      description:
        "Total number of 28-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 28-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:30dayUsers",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "INTEGER",
      group: "User",
      status: "PUBLIC",
      uiName: "30 Day Active Users",
      description:
        "Total number of 30-day active users for each day in the requested time period. At least one of ga:nthDay, ga:date, or ga:day must be specified as a dimension to query this metric. For a given date, the returned value will be the total number of unique users for the 30-day period ending on the given date.",
      addedInApiVersion: "3",
    },
  },
  {
    id: "ga:sessionsPerUser",
    kind: "analytics#column",
    attributes: {
      type: "METRIC",
      dataType: "FLOAT",
      group: "User",
      status: "PUBLIC",
      uiName: "Number of Sessions per User",
      description:
        "The total number of sessions divided by the total number of users.",
      allowedInSegments: "false",
      addedInApiVersion: "3",
    },
  },
]

const listColumns: typeof gapi.client.analytics.metadata.columns.list = () => {
  return Promise.resolve({ result: { items: columns } }) as any
}

export default listColumns
