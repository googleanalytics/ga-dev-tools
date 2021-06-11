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

import Layout from "@/components/Layout"
import EventBuilder from "@/components/ga4/EventBuilder"

export default ({ location: { pathname } }) => {
  return (
    <Layout
      title="Event Builder"
      requireLogin
      pathname={pathname}
      description="The GA4 Event Builder allows you to create, validate, and send events using the GA4 Measurement Protocol."
    >
      <EventBuilder />
    </Layout>
  )
}
