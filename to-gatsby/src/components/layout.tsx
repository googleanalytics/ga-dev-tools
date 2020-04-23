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
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import { Link } from "gatsby"
import { Home } from "@material-ui/icons"
import classnames from "classnames"
import Logo from "-!svg-react-loader!../images/ga-developer-logo.svg"
import { useLocation } from "@reach/router"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    minHeight: "100%",
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
    [theme.breakpoints.up("md")]: {
      maxWidth: theme.breakpoints.width("md"),
    },
  },
  header: {
    padding: theme.spacing(4),
  },
  nav: {
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
  innerNav: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(4),
  },
  navLinkBackgroundHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.getContrastText(theme.palette.grey[100]),
    },
  },
  home: {
    margin: "unset",
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  subHeading: {
    width: "100%",
    borderTop: `1px solid ${theme.palette.grey[600]}`,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
  },
  homeIcon: {
    marginLeft: theme.spacing(-0.5),
    paddingRight: theme.spacing(1),
    fontSize: "1.5em",
  },
}))

export const usePageView = (
  measurementId: string | undefined = process.env.GA_MEASUREMENT_ID
): { couldMeasure: boolean; retries: number } => {
  const location = useLocation()
  const [retries, setRetries] = React.useState(0)
  const [couldMeasure, setCouldMeasure] = React.useState(false)
  React.useEffect(() => {
    if (measurementId === undefined) {
      throw new Error("No measurementId is set.")
    }
    /**
       Since gtag loads asynchronously, it will sometimes be undefined the first
       time this hook loads. In order to make sure landings are still measured
       (and not double measured), we use `forceRetry` to make this hook run
       again in 50ms. If this doesn't work after 10 tries, we assume gtag is
       unavailable and stop trying to reload it.
     */
    if (window.gtag === undefined && retries < 10) {
      setTimeout(() => {
        setRetries(a => a + 1)
      }, 50)
      return
    }
    if (window.gtag !== undefined) {
      setCouldMeasure(true)
      window.gtag("config", measurementId, {
        page_path: location.pathname,
      })
    }
  }, [location.pathname, measurementId, retries])
  return { couldMeasure, retries }
}

interface LayoutProps {
  title: string
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  usePageView()
  const classes = useStyles()

  const SubHeading: React.FC = React.useCallback(
    ({ children }) => {
      return (
        <li>
          <Typography className={classnames(classes.subHeading)} variant="h6">
            {children}
          </Typography>
        </li>
      )
    },
    [classes.innerNav, classes.subHeading]
  )

  const NavLink: React.FC<{ to: string }> = React.useCallback(
    ({ to, children }) => {
      return (
        <li>
          <Link
            className={classnames(
              classes.innerNav,
              classes.navLinkBackgroundHover
            )}
            to={to}
          >
            {children}
          </Link>
        </li>
      )
    },
    [classes.innerNav, classes.navLinkBackgroundHover]
  )

  return (
    <div className={classes.root}>
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

          <SubHeading>Demos &amp; Tools</SubHeading>
          <NavLink to="/autotrack/">Autotrack</NavLink>
          <NavLink to="/account-explorer/">Account Explorer</NavLink>
          <NavLink to="/campaign-url-builder">Campaign URL Builder</NavLink>
          <NavLink to="/dimensions-metrics-explorer">
            Dimensions &amp; Metrics Explorer
          </NavLink>
          <NavLink to="/embed-api">Embed API</NavLink>
          <NavLink to="/enhanced-ecommerce">Enhanced Ecommerce</NavLink>
          <NavLink to="/hit-builder">Hit Builder</NavLink>
          <NavLink to="/query-explorer">Query Explorer</NavLink>
          <NavLink to="/request-composer">Request Composer</NavLink>
          <NavLink to="/spreadsheet-add-on">Spreadsheet Add-on</NavLink>
          <NavLink to="/tag-assistant">Tag Assistant</NavLink>
          <NavLink to="/usage-trends">Usage Trends</NavLink>

          <SubHeading>Resources</SubHeading>
          <NavLink to="/#about">About this Site</NavLink>
          <NavLink to="/#help">Help &amp; feedback</NavLink>
        </ol>
      </nav>
      <main className={classes.main}>
        <header className={classes.header}>
          {/* TODO - Figure out how to size the logo correctly. I probably want to use media queries with useStyles() */}
          <Logo style={{ width: "100%", height: "50px" }} />
          <Typography variant="h1">{title}</Typography>
        </header>
        <div className={classes.contentWrapper}>
          <section className={classes.content}>{children}</section>
        </div>
      </main>
    </div>
  )
}

export default Layout
