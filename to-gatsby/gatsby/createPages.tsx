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

interface Actions {
  createRedirect: (options: {
    fromPath: string
    toPath: string
    isPermanent: boolean
    redirectInBrowser: boolean
  }) => void
}

type From = string
type To = string
type RedirectMap = [From, To]
const redirects: RedirectMap[] = [[`/polymer-elements`, `/`]]

export const createPages = async ({ actions }) => {
  const { createRedirect }: Actions = actions

  redirects.forEach(([from, to]) => {
    console.info(`Creating redirect from: ${from} to: ${to}`)
    createRedirect({
      fromPath: `/polymer-elements`,
      toPath: `/`,
      isPermanent: true,
      redirectInBrowser: true,
    })
  })
}
