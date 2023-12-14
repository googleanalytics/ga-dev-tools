import * as React from "react"

import Box from "@mui/material/Box"
import {PropsWithChildren} from 'react';

interface TabPanelProps {
  value: number
  index: number
}

const TabPanel: React.FC<PropsWithChildren<TabPanelProps>> = ({ value, index, children }) => {
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

export default TabPanel
