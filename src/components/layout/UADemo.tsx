import * as React from "react"
import { useGAVersion } from "../../hooks"
import { GAVersion } from "../../constants"
import { linkData } from "./links"
import Info from "../Info"

interface UADemoProps {
  pathname: string
}

const UADemo: React.FC<UADemoProps> = ({ pathname }) => {
  const { gaVersion } = useGAVersion(pathname)
  if (gaVersion === GAVersion.UniversalAnalytics || pathname === "/") {
    return null
  }
  const supportsGA4 =
    linkData.find(link => {
      if (link.type !== "link") {
        return false
      }
      if (link.href !== pathname) {
        return false
      }
      return link.versions.includes(gaVersion)
    }) !== undefined

  if (supportsGA4) {
    return null
  }

  return <Info>You're viewing a demo for Universal Analytics.</Info>
}

export default UADemo
