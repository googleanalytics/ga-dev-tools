import * as React from "react"
import { Typography, Tabs, Tab, Box } from "@material-ui/core"
import { Url, StorageKey } from "../../../constants"
import { useEffect } from "react"
import BasicReport from "./_BasicReport/_index"
import ExternalLink from "../../../components/ExternalLink"

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

// TODO this should just be a usePersistantNumber hook.
const useTab = (): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [tab, setTab] = React.useState<number>(() => {
    if (typeof window === "undefined") {
      return 0
    }
    let asString = window.localStorage.getItem(StorageKey.ga4RequestComposerTab)
    if (asString === null) {
      return 0
    }
    return parseInt(asString, 10)
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(StorageKey.requestComposerTab, tab.toString())
  }, [tab])

  return [tab, setTab]
}

const QueryExplorer = () => {
  const [tab, setTab] = useTab()
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
            setTab(newValue as any)
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
