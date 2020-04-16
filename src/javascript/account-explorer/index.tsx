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

import * as React from "react";
import * as ReactDOM from "react-dom";
import AccountExplorer from "./components/AccountExplorer";
import {
  ThemeProvider,
  createMuiTheme,
  responsiveFontSizes,
} from "@material-ui/core/styles";

// I guessed at the factor, but this seems to be about right. We don't need huge
// headings which is what you get with a factor of 2 (the default).
const theme = responsiveFontSizes(createMuiTheme(), { factor: 5 });

function render() {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <AccountExplorer />
    </ThemeProvider>,
    document.getElementById("account-explorer-react")
  );
}

render();
