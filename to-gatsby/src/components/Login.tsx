import * as React from "react"
import PersonOutlineIcon from "@material-ui/icons/PersonOutline"
import PersonIcon from "@material-ui/icons/Person"
import { useSelector } from "react-redux"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"

interface LoginProps {
  className?: string
}

export enum UserStatus {
  SignedIn,
  SignedOut,
  Pending,
}

export const useLogin = () => {
  const user = useSelector((state: AppState) => state.user)
  const gapi = useSelector((state: AppState) => state.gapi)
  const [userStatus, setUserStatus] = React.useState<UserStatus>(
    UserStatus.Pending
  )

  React.useEffect(() => {
    if (gapi === undefined) {
      return
    }
    gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
      setUserStatus(signedIn ? UserStatus.SignedIn : UserStatus.SignedOut)
    })
    gapi.auth2.getAuthInstance().isSignedIn.get()
      ? setUserStatus(UserStatus.SignedIn)
      : setUserStatus(UserStatus.SignedOut)
  }, [gapi])

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

  return { user, loginLogout, userStatus }
}

const Login: React.FC<LoginProps> = ({ className }) => {
  const { user, loginLogout, userStatus } = useLogin()
  if (userStatus === UserStatus.Pending) {
    return null
  }
  return (
    <Tooltip title={user === undefined ? "Login" : "Logout"}>
      <IconButton className={className} onClick={loginLogout}>
        {user === undefined ? <PersonOutlineIcon /> : <PersonIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default Login
