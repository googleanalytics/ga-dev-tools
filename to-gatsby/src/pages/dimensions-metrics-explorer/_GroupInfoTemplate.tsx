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
import { Column } from "../../api"
import { Link } from "gatsby"
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  Chip,
  makeStyles,
} from "@material-ui/core"
import {
  Done,
  Delete,
  Clear,
  Link as LinkIcon,
  ArrowBack,
} from "@material-ui/icons"
import { sortBy } from "lodash"

type GroupInfoTemplateProps = {
  pageContext: {
    groupName: string
    items: Column[]
  }
}

type ColumnProps = {
  column: Column
}

const useStyles = makeStyles(theme => ({
  returnLink: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(1),
    },
  },
  columnHeading: {
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
    <section id={column.id.replace("ga:", "")}>
      <Typography variant="h2" className={classes.columnHeading}>
        {attributes.uiName}{" "}
        <Typography component="span">{column.id}</Typography>
        <a href={`#${column.id.replace("ga:", "")}`}>
          <LinkIcon className={classes.linkIcon} />
        </a>
      </Typography>
      <section className={classes.chips}>
        {attributes.status === "DEPRECATED" && (
          <Chip size="small" label="Deprecated" icon={<Clear />} />
        )}
        {attributes.allowedInSegments ? (
          <Chip
            color="primary"
            size="small"
            label="Allowed In Segments"
            icon={<Done />}
          />
        ) : (
          <Chip
            color="secondary"
            size="small"
            label="Disallowed in Segments"
            icon={<Clear />}
          />
        )}
        <Chip size="small" label={attributes.type.toLowerCase()} />
        <Chip size="small" label={attributes.dataType.toLowerCase()} />
        <Chip size="small" label={`v${attributes.addedInApiVersion}`} />
      </section>
      <Typography variant="body1">{attributes.description}</Typography>
    </section>
  )
}

const GroupInfoTemplate: React.FC<GroupInfoTemplateProps> = ({
  pageContext: { groupName, items },
}) => {
  const classes = useStyles()
  return (
    <Layout title={groupName}>
      <Link to="/dimensions-metrics-explorer" className={classes.returnLink}>
        <ArrowBack /> Dimensions & Metrics Explorer
      </Link>
      {sortBy(items, column =>
        column.attributes?.status === "PUBLIC" ? 0 : 1
      ).map(item => (
        <ColumnInfo key={item.id} column={item} />
      ))}
    </Layout>
  )
}
export default GroupInfoTemplate
