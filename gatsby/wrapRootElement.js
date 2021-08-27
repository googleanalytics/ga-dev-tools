import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core"
import { createTheme, withStyles } from "@material-ui/core/styles"
import orange from "@material-ui/core/colors/orange"
import deepOrange from "@material-ui/core/colors/deepOrange"
import Snackbar from "@material-ui/core/Snackbar"
import {
  Provider as ReduxProvider,
  useSelector,
  useDispatch,
} from "react-redux"
import { createStore } from "redux"

const reducer = (state = {}, action) => {
  switch (action.type) {
    case "setUser":
      return { ...state, user: action.user }
    case "setGapi":
      return { ...state, gapi: action.gapi }
    case "setToast":
      return { ...state, toast: action.toast }
    case "gapiStatus":
      return { ...state, gapiStatus: action.status }

    default:
      return state
  }
}

const globalTheme = createTheme({
  palette: {
    primary: orange,
    secondary: deepOrange,
  },
  typography: palette => ({
    fontFamily: ['"Roboto"', "sans-serif"].join(", "),
    h1: {
      fontSize: "3.0em",
    },
    h2: {
      fontSize: "2.25em",
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
    h3: {
      fontSize: "1.75em",
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
    h4: {
      fontSize: "1.50em",
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
    h5: {
      fontSize: "1.25em",
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
  }),
})

const styles = theme => ({
  "@global": {
    "html, body, #gatsby-focus-wrapper, #___gatsby": {
      height: "100%",
      margin: 0,
      padding: 0,
    },
    p: {
      paddingBottom: theme.spacing(2),
    },
    a: {
      color: theme.palette.primary[800],
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    code: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
})

// This is a bit weird, but it's the easiest way to set global css that can use
// values from the theme object.
const MyBaseline = withStyles(styles)(() => {
  return null
})

export const makeStore = () => createStore(reducer)
export const store = makeStore()

const Toaster = () => {
  const toast = useSelector(a => a.toast)
  const dispatch = useDispatch()
  if (toast === undefined) {
    return null
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={toast !== undefined}
      onClose={() => {
        dispatch({ type: "setToast", toast: undefined })
      }}
      autoHideDuration={2000}
      message={toast}
    />
  )
}

export default ({ element }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={globalTheme}>
        <MyBaseline />
        <ReduxProvider store={store}>
          {element}
          <Toaster />
        </ReduxProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}
