import * as React from "react"
import PersonOutlineIcon from "@material-ui/icons/PersonOutline"
import PersonIcon from "@material-ui/icons/Person"
import { useSelector } from "react-redux"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"
import classnames from "classnames"

const useStyles = makeStyles(theme => ({
  login: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}))

interface LoginProps {
  className?: string
}

const Login: React.FC<LoginProps> = ({ className }) => {
  const classes = useStyles()
  const user = useSelector((state: AppState) => state.user)
  const gapi = useSelector((state: AppState) => state.gapi)
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )

  const login = React.useCallback(() => {
    if (gapi === undefined) {
      return setAnchorElement(null)
    }
    setAnchorElement(null)
  }, [gapi])

  const logout = React.useCallback(() => {
    if (gapi === undefined) {
      return setAnchorElement(null)
    }
    setAnchorElement(null)
  }, [gapi])

  const showMenu = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // This is broken right now???, uncomment and remove login logic after it's fixed.
      /* setAnchorElement(e.currentTarget) */
      if (gapi !== undefined) {
        if (user !== undefined) {
          gapi.auth2.getAuthInstance().signOut()
        } else {
          gapi.auth2.getAuthInstance().signIn()
        }
      }
    },
    [gapi, user]
  )

  return (
    <div className={classnames(className)} onClick={showMenu}>
      {user === undefined ? (
        <PersonOutlineIcon className={classes.login} />
      ) : (
        <PersonIcon className={classes.login} />
      )}
      <Menu
        open={!!anchorElement}
        anchorEl={anchorElement}
        onClose={() => {
          console.log("being called at all")
          setAnchorElement(null)
        }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
        <MenuItem onClick={login}>Login</MenuItem>
      </Menu>
    </div>
  )
}

export default Login
