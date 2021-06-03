import { useSelector } from "react-redux"

export default () => {
  const gapi = useSelector((state: AppState) => state.gapi)
  return gapi
}
