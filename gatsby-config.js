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

module.exports = {
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    // DEV_SSR: true,
  },
  siteMetadata: {
    title: `Discover the Google Analytics Platform`,
    siteUrl: "https://ga-dev-tools.web.app",
    author: `Google Analytics Developer Relations`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Google Analytics Demos & Tools`,
        short_name: `GA Dev Tools`,
        start_url: `/`,
        icon: "src/images/favicon.png",
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        serialize: ({ path, modifiedGmt }) => {
          return {
            url: path,
            lastmod: modifiedGmt,
          }
        },
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        sitemap: "https://www.example.com/sitemap/sitemap-index.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    `gatsby-plugin-use-query-params`,
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-preload-fonts`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: ["Roboto:400", "Source Code Pro:400"],
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
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
