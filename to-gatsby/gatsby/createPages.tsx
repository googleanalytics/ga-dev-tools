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

import path from "path"
import axios from "axios"

interface Actions {
  createRedirect: (options: {
    fromPath: string
    toPath: string
    isPermanent: boolean
    redirectInBrowser: boolean
  }) => void
  createPage: (page: {
    path: string
    matchPath?: string
    component: string
    context?: {}
  }) => void
}

type From = string
type To = string
type RedirectMap = [From, To]
const redirects: RedirectMap[] = [
  [`/polymer-elements/`, `/`],
  [`/polymer-elements`, `/`],
  [`/autotrack/`, `/`],
  [`/autotrack`, `/`],
  [`/embed-api/`, `/`],
  [`/embed-api`, `/`],
]

export const createPages = async ({ actions }) => {
  const { createRedirect, createPage }: Actions = actions

  redirects.forEach(([from, to]) => {
    console.info(`Creating redirect from: ${from} to: ${to}`)
    createRedirect({
      fromPath: from,
      toPath: to,
      isPermanent: true,
      redirectInBrowser: true,
    })
  })

  const {
    data: { items },
  } = await axios.get(
    "https://www.googleapis.com/analytics/v3/metadata/ga/columns"
  )
  // Group items by "group"
  const byGroup = items.reduce((acc, item) => {
    const groupName = item.attributes.group
    const inGroup = acc[groupName] || []
    inGroup.push(item)
    return { ...acc, [groupName]: inGroup }
  }, {})

  Object.entries(byGroup).forEach(([groupName, items]) => {
    const slugName = groupName.replace(/ /g, "-").toLowerCase()
    const slug = `/dimensions-metrics-explorer/${slugName}`
    console.info(`Creating page at slug: ${slug}`)

    createPage({
      path: slug,
      component: path.resolve(
        `${__dirname}/../src/pages/dimensions-metrics-explorer/_GroupInfoTemplate.tsx`
      ),
      context: {
        groupName,
        items,
      },
    })
  })
}
