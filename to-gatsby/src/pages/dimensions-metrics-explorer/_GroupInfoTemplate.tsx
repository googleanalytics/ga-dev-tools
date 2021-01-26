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

import Layout from "../../components/layout"
import classnames from "classnames"
import { Column } from "../../api"
import { Link } from "gatsby"
import { Typography, Chip, makeStyles } from "@material-ui/core"
import { Done, Clear, Link as LinkIcon, ArrowBack } from "@material-ui/icons"
import { sortBy } from "lodash"
import CopyButton from "../../components/CopyButton"

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

const useStyles = makeStyles(theme => ({
  deprecatedText: {
    textDecoration: "line-through",
  },
  returnLink: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(1),
    },
  },
  columnHeading: {
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "baseline",
    "& span": {
      marginLeft: theme.spacing(1),
    },
  },
  chips: {
    "& div": {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(1),
  },
  linkIcon: {
    alignSelf: "center",
    marginLeft: theme.spacing(1),
  },
}))

const ColumnInfo: React.FC<ColumnProps> = ({
  column: { attributes },
  column,
}) => {
  // TODO make the uiName be linkAble
  const classes = useStyles()
  return (
    <section id={column.id?.replace("ga:", "")}>
      <Typography
        variant="h4"
        className={classnames(classes.columnHeading, {
          [classes.deprecatedText]: attributes?.status === "DEPRECATED",
        })}
      >
        {attributes?.uiName}{" "}
        <Typography component="span">{column.id}</Typography>
        <a href={`#${column.id?.replace("ga:", "")}`}>
          <LinkIcon className={classes.linkIcon} />
        </a>
      </Typography>
      <section className={classes.chips}>
        <Chip size="small" label={attributes?.dataType.toLowerCase()} />
        <Chip size="small" label={`v${attributes?.addedInApiVersion}`} />
        {attributes?.addedInApiVersion === "3" && (
          <Chip size="small" label={`v4`} />
        )}
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
      <CopyButton
        text="Copy API Name"
        toCopy={column.id}
        variant="outlined"
        size="small"
      />
    </section>
  )
}

const GroupInfoTemplate: React.FC<GroupInfoTemplateProps> = ({
  pageContext: { groupName, dimensions, metrics },
  pageContext,
}) => {
  const classes = useStyles()
  return (
    <Layout title="Dimensions & Metrics Explorer">
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
    </Layout>
  )
}
export default GroupInfoTemplate
