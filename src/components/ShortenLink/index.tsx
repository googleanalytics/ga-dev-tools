import { Dispatch } from "@/types"
import * as React from "react"
import { PAB, PlainButton, SAB } from "../Buttons"
import useShortenLink from "./useShortenLink"

interface ShortenLinkProps {
  url: string
  setShortened: Dispatch<string>
  pab?: boolean
  sab?: boolean
}

const ShortenLink: React.FC<ShortenLinkProps> = ({
  children,
  pab,
  sab,
  url,
  setShortened,
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
    shorten(url).then(({ shortLink }) => setShortened(shortLink))
  }, [shorten, url, setShortened])

  return (
    <ButtonComponent small onClick={onClick}>
      {children}
    </ButtonComponent>
  )
}

export default ShortenLink
