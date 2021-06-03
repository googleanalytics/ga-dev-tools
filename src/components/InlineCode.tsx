import * as React from "react"
import { useTheme } from "@material-ui/core"
// import { makeStyles } from "@material-ui/core"

// TODO I'm not sure why, but if I use this makeStyles, it somehow conflicts
// somewhere and messes up formatting during SSR. Good luck to anybody that
// wants to try to chase down this problem. :)
//
// const useStyles = makeStyles(theme => ({
//   code: {
//     backgroundColor: theme.palette.grey[300],
//     color: theme.palette.getContrastText(theme.palette.grey[300]),
//     padding: theme.spacing(0.25, 0.5),
//     borderRadius: theme.spacing(0.25),
//     fontFamily: "'Source Code Pro', monospace",
//   },
// }))

const InlineCode: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const theme = useTheme()
  // const classes = useStyles()
  return (
    <span
      className={className}
      style={{
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.getContrastText(theme.palette.grey[300]),
        padding: theme.spacing(0.25, 0.5),
        borderRadius: theme.spacing(0.25),
        fontFamily: "'Source Code Pro', monospace",
      }}
    >
      {children}
    </span>
  )
}

export default InlineCode
