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
import Layout from "../../../components/layout"
import QueryExplorer from "./_QueryExplorer"

// TODO - the UA/GA4 toggle should always reflect the type of the demo you are
// on.
//
// TODO - when programically navigated, users should see a toast that let's
// them know what just happened.
//
// TODO - extract out the campaign url tool and make a new page for
// /ga4/campaign-url-builder
//
// TODO - make the campaign id optional for UA demo.
//
// TODO - make the campaign builder match current demo even though the required
// stuff doesn't make sense. You can make the GA4 one be less dumb.
export default ({ location: { pathname } }) => {
  return (
    <Layout title="Query Explorer" requireLogin pathname={pathname}>
      <QueryExplorer />
    </Layout>
  )
}
