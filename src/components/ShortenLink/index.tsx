import { Dispatch } from "@/types"
import * as React from "react"
import { PAB, PlainButton, SAB } from "../Buttons"
import useShortenLink from "./useShortenLink"

interface ShortenLinkProps {
  url: string | undefined
  setShortened: Dispatch<string | undefined>
  setError: Dispatch<string | undefined>
  pab?: boolean
  sab?: boolean
  medium?: boolean
  disabled?: boolean
}

const ShortenLink: React.FC<ShortenLinkProps> = ({
  disabled,
  children = "Shorten link",
  pab,
  sab,
  medium,
  url,
  setShortened,
  setError,
}) => {
  const ButtonComponent = React.useMemo(() => {
    if (pab) {
      return PAB
    }
    if (sab) {
      return SAB
    }
    return PlainButton
  }, [pab, sab])

  const { shorten } = useShortenLink()

  const onClick = React.useCallback(() => {
    if (url === undefined) {
      return
    }
    shorten(url)
      .then(({ shortLink }) => setShortened(shortLink))
      .catch(error => {
        console.error("Error with shortening link", error)
        setError(error.message)
      })
  }, [shorten, url, setShortened, setError])

  return (
    <ButtonComponent
      small={!medium}
      medium={medium}
      onClick={onClick}
      disabled={url === undefined || disabled}
    >
      {children}
    </ButtonComponent>
  )
}

export default ShortenLink
