import * as React from "react"

import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"

import { Url } from "@/constants"
import ExternalLink from "@/components/ExternalLink"
import BasicReport from "./BasicReport"
import { navigate } from "gatsby"

const dataAPI = (
  <ExternalLink href={Url.ga4DataAPI}>Analytics Data API</ExternalLink>
)

const TabPanel: React.FC<{ value: number; index: number }> = ({
  value,
  index,
  children,
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

export enum QueryExplorerType {
  Basic = "basic",
}

interface QueryExplorerProps {
  type: QueryExplorerType
}

const QueryExplorer: React.FC<QueryExplorerProps> = ({ type }) => {
  const tab = React.useMemo(() => {
    switch (type) {
      case QueryExplorerType.Basic:
        return 0
    }
  }, [type])

  const pathForIdx = React.useCallback((idx: number) => {
    switch (idx) {
      case 0:
        return `/`
      default:
        throw new Error("No matching idx")
    }
  }, [])

  return (
    <>
      <Typography>
        The GA4 Query Explorer helps you to create valid requests for the{" "}
        {dataAPI}.
      </Typography>

      <section>
        <Tabs
          value={tab}
          onChange={(_e, newValue) => {
            const path = `${pathForIdx(newValue)}`
            navigate(path)
          }}
        >
          <Tab label="Basic Report" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <BasicReport />
        </TabPanel>
      </section>
    </>
  )
}

export default QueryExplorer
