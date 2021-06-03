import { makeStyles } from "@material-ui/core"

const useFormStyles = makeStyles(theme => ({
  form: {
    maxWidth: "80ch",
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  buttonRow: {
    display: "flex",
    "&> *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  trashRow: {
    display: "flex",
    alignItems: "center",
    "&> :not(:first-child)": {
      flexGrow: 1,
    },
  },
  verticleHr: {
    display: "flex",
    "&> hr": {
      marginRight: theme.spacing(1),
    },
    "&> :not(:first-child)": {
      flexGrow: 1,
    },
  },
  grow: {
    flexGrow: 1,
  },
  forceRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
}))

export default useFormStyles
