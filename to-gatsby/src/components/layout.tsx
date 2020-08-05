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

import React from "react"
import { makeStyles, Theme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { Link } from "gatsby"
import { Home } from "@material-ui/icons"
import classnames from "classnames"
// TODO - Look into whether or not we can fix this.
// See
// https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
//
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from "-!svg-react-loader!../images/ga-developer-logo.svg"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { navigate } from "@reach/router"
import MenuIcon from "@material-ui/icons/Menu"

import Login, { useLogin } from "./Login"
import { usePageView } from "../hooks"

const mobile = (theme: Theme) => theme.breakpoints.between(0, "sm")
const notMobile = (theme: Theme) => theme.breakpoints.up("md")

const useStyles = makeStyles<any, { disableNav: true | undefined }>(theme => ({
  root: {
    display: "flex",
    minHeight: "100%",
    [notMobile(theme)]: {
      flexDirection: "row",
    },
    [mobile(theme)]: {
      flexDirection: "column",
    },
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100%",
  },
  contentWrapper: {
    flexGrow: 1,
    color: theme.palette.getContrastText(theme.palette.grey[200]),
    backgroundColor: theme.palette.grey[200],
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
    maxWidth: theme.breakpoints.width("md"),
    [mobile(theme)]: {
      maxWidth: "unset",
      width: "100%",
      padding: theme.spacing(2),
    },
  },
  header: {
    padding: theme.spacing(4),
    position: "relative",
    maxWidth: theme.breakpoints.width("md"),
    [mobile(theme)]: {
      maxWidth: "unset",
      width: "100%",
      padding: theme.spacing(2),
    },
  },
  logoRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    [mobile(theme)]: props =>
      props.disableNav
        ? {}
        : {
            display: "none",
          },
  },
  logo: {
    flexGrow: 1,
    height: "50px",
  },
  appBarNav: props =>
    props.disableNav
      ? { display: "none" }
      : {
          [notMobile(theme)]: {
            display: "none",
          },
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: theme.spacing(1),
        },
  mobileNav: {
    color: theme.palette.getContrastText(theme.palette.grey[800]),
    backgroundColor: theme.palette.grey[800],
    minHeight: "100%",
  },
  nav: {
    [mobile(theme)]: {
      display: "none",
    },
    minWidth: "260px",
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    color: theme.palette.getContrastText(theme.palette.grey[800]),
    backgroundColor: theme.palette.grey[800],
    "& ol": {
      margin: 0,
      padding: 0,
      paddingTop: theme.spacing(1),
      listStyle: "none",
      width: "100%",
      "& li": {
        width: "100%",
        display: "flex",
        "& a": {
          color: "unset",
          width: "100%",
          textDecoration: "none",
        },
      },
    },
  },
  noColor: {
    color: "unset",
  },
  innerNav: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    [mobile(theme)]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  navLinkBackgroundHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.getContrastText(theme.palette.grey[100]),
    },
  },
  home: {
    margin: "unset",
    color: "unset",
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    [notMobile(theme)]: {
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },
  subHeading: {
    width: "100%",
    borderTop: `1px solid ${theme.palette.grey[600]}`,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    [mobile(theme)]: {
      paddingLeft: theme.spacing(2),
    },
  },
  homeIcon: {
    marginLeft: theme.spacing(-0.5),
    paddingRight: theme.spacing(1),
    fontSize: "1.5em",
  },
  mobileHeading: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    marginLeft: theme.spacing(1),
  },
  mobileMenu: {
    display: "flex",
    justifyContent: "flex-start",
    flexGrow: 1,
  },
}))

interface LayoutProps {
  requireLogin?: true
  disableNav?: true
  title: string
}

interface Heading {
  type: "heading"
  text: string
}

interface LinkT {
  type: "link"
  text: string
  href: string
}

type LinkData = LinkT | Heading

