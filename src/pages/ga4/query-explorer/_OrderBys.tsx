import * as React from "react"
import clsx from "classnames"
import { Dispatch } from "../../../types"
import { Typography, makeStyles } from "@material-ui/core"
import { SAB, TooltipIconButton } from "../../../components/Buttons"
import { Delete } from "@material-ui/icons"
import Select, { SelectOption } from "../../../components/Select"
import {
  MetricPicker,
  GA4Metric,
  GA4Dimension,
  DimensionPicker,
  GA4Dimensions,
  GA4Metrics,
} from "../../../components/GA4Pickers"

type OrderBy = gapi.client.analyticsdata.OrderBy

enum Direction {
  Ascending = "ascending",
  Descending = "descending",
}

type UseOrderBys = (arg: {
  setOrderBys: Dispatch<OrderBy[] | undefined>
}) => {
  addOrderBy: (type: "pivot" | "dimension" | "metric") => void
  removeOrderBy: (id: number) => void
  setDirection: (id: number, direction: Direction) => void
  setMetric: (id: number, m: GA4Metric | undefined) => void
  setDimension: (id: number, d: GA4Dimension | undefined) => void
}
const useOrderBys: UseOrderBys = ({ setOrderBys }) => {
  const removeOrderBy: ReturnType<
    UseOrderBys
  >["removeOrderBy"] = React.useCallback(
    id => {
      setOrderBys((old = []) => old.filter((_, idx) => idx !== id))
    },
    [setOrderBys]
  )

  const addOrderBy: ReturnType<UseOrderBys>["addOrderBy"] = React.useCallback(
    type => {
      setOrderBys((old = []) => old.concat([{ [type]: {} }]))
    },
    [setOrderBys]
  )

  const setMetric: ReturnType<UseOrderBys>["setMetric"] = React.useCallback(
    (id, metric) => {
      setOrderBys((old = []) =>
        old.map((orderBy, idx) => {
          if (idx !== id) {
            return orderBy
          }
          return { ...orderBy, metric: { metricName: metric?.apiName } }
        })
      )
      console.log(id, metric)
    },
    [setOrderBys]
  )

  const setDimension: ReturnType<
    UseOrderBys
  >["setDimension"] = React.useCallback(
    (id, dimension) => {
      setOrderBys((old = []) =>
        old.map((orderBy, idx) => {
          if (idx !== id) {
            return orderBy
          }
          return {
            ...orderBy,
            dimension: { dimensionName: dimension?.apiName },
          }
        })
      )
      console.log(id, dimension)
    },
    [setOrderBys]
  )

  const setDirection: ReturnType<
    UseOrderBys
  >["setDirection"] = React.useCallback(
    (id, direction) => {
      setOrderBys((old = []) =>
        old.map((orderBy, idx) => {
          if (idx !== id) {
            return orderBy
          }
          const value = direction === Direction.Descending ? true : false
          return { ...orderBy, desc: value }
        })
      )
    },
    [setOrderBys]
  )

  return { addOrderBy, removeOrderBy, setDirection, setMetric, setDimension }
}

