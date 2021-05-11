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
}))

export default useFormStyles
