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
import SyntaxHighlighter from "react-syntax-highlighter"
import { SyntaxHighlighterProps } from "react-syntax-highlighter"
import Paper from "@mui/material/Paper"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import CopyButton from "./CopyButton"

const PREFIX = 'CodeBlock';

const classes = {
  codeBlock: `${PREFIX}-codeBlock`,
  code: `${PREFIX}-code`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`& .${classes.codeBlock}`]: {
    display: "flex",
    padding: theme.spacing(2),
    position: "relative",
    alignItems: "flex-start",
  },

  [`& .${classes.code}`]: {
    "flex-grow": "1",
  }
}));

interface BlockData {
  code: string
  title: string
}

interface CodeBlockProps extends SyntaxHighlighterProps {
  codeBlocks: BlockData[]
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  codeBlocks,
  className,
  ...props
}) => {

  const [selectedTab, setSelectedTab] = React.useState(0)

  return (
    <StyledPaper className={className}>
      <Tabs
        value={selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, newIndex) => setSelectedTab(newIndex)}
      >
        {codeBlocks.map(({ title }) => (
          <Tab key={title} label={title} />
        ))}
      </Tabs>
      {codeBlocks.map(({ code, title }, idx) =>
        idx !== selectedTab ? null : (
          <Paper square key={title} className={classes.codeBlock}>
            <SyntaxHighlighter
              {...props}
              className={classes.code}
              customStyle={{
                background: "unset",
                padding: "unset",
                margin: "unset",
              }}
            >
              {code}
            </SyntaxHighlighter>
            <CopyButton useIconButton toCopy={code} />
          </Paper>
        )
      )}
    </StyledPaper>
  );
}

export default CodeBlock