const useStyles = makeStyles(theme => ({
  heading: {},
  grouped: {
    flexGrow: 1,
    margin: theme.spacing(1, 0, 1, 1),
  },
  orderBys: {
    display: "flex",
  },
  orderBy: {
    display: "flex",
    margin: theme.spacing(1, 0),
  },
  type: {
    width: "20ch",
    marginRight: theme.spacing(1),
  },
  column: {
    marginRight: theme.spacing(1),
  },
  direction: {
    width: "30ch",
  },
  pabContainer: {
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  add: {},
}))

const pivotOption = { value: "pivot", displayName: "pivot" }
const dimensionOption = { value: "dimension", displayName: "dimension" }
const metricOption = { value: "metric", displayName: "metric" }

const ascOption = {
  value: Direction.Ascending,
  displayName: Direction.Ascending,
}
const descOption = {
  value: Direction.Descending,
  displayName: Direction.Descending,
}

const directionOptions: SelectOption[] = [ascOption, descOption]

const MetricSort: React.FC<{
  metricFilter: (m: GA4Metric) => boolean
  setMetric: ReturnType<UseOrderBys>["setMetric"]
  className: string
  id: number
}> = ({ metricFilter, className, setMetric, id }) => {
  const [metric, setMetricLocal] = React.useState<GA4Metric>()

  React.useEffect(() => {
    setMetric(id, metric)
  }, [metric, setMetric, id])

  return (
    <MetricPicker
      autoSelectIfOne
      setMetric={setMetricLocal}
      className={className}
      metricFilter={metricFilter}
    />
  )
}

const DimensionSort: React.FC<{
  dimensionFilter: (m: GA4Dimension) => boolean
  setDimension: ReturnType<UseOrderBys>["setDimension"]
  className: string
  id: number
}> = ({ dimensionFilter, className, setDimension, id }) => {
  const [dimension, setDimensionLocal] = React.useState<GA4Dimension>()

  React.useEffect(() => {
    setDimension(id, dimension)
  }, [dimension, setDimension, id])

  return (
    <DimensionPicker
      autoSelectIfOne
      setDimension={setDimensionLocal}
      className={className}
      dimensionFilter={dimensionFilter}
    />
  )
}

type PickedMetric =
  | {
      metric: true
      metricOptions: GA4Metrics
    }
  | { metric: undefined | false }

type PickedDimension =
  | {
      dimension: true
      dimensionOptions: GA4Dimensions
    }
  | { dimension: undefined | false }

type OrderBysProps = {
  orderBys: OrderBy[] | undefined
  setOrderBys: Dispatch<OrderBy[] | undefined>
  className?: string
} & PickedDimension &
  PickedMetric

const OrderBys: React.FC<OrderBysProps> = ({
  orderBys,
  setOrderBys,
  className,
  ...props
}) => {
  const classes = useStyles()
  const {
    addOrderBy,
    removeOrderBy,
    setDirection,
    setMetric,
    setDimension,
  } = useOrderBys({
    setOrderBys,
  })

  const selectedMetricIds = React.useMemo(
    () => new Set(props.metric ? props.metricOptions?.map(m => m.apiName) : []),
    [props]
  )
  const metricFilter = React.useCallback(
    (m: GA4Metric) => selectedMetricIds.has(m.apiName),
    [selectedMetricIds]
  )

  const selectedDimensionIds = React.useMemo(
    () =>
      new Set(
        props.dimension ? props.dimensionOptions?.map(m => m.apiName) : []
      ),
    [props]
  )
  const dimensionFilter = React.useCallback(
    (m: GA4Dimension) => selectedDimensionIds.has(m.apiName),
    [selectedDimensionIds]
  )

  return (
    <section className={clsx(className)}>
      <Typography variant="subtitle2" className={classes.heading}>
        order by
      </Typography>
      <section className={classes.orderBys}>
        <hr />
        <section className={classes.grouped}>
          {orderBys?.map((orderBy, idx) => {
            const selectedType = optionFor(orderBy)
            const selectedDirection = directionFor(orderBy)
            return (
              <section key={idx} className={classes.orderBy}>
                {selectedType?.value === "metric" && props.metric ? (
                  <MetricSort
                    className={classes.column}
                    metricFilter={metricFilter}
                    setMetric={setMetric}
                    id={idx}
                  />
                ) : null}
                {selectedType?.value === "dimension" && props.dimension ? (
                  <DimensionSort
                    className={classes.column}
                    dimensionFilter={dimensionFilter}
                    setDimension={setDimension}
                    id={idx}
                  />
                ) : null}
                {selectedType?.value !== undefined ? (
                  <Select
                    className={classes.direction}
                    options={directionOptions}
                    value={selectedDirection}
                    label="direction"
                    onChange={e => setDirection(idx, e?.value as any)}
                  />
                ) : null}
                <TooltipIconButton
                  tooltip="remove"
                  onClick={() => removeOrderBy(idx)}
                >
                  <Delete />
                </TooltipIconButton>
              </section>
            )
          })}
        </section>
      </section>
      <section className={classes.pabContainer}>
        {props.metric ? (
          <SAB
            add
            className={classes.add}
            size="medium"
            onClick={() => addOrderBy("metric")}
          >
            metric
          </SAB>
        ) : null}
        {props.dimension ? (
          <SAB
            add
            className={classes.add}
            size="medium"
            onClick={() => addOrderBy("dimension")}
          >
            dimension
          </SAB>
        ) : null}
      </section>
    </section>
  )
}

const optionFor = (orderBy: OrderBy): SelectOption | undefined => {
  if (orderBy.pivot !== undefined) {
    return pivotOption
  }
  if (orderBy.metric !== undefined) {
    return metricOption
  }
  if (orderBy.dimension !== undefined) {
    return dimensionOption
  }
  return undefined
}

const directionFor = (orderBy: OrderBy): SelectOption => {
  if (orderBy.desc === true) {
    return descOption
  }
  return ascOption
}

export default OrderBys
