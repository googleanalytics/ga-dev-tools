// Copyright 2020 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from "react"

import { styled } from '@mui/material/styles';

import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import ArrowBack from "@mui/icons-material/ArrowBack"
import LinkIcon from "@mui/icons-material/Link"
import classnames from "classnames"
import { Link } from "gatsby"
import { sortBy } from "lodash"

import Layout from "@/components/Layout"
import { CopyIconButton } from "@/components/CopyButton"
import { Column } from "./common-types"

const PREFIX = 'GroupInfoTemplate';

const classes = {
  deprecatedText: `${PREFIX}-deprecatedText`,
  returnLink: `${PREFIX}-returnLink`,
  columnHeading: `${PREFIX}-columnHeading`,
  chips: `${PREFIX}-chips`,
  linkIcon: `${PREFIX}-linkIcon`
};

const StyledLayout = styled(Layout)((
  {
    theme
  }
) => ({
  [`& .${classes.deprecatedText}`]: {
    textDecoration: "line-through",
  },

  [`& .${classes.returnLink}`]: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(1),
    },
  },

  [`& .${classes.columnHeading}`]: {
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "baseline",
    "&> span": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.chips}`]: {
    "& div": {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.linkIcon}`]: {
    alignSelf: "center",
    marginLeft: theme.spacing(1),
  }
}));

type GroupInfoTemplateProps = {
  pageContext: {
    groupName: string
    dimensions: Column[]
    metrics: Column[]
  }
}

type ColumnProps = {
  column: Column
}

const ColumnInfo: React.FC<ColumnProps> = ({
  column: { attributes },
  column,
}) => {
  // TODO make the uiName be linkAble

  return (
    <section id={column.id?.replace("ga:", "")}>
      <Link to={`#${column.id?.replace("ga:", "")}`}>
        <Typography
          variant="h4"
          className={classnames(classes.columnHeading, {
            [classes.deprecatedText]: attributes?.status === "DEPRECATED",
          })}
        >
          {attributes?.uiName}{" "}
          <Typography component="span">
            {column.id}{" "}
            <CopyIconButton
              toCopy={column.id || ""}
              tooltipText="Copy API name"
            />
          </Typography>
        </Typography>
      </Link>
      <section className={classes.chips}>
        <Chip size="small" label={attributes?.dataType.toLowerCase()} />
        {attributes?.addedInApiVersion === "3" ? (
          <Chip size="small" label={`v3+`} />
        ) : attributes?.addedInApiVersion === "4" ? (
          <Chip size="small" label={`v4`} />
        ) : null}
      </section>
      {attributes?.status === "DEPRECATED" && (
        <Typography variant="body1" color="secondary">
          This field is deprecated and should no longer be used.
        </Typography>
      )}
      <Typography variant="body1">{attributes?.description}</Typography>
      {!attributes?.allowedInSegments && (
        <Typography variant="body1">
          This field is disallowed in segments.
        </Typography>
      )}
    </section>
  )
}

const GroupInfoTemplate: React.FC<
  GroupInfoTemplateProps & { location: { pathname: string } }
> = ({
  pageContext: { groupName, dimensions, metrics },
  location: { pathname },
}) => {

  return (
    <StyledLayout
      title="Dimensions & Metrics Explorer"
      pathname={pathname}
      description={`Contains information on ${groupName} for the Google Analytics API.`}
    >
      <Typography variant="h2">
        {groupName} group
        <a href={`#${groupName.replace(" ", "-")}`}>
          <LinkIcon className={classes.linkIcon} />
        </a>
      </Typography>
      <Link to="/dimensions-metrics-explorer" className={classes.returnLink}>
        <ArrowBack /> Dimensions & Metrics Explorer
      </Link>
      <Typography variant="h3">Dimensions</Typography>
      {sortBy(dimensions, column =>
        column.attributes?.status === "PUBLIC" ? 0 : 1
      ).map(item => (
        <ColumnInfo key={item.id} column={item} />
      ))}
      <Typography variant="h3">Metrics</Typography>
      {sortBy(metrics, column =>
        column.attributes?.status === "PUBLIC" ? 0 : 1
      ).map(item => (
        <ColumnInfo key={item.id} column={item} />
      ))}
    </StyledLayout>
  );
}
export default GroupInfoTemplate
