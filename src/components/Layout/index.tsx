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
import clsx from "classnames"
import { Helmet } from "react-helmet"
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
import Typography from "@material-ui/core/Typography"

import Login from "./Login"
import { useGAVersion } from "../../hooks"
import { GAVersion, Url } from "../../constants"
import Spinner from "../Spinner"
import { linkData } from "./links"
import useStyles from "./useStyles"
import GA4Toggle from "./GA4Toggle"
import BugReport from "./BugReport"
import useFormStyles from "@/hooks/useFormStyles"
import Loadable from "../Loadable"
import useLogin2, { UserStatus } from "./useLogin"
import usePageView from "@/hooks/usePageView"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "../ErrorFallback"

interface LayoutProps {
  requireLogin?: true
  disableNav?: true
  title: string
  description: string
  pathname: string
}

interface TemplateProps {
  notStarted?: boolean
  inProgress?: boolean
  successful?: boolean
  failed?: boolean
  userStatus?: UserStatus
  login?: () => void
  logout?: () => void
  user?: gapi.auth2.GoogleUser
}

const Template: React.FC<LayoutProps & TemplateProps> = ({
  pathname,
  description,
  disableNav,
  requireLogin,
  title,
  children,
  inProgress,
  notStarted,
  successful,
  failed,
  userStatus,
  login,
  logout,
  user,
}) => {
  usePageView(title)
  const { gaVersion, setGAVersion } = useGAVersion(pathname)
  const classes = useStyles({ disableNav })
  const formClasses = useFormStyles()
  const [open, setOpen] = React.useState(false)

  const links = useMemo(() => {
    return linkData.filter(linkData =>
      linkData.versions.find(version => version === gaVersion)
    )
  }, [gaVersion])

  const tryResetApp = React.useCallback(() => {
    // Often issues are related to bad data in localstorage, try clearing it to
    // see if that helps.
    window.localStorage.clear()
  }, [])

  return (
    <div className={classes.root}>
      <Helmet
        htmlAttributes={{
          lang: "en",
        }}
      >
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <title>{title}</title>
      </Helmet>
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
        <BugReport />
        {successful && (
          <Login
            user={user!}
            login={login!}
            logout={logout!}
            userStatus={userStatus!}
          />
        )}
        <Drawer open={open} onClose={() => setOpen(false)}>
          <List className={classes.mobileNav}>
            <Link
              to={gaVersion === GAVersion.UniversalAnalytics ? "/" : "/ga4/"}
              className={classes.noColor}
            >
              <Typography
                className={clsx(classes.innerNav, classes.home)}
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
                    className={clsx(classes.subHeading, classes.innerNav)}
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
            <Link
              to={gaVersion === GAVersion.UniversalAnalytics ? "/" : "/ga4/"}
            >
              <Typography
                className={clsx(classes.innerNav, classes.home)}
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
                  <Typography className={clsx(classes.subHeading)} variant="h6">
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
                  className={clsx(
                    classes.innerNav,
                    classes.navLinkBackgroundHover,
                    {
                      [classes.activeLink]:
                        pathname === linkData.href ||
                        pathname.startsWith(linkData.href),
                    }
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
            <BugReport />
            {!disableNav && successful && (
              <Login
                user={user!}
                login={login!}
                logout={logout!}
                userStatus={userStatus!}
              />
            )}
          </div>
          <Typography variant="h1">{title}</Typography>
        </header>
        <div className={classes.contentWrapper}>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={tryResetApp}
          >
            <section className={classes.content}>
              {requireLogin && (inProgress || notStarted) && (
                <Spinner ellipses>Checking if you're logged in</Spinner>
              )}
              {requireLogin &&
                successful &&
                (userStatus === UserStatus.SignedIn ? (
                  children
                ) : (
                  <div>
                    <Typography>
                      You must be logged in with Google for this demo.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={login}>
                      Login
                    </Button>
                  </div>
                ))}
              {requireLogin && failed && (
                <Typography>
                  Login status could not be determined. Please ensure cookies
                  are enabled.
                </Typography>
              )}
              {!requireLogin && children}
            </section>
          </ErrorBoundary>
        </div>
        <div className={formClasses.grow} />
        <footer className={classes.footer}>
          <a href={Url.termsOfService}>Terms of service</a>
          <a href={Url.privacyPolicy}>Privacy policy</a>
          <BugReport />
        </footer>
      </main>
    </div>
  )
}

const Layout2: React.FC<LayoutProps> = props => {
  const request = useLogin2()
  return (
    <Loadable
      request={request}
      renderNotStarted={() => <Template {...props} notStarted />}
      renderInProgress={() => <Template {...props} inProgress />}
      renderSuccessful={successProps => (
        <Template {...props} {...successProps} successful />
      )}
      renderFailed={() => <Template {...props} failed />}
    />
  )
}

export default Layout2
