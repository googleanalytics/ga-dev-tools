import * as React from "react"
import PersonOutlineIcon from "@material-ui/icons/PersonOutline"
import PersonIcon from "@material-ui/icons/Person"
import { useSelector } from "react-redux"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"

interface LoginProps {
  className?: string
}

const Login: React.FC<LoginProps> = ({ className }) => {
  const user = useSelector((state: AppState) => state.user)
  const gapi = useSelector((state: AppState) => state.gapi)

  const loginLogout = React.useCallback(() => {
    if (gapi === undefined) {
      return
    }
    if (user === undefined) {
      gapi.auth2.getAuthInstance().signIn()
    } else {
      gapi.auth2.getAuthInstance().signOut()
    }
  }, [gapi, user])

  return (
    <Tooltip title={user === undefined ? "Login" : "Logout"}>
      <IconButton className={className} onClick={loginLogout}>
        {user === undefined ? <PersonOutlineIcon /> : <PersonIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default Login
