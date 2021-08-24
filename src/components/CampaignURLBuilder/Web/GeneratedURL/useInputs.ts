import { useState } from "react"

const useInputs = () => {
  const [useFragment, setUseFragment] = useState(false)
  const [shortened, setShortened] = useState<string>()
  const [shortenError, setShortenError] = useState<string>()
  const [hasWarning, setHasWarning] = useState(false)

  return {
    useFragment,
    setUseFragment,
    shortened,
    setShortened,
    shortenError,
    setShortenError,
    hasWarning,
    setHasWarning,
  }
}

export default useInputs
