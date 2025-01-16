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

import React, {PropsWithChildren, useEffect, useMemo} from "react"
import {Theme} from '@mui/material/styles';
import {styled} from '@mui/material/styles';

import Button from '@mui/material/Button';
import { Link } from "gatsby"
import { Home } from "@mui/icons-material"
import clsx from "classnames"
import { Helmet } from "react-helmet"
// TODO - Look into whether or not we can fix this.
// See
// https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
//
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from "-!svg-react-loader!../../images/ga-developer-logo.svg"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import { navigate } from "@reach/router"
import MenuIcon from "@mui/icons-material/Menu"
import Typography from "@mui/material/Typography"

import Login from "./Login"
import { useGAVersion } from "../../hooks"
import { GAVersion, Url } from "../../constants"
import Spinner from "../Spinner"
import { linkData } from "./links"
import GA4Toggle from "./GA4Toggle"
import BugReport from "./BugReport"
import Loadable from "../Loadable"
import useLogin2, { UserStatus } from "./useLogin"
import usePageView from "@/hooks/usePageView"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "../ErrorFallback"



const notMobile = (theme: Theme) => theme.breakpoints.up("md")
const mobile = (theme: Theme) => theme.breakpoints.between(0, "sm")

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

const PREFIX = 'Layout2';

const classes = {
  footer: `${PREFIX}-footer`,
  activeLink: `${PREFIX}-activeLink`,
  toggle: `${PREFIX}-toggle`,
  loadingIndicator: `${PREFIX}-loadingIndicator`,
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  logoRow: `${PREFIX}-logoRow`,
  logo: `${PREFIX}-logo`,
  appBarNav: `${PREFIX}-appBarNav`,
  mobileNav: `${PREFIX}-mobileNav`,
  nav: `${PREFIX}-nav`,
  noColor: `${PREFIX}-noColor`,
  innerNav: `${PREFIX}-innerNav`,
  navLinkBackgroundHover: `${PREFIX}-navLinkBackgroundHover`,
  home: `${PREFIX}-home`,
  subHeading: `${PREFIX}-subHeading`,
  homeIcon: `${PREFIX}-homeIcon`,
  mobileHeading: `${PREFIX}-mobileHeading`,
  mobileMenu: `${PREFIX}-mobileMenu`
};


const Template: React.FC<PropsWithChildren<LayoutProps & TemplateProps>> = ({
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

  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    //const timeout = setTimeout(() => {
    // Redirect to the new domain while preserving the path.
    if( window.location.hostname.indexOf('web.app') !== -1 ) {
      const newHostname = window.location.hostname.replace('web.app', 'google');
      const newLocation =  window.location.href.replace( window.location.hostname, newHostname );
      window.location.replace(newLocation);
    }
    //}, 1000);

    return;
  }, []);

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
          <link rel="canonical" href="https://ga-dev-tools.google/" />
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
          <div  />
          <footer className={classes.footer}>
            <a href={Url.termsOfService}>Terms of service</a>
            <a href={Url.privacyPolicy}>Privacy policy</a>
            <BugReport />
          </footer>
        </main>
      </div>
  )
}

const StyledTemplate = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.footer}`]: {
    padding: theme.spacing(2),
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.activeLink}`]: {
    fontWeight: "bold",
    color: `${theme.palette.primary.main} !important`,
  },

  [`& .${classes.toggle}`]: {
    display: "flex",
  },

  [`& .${classes.loadingIndicator}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  [`& .${classes.root}`]: {
    display: "flex",
    minHeight: "100%",
    [notMobile(theme)]: {
      flexDirection: "row",
    },
    [mobile(theme)]: {
      flexDirection: "column",
    },
  },

  [`& .${classes.main}`]: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100%",
    color: theme.palette.getContrastText(theme.palette.grey[200]),
    backgroundColor: theme.palette.grey[200],
  },

  [`& .${classes.contentWrapper}`]: {
    flexGrow: 1,
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: theme.spacing(2, 4, 0, 4),
    maxWidth: theme.breakpoints.values.md,
    [mobile(theme)]: {
      maxWidth: "unset",
      width: "100%",
      padding: theme.spacing(2),
    },
  },

  [`& .${classes.header}`]: {
    padding: theme.spacing(4, 4, 2, 4),
    position: "relative",
    maxWidth: theme.breakpoints.values.md,
    [mobile(theme)]: {
      maxWidth: "unset",
      width: "100%",
      padding: theme.spacing(2),
    },
  },

  [`& .${classes.logoRow}`]: {
    [mobile(theme)]: {
      display: "none",
    },
    [notMobile(theme)]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
    },
  },

  [`& .${classes.logo}`]: {
    flexGrow: 1,
    height: "50px",
  },

  [`& .${classes.appBarNav}`]: {

    [theme.breakpoints.up("md")]:
        {
          display: "none",
        },
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: theme.spacing(1),
          },

  [`& .${classes.mobileNav}`]: {
    color: theme.palette.getContrastText(theme.palette.grey[800]),
    backgroundColor: theme.palette.grey[800],
    minHeight: "100%",
  },

  [`& .${classes.nav}`]: {
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

  [`& .${classes.noColor}`]: {
    color: "unset",
  },

  [`& .${classes.innerNav}`]: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    [mobile(theme)]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },

  [`& .${classes.navLinkBackgroundHover}`]: {
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.getContrastText(theme.palette.grey[100]),
    },
  },

  [`& .${classes.home}`]: {
    margin: "unset",
    color: "unset",
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    [notMobile(theme)]: {
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
  },

  [`& .${classes.subHeading}`]: {
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

  [`& .${classes.homeIcon}`]: {
    marginLeft: theme.spacing(-0.5),
    paddingRight: theme.spacing(1),
    fontSize: "1.5em",
  },

  [`& .${classes.mobileHeading}`]: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.mobileMenu}`]: {
    display: "flex",
    justifyContent: "flex-start",
    flexGrow: 1,
  }
 }));

const Layout2: React.FC<PropsWithChildren<LayoutProps>> = props => {
  const request = useLogin2()
  return (
    <Loadable
      request={request}
      renderNotStarted={() =>  <StyledTemplate><Template {...props} notStarted /></StyledTemplate>}
      renderInProgress={() =>  <StyledTemplate><Template {...props} inProgress /></StyledTemplate>}
      renderSuccessful={successProps => (
          <StyledTemplate><Template {...props} {...successProps} successful /></StyledTemplate>
      )}
      renderFailed={() => <Template {...props} failed />}
    />
  );
}

export default Layout2
