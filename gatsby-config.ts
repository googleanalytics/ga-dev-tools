import type { GatsbyConfig } from "gatsby";

// @ts-ignore
const config: GatsbyConfig = {
  siteMetadata: {
    title: `Discover the Google Analytics Platform`,
    siteUrl: "https://ga-dev-tools.google",
    author: `Google Analytics Developer Relations`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data`,
      },
    },
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
        serialize: ({path, modifiedGmt } : {path:string,
          modifiedGmt:string}) => {
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
    `gatsby-transformer-json`,
    `gatsby-plugin-emotion`
  ]
};

export default config;
