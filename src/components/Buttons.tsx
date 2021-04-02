import * as React from "react"
import { Button } from "@material-ui/core"

// Primary Action Button
export const PAB: typeof Button = ({ ...props }) => {
  return <Button {...props} variant="contained" color="primary" />
}

// Secondary Action Button
export const SAB: typeof Button = ({ ...props }) => {
  return <Button {...props} variant="outlined" color="secondary" />
}
