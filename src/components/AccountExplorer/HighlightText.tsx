import * as React from "react"

interface HighlightTextProps {
  text: string
  search?: string
  className?: string
}
const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  search,
  className,
}) => {
  if (search === undefined) {
    return <>{text}</>
  }
  const match = new RegExp(`(${search})`, "gi")
  const matchArray = text.match(match)
  if (matchArray === null) {
    return <>{text}</>
  }

  const matchedText = matchArray[0]
  const index = text.indexOf(matchedText)
  const beginning = text.substring(0, index)
  const middle = text.substring(index, index + matchedText.length)
  const end = text.substring(index + matchedText.length)
  return (
    <>
      {beginning}
      <mark className={className}>{middle}</mark>
      {end}
    </>
  )
}
export default HighlightText
