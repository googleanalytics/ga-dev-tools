// function getMetricsAndDimensionsOptions(account, property, view) {
//   return Promise.all([
//     getMetrics(account, property, view),
//     getDimensions(account, property, view),
//   ])
//       .then(function(data) {
//         const metrics = data[0].map(function(metric) {
//           return {
//             id: metric.id,
//             name: metric.attributes.uiName,
//             group: metric.attributes.group,
//           };
//         });
//         const dimensions = data[1].map(function(dimension) {
//           return {
//             id: dimension.id,
//             name: dimension.attributes.uiName,
//             group: dimension.attributes.group,
//           };
//         });
//         return {metrics, dimensions};
//       });
// }

// function getMetrics(account, property, view) {
//   return metadata.getAuthenticated(account, property, view).then((columns) => {
//     return columns.allMetrics((metric, id) => {
//       const isPublicV3Metric = metric.status == 'PUBLIC' &&
//           metric.addedInApiVersion == '3';
//       // TODO(philipwalton): remove this temporary exclusion once
//       // caclulated metrics can be templatized using the Management API.
//       const isNotCalculatedMetric = id != 'ga:calcMetric_<NAME>';
//       // TODO(philipwalton): remove this temporary inclusion once the new
//       // ga:uniqueEvents metric is no longer listed as deprecated in the API.
//       const isUniqueEvents = id == 'ga:uniqueEvents';
//       if (isUniqueEvents) metric.uiName = 'Unique Events';

//       return (isPublicV3Metric && isNotCalculatedMetric) || isUniqueEvents;
//     });
//   });
// }
// function getDimensions(account, property, view) {
//   return metadata.getAuthenticated(account, property, view).then((columns) => {
//     return columns.allDimensions({
//       status: 'PUBLIC',
//       addedInApiVersion: '3',
//     });
//   });
// }

import { useState, useEffect } from "react"
import { HasView } from "../../components/ViewSelector"
import { useApi, Column } from "../../api"

//
interface UseQueryExplorer {
  metrics: Column[]
  dimensions: Column[]
}
const useQueryExplorer = (view: HasView): UseQueryExplorer => {
  const api = useApi()
  const [metrics, setMetrics] = useState<Column[] | undefined>(undefined)
  const [dimensions, setDimensions] = useState<Column[] | undefined>(undefined)

  useEffect(() => {
    if (api === undefined) {
      return
    }
    // TODO - This should be updated to also return custom metrics &
    // dimensions.
    // TODO These values should be cached in localStorage keyed by view.
    api.metadata.columns.list({ reportType: "ga" }).then(response => {
      const columns = response.result.items
      if (columns === undefined) {
        return
      }
      const ms = columns.filter(column => column.attributes?.type === "METRIC")
      const ds = columns.filter(
        column => column.attributes?.type === "DIMENSION"
      )
      setMetrics(ms)
      setDimensions(ds)
    })
  }, [view, api])

  return { metrics, dimensions }
}

export default useQueryExplorer
