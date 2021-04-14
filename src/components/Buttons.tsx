import * as React from "react"
import { Button } from "@material-ui/core"

// TODO - PAB shouldn't allow you to provide variant or color so it's more
// obvious how it works.
// Primary Action Button
export const PAB: typeof Button = ({ ...props }) => {
  return <Button {...props} variant="contained" color="primary" />
}

// Secondary Action Button
export const SAB: typeof Button = ({ ...props }) => {
  return <Button {...props} variant="outlined" color="secondary" />
}
