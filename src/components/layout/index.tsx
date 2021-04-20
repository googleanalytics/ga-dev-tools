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

import React, { useMemo } from "react"
import Button from "@material-ui/core/Button"
import { Link } from "gatsby"
import { Home } from "@material-ui/icons"
import classnames from "classnames"
// TODO - Look into whether or not we can fix this.
// See
// https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
//
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from "-!svg-react-loader!../../images/ga-developer-logo.svg"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import { navigate } from "@reach/router"
import MenuIcon from "@material-ui/icons/Menu"
import { Switch, Grid, Typography } from "@material-ui/core"

import Login, { useLogin, UserStatus } from "../Login"
import { useGAVersion } from "../../hooks"
import { GAVersion } from "../../constants"
import Spinner from "../Spinner"
import { linkData } from "./links"
import { useStyles } from "./use-styles"
import UADemo from "./UADemo"

interface LayoutProps {
  requireLogin?: true
  disableNav?: true
  title: string
  pathname: string
}

const GA4Toggle: React.FC<{
  gaVersion: GAVersion
  setGAVersion: (version: GAVersion) => void
}> = ({ setGAVersion, gaVersion }) => {
  return (
    <Grid component="label" container alignItems="center" spacing={1}>
      <Grid item>UA</Grid>
      <Grid item>
        <Switch
          checked={gaVersion === GAVersion.GoogleAnalytics4}
          onChange={e => {
            if (e.target.checked === true) {
              setGAVersion(GAVersion.GoogleAnalytics4)
            } else {
              setGAVersion(GAVersion.UniversalAnalytics)
            }
          }}
          name="use GA4"
          color="primary"
        />
      </Grid>
      <Grid item>GA4</Grid>
    </Grid>
  )
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  disableNav,
  requireLogin,
  pathname,
}) => {
  const { gaVersion, setGAVersion } = useGAVersion(pathname)
  const classes = useStyles({ disableNav })
  const [open, setOpen] = React.useState(false)
  const { userStatus, loginLogout } = useLogin()

  const links = useMemo(() => {
    return linkData.filter(linkData =>
      linkData.versions.find(version => version === gaVersion)
    )
  }, [gaVersion])

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
            {links.map(linkData => {
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
              if (linkData.type === "ga4toggle") {
                return (
                  <li key={linkData.type} className={classes.innerNav}>
                    <GA4Toggle
                      setGAVersion={setGAVersion}
                      gaVersion={gaVersion}
                    />
                  </li>
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
          {links.map(linkData => {
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
            if (linkData.type === "ga4toggle") {
              return (
                <li key={linkData.type} className={classes.innerNav}>
                  <GA4Toggle
                    setGAVersion={setGAVersion}
                    gaVersion={gaVersion}
                  />
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
          <div className={classes.logoRow}>
            <Logo className={classes.logo} />
            {!disableNav && <Login />}
          </div>
          <Typography variant="h1">{title}</Typography>
        </header>
        <div className={classes.contentWrapper}>
          <UADemo pathname={pathname} />
          <section className={classes.content}>
            {!requireLogin || userStatus === UserStatus.SignedIn ? (
              children
            ) : userStatus === UserStatus.SignedOut ? (
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
            ) : (
              <Spinner>
                <Typography>Checking if you're logged in&hellip;</Typography>
              </Spinner>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Layout