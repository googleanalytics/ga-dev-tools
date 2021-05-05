import { usePersistentString } from "@/hooks"
import { StorageKey } from "@/constants"

const useInputs = () => {
  const [search, setSearch] = usePersistentString(
    StorageKey.ga4DimensionsMetricsSearch
  )

  return { search, setSearch }
}

export default useInputs
