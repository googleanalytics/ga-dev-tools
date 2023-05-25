import * as React from "react"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import PersonIcon from "@mui/icons-material/Person"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import { UserStatus } from "./useLogin"

interface LoginProps {
  className?: string
  user: gapi.auth2.GoogleUser | undefined
  userStatus: UserStatus
  login: () => void
  logout: () => void
}

const Login: React.FC<LoginProps> = ({
  className,
  user,
  userStatus,
  login,
  logout,
}) => {
  if (userStatus === UserStatus.Pending) {
    return null
  }
  return (
    <Tooltip title={user === undefined ? "Login" : "Logout"}>
      <IconButton
        className={className}
        onClick={user === undefined ? login : logout}
      >
        {user === undefined ? <PersonOutlineIcon /> : <PersonIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default Login