const linkData: LinkData[] = [
  { text: "Demos & Tools", type: "heading" },
  { text: "Account Explorer", href: "/account-explorer/", type: "link" },
  { text: "Campaign URL Builder", href: "/campaign-url-builder", type: "link" },
  {
    text: "Dimensions & Metrics Explorer",
    href: "/dimensions-metrics-explorer",
    type: "link",
  },
  { text: "Enhanced Ecommerce", href: "/enhanced-ecommerce", type: "link" },
  { text: "Hit Builder", href: "/hit-builder", type: "link" },
  { text: "Query Explorer", href: "/query-explorer", type: "link" },
  { text: "Request Composer", href: "/request-composer", type: "link" },
  { text: "Spreadsheet Add-on", href: "/spreadsheet-add-on", type: "link" },
  { text: "Tag Assistant", href: "/tag-assistant", type: "link" },
  { text: "Usage Trends", href: "/usage-trends", type: "link" },
  { text: "Resources", type: "heading" },
  { text: "About this Site", href: "/#about", type: "link" },
  { text: "Help & feedback", href: "/#help", type: "link" },
]

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  disableNav,
  requireLogin,
}) => {
  usePageView()
  const classes = useStyles({ disableNav })
  const [open, setOpen] = React.useState(false)
  const { user, loginLogout } = useLogin()

  const showContent = requireLogin ? user?.isSignedIn() : true

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBarNav}>
        <IconButton
          edge="start"
          onClick={() => setOpen(true)}
          className={classes.mobileMenu}
        >
          <MenuIcon />
          <Typography variant="h6" className={classes.mobileHeading}>
            GA Demos & Tools
          </Typography>
        </IconButton>
        <Login />
        <Drawer open={open} onClose={() => setOpen(false)}>
          <List className={classes.mobileNav}>
            <Link to="/" className={classes.noColor}>
              <Typography
                className={classnames(classes.innerNav, classes.home)}
                variant="h2"
              >
                <Home className={classes.homeIcon} /> Home
              </Typography>
            </Link>
            {linkData.map(linkData => {
              if (linkData.type === "heading") {
                return (
                  <Typography
                    key={linkData.text}
                    className={classnames(classes.subHeading, classes.innerNav)}
                    variant="h6"
                  >
                    {linkData.text}
                  </Typography>
                )
              }
              return (
                <ListItem
                  button
                  key={linkData.text}
                  className={classes.innerNav}
                  onClick={() => {
                    setOpen(false)
                    navigate(linkData.href)
                  }}
                >
                  {linkData.text}
                </ListItem>
              )
            })}
          </List>
        </Drawer>
      </AppBar>
      <nav className={classes.nav}>
        <ol>
          <li>
            <Link to="/">
              <Typography
                className={classnames(classes.innerNav, classes.home)}
                variant="h2"
              >
                <Home className={classes.homeIcon} /> Home
              </Typography>
            </Link>
          </li>
          {linkData.map(linkData => {
            if (linkData.type === "heading") {
              return (
                <li key={linkData.text}>
                  <Typography
                    className={classnames(classes.subHeading)}
                    variant="h6"
                  >
                    {linkData.text}
                  </Typography>
                </li>
              )
            }
            return (
              <li key={linkData.text}>
                <Link
                  className={classnames(
                    classes.innerNav,
                    classes.navLinkBackgroundHover
                  )}
                  to={linkData.href}
                >
                  {linkData.text}
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>
      <main className={classes.main}>
        <header className={classes.header}>
          {/* TODO - Figure out how to size the logo correctly. I probably want to use media queries with useStyles() */}
          <div className={classes.logoRow}>
            <Logo className={classes.logo} />
            {!disableNav && <Login />}
          </div>
          <Typography variant="h1">{title}</Typography>
        </header>
        <div className={classes.contentWrapper}>
          <section className={classes.content}>
            {showContent ? (
              children
            ) : (
              <div>
                <Typography>
                  You must be logged in with Google for this demo.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={loginLogout}
                >
                  Login
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Layout
