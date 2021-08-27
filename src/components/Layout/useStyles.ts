import { Theme, makeStyles } from "@material-ui/core"

const mobile = (theme: Theme) => theme.breakpoints.between(0, "sm")
const notMobile = (theme: Theme) => theme.breakpoints.up("md")

interface UseStylesProps {
  disableNav: true | undefined
}
const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(2),
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  activeLink: {
    fontWeight: "bold",
    color: `${theme.palette.primary.main} !important`,
  },
  toggle: {
    display: "flex",
  },
  loadingIndicator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
    color: theme.palette.getContrastText(theme.palette.grey[200]),
    backgroundColor: theme.palette.grey[200],
  },
  contentWrapper: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2, 4, 0, 4),
    maxWidth: theme.breakpoints.values.md,
    [mobile(theme)]: {
      maxWidth: "unset",
      width: "100%",
      padding: theme.spacing(2),
    },
  },
  header: {
    padding: theme.spacing(4, 4, 2, 4),
    position: "relative",
    maxWidth: theme.breakpoints.values.md,
    [mobile(theme)]: {
      maxWidth: "unset",
      width: "100%",
      padding: theme.spacing(2),
    },
  },
  logoRow: {
    [mobile(theme)]: {
      display: "none",
    },
    [notMobile(theme)]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
    },
  },
  logo: {
    flexGrow: 1,
    height: "50px",
  },
  appBarNav: (props: UseStylesProps) =>
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
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
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

export default useStyles
