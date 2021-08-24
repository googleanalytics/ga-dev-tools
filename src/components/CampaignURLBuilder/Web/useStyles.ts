import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles(theme => ({
  generatedInput: {
    wordBreak: "break-all",
  },
  denseTableCell: {
    whiteSpace: "nowrap",
    "& p": {
      paddingBottom: theme.spacing(0.5),
    },
  },
  buttons: {
    display: "flex",
    "& > button": {
      margin: theme.spacing(1),
    },
  },
  shortened: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    "& > :first-child": {
      flexGrow: 1,
    },
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
    maxWidth: "600px",
  },
  bold: {
    fontWeight: "bold",
  },
  share: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  shareInvalid: {
    display: "flex",
    flexDirection: "row",
    paddingTop: theme.spacing(3),
    alignItems: "center",
    "& svg": {
      marginRight: theme.spacing(2),
    },
    "& p": {
      paddingBottom: "unset",
    },
  },
}))

export default useStyles
