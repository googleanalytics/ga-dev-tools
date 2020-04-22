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

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

if (process.env.GA_MEASUREMENT_ID === undefined && process.env.gatsby_executing_command !== 'serve') {
  throw new Error("GA_MEASUREMENT_ID environment variable must be set.")
}

module.exports = {
  siteMetadata: {
    title: `Discover the Google Analytics Platform`,
    description: ``,
    author: `Google Analytics Developer Relations`,
  },
  plugins: [
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Roboto`,
            variants: [`400`],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-react-svg`,
      options: {
        rule: {
          include: `${__dirname}/src/images`,
        },
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
}
