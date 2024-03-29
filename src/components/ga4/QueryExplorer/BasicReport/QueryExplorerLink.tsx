import { GA4Dimension, GA4Metric } from "@/components/GA4Pickers"
import { Link } from "@reach/router"
import * as React from "react"
import useLinkToQueryExplorer from "./useLinkToQueryExplorer"
import {PropsWithChildren} from 'react';

export interface QueryExplorerLinkProps {
  dimensions?: GA4Dimension[]
  metrics?: GA4Metric[]
}

const QueryExplorerLink: React.FC<PropsWithChildren<QueryExplorerLinkProps>> = ({
  children = "Query Explorer",
  ...props
}) => {
  const linkToQueryExplorer = useLinkToQueryExplorer(props)
  return <Link to={linkToQueryExplorer}>{children}</Link>
}

export default QueryExplorerLink
