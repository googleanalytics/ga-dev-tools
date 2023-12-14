import * as React from "react"
import { useTheme } from "@mui/material"
import {PropsWithChildren} from 'react';

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

type Props = { className?: string }

const InlineCode: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  const theme = useTheme()
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
