import * as React from "react"

import { styled } from '@mui/material/styles';

import Typography from "@mui/material/Typography"
import Delete from "@mui/icons-material/Delete"

import { Dispatch } from "@/types"
import { SAB, TooltipIconButton } from "@/components/Buttons"
import Select, { SelectOption } from "@/components/Select"
import {
  MetricPicker,
  GA4Metric,
  GA4Dimension,
  DimensionPicker,
  GA4Dimensions,
  GA4Metrics,
} from "@/components/GA4Pickers"
import ExternalLink from "@/components/ExternalLink"
import WithHelpText from "@/components/WithHelpText"
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"

const PREFIX = 'OrderBys';

const classes = {
  heading: `${PREFIX}-heading`,
  orderType: `${PREFIX}-orderType`,
  grouped: `${PREFIX}-grouped`,
  orderBy: `${PREFIX}-orderBy`,
  type: `${PREFIX}-type`,
  column: `${PREFIX}-column`,
  direction: `${PREFIX}-direction`,
  pabContainer: `${PREFIX}-pabContainer`,
  buttons: `${PREFIX}-buttons`,
  add: `${PREFIX}-add`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.heading}`]: {},

  [`& .${classes.orderType}`]: {
    width: "30ch",
    marginRight: theme.spacing(1),
  },

  [`& .${classes.grouped}`]: {
    flexGrow: 1,
    margin: theme.spacing(1, 0, 1, 1),
  },

  [`& .${classes.orderBy}`]: {
    display: "flex",
    margin: theme.spacing(1, 0),
    "& > :first-child": {
      marginRight: theme.spacing(1),
    },
  },

  [`& .${classes.type}`]: {
    width: "20ch",
    marginRight: theme.spacing(1),
  },

  [`& .${classes.column}`]: {
    marginRight: theme.spacing(1),
  },

  [`& .${classes.direction}`]: {
    width: "30ch",
  },

  [`& .${classes.pabContainer}`]: {
    display: "flex",
    "& > *:first-child": {
      flexGrow: 1,
    },
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.buttons}`]: {
    "&> *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },

  [`& .${classes.add}`]: {}
}));

const orderBysLink = (
  <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport#body.request_body.FIELDS.order_bys">
    orderBys
  </ExternalLink>
)

type OrderBy = gapi.client.analyticsdata.OrderBy
enum OrderType {
  Alphanumeric = "ALPHANUMERIC",
  CaseInsensitiveAlphanumeric = "CASE_INSENSITIVE_ALPHANUMERIC",
  Numeric = "NUMERIC",
}

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
  setDimensionOrderType: (id: number, orderType: OrderType | undefined) => void
}
const useOrderBys: UseOrderBys = ({ setOrderBys }) => {
  const removeOrderBy: ReturnType<UseOrderBys>["removeOrderBy"] = React.useCallback(
    id => {
      setOrderBys((old = []) => old.filter((_, idx) => idx !== id))
    },
    [setOrderBys]
  )

  const addOrderBy: ReturnType<UseOrderBys>["addOrderBy"] = React.useCallback(
    type => {
      setOrderBys((old = []) => {
        let nu: OrderBy = {
          [type]: {},
        }
        if (type === "dimension") {
          nu[type]!.orderType = OrderType.Alphanumeric
        }
        return old.concat([nu])
      })
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
    },
    [setOrderBys]
  )

  const setDimension: ReturnType<UseOrderBys>["setDimension"] = React.useCallback(
    (id, dimension) => {
      setOrderBys((old = []) =>
        old.map((orderBy, idx) => {
          if (idx !== id) {
            return orderBy
          }
          return {
            ...orderBy,
            dimension: {
              ...orderBy.dimension,
              dimensionName: dimension?.apiName,
            },
          }
        })
      )
    },
    [setOrderBys]
  )

  const setDimensionOrderType: ReturnType<UseOrderBys>["setDimensionOrderType"] = React.useCallback(
    (id, orderType) => {
      setOrderBys((old = []) =>
        old.map((orderBy, idx) => {
          if (idx !== id) {
            return orderBy
          }
          return {
            ...orderBy,
            dimension: { ...orderBy.dimension, orderType },
          }
        })
      )
    },
    [setOrderBys]
  )

  const setDirection: ReturnType<UseOrderBys>["setDirection"] = React.useCallback(
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

  return {
    addOrderBy,
    removeOrderBy,
    setDirection,
    setMetric,
    setDimension,
    setDimensionOrderType,
  }
}

const pivotOption = { value: "pivot", displayName: "pivot" }
const dimensionOption = { value: "dimension", displayName: "dimension" }
const metricOption = { value: "metric", displayName: "metric" }

const orderTypeOptions: SelectOption[] = [
  {
    value: OrderType.Alphanumeric,
    displayName: "alpha",
  },
  {
    value: OrderType.Numeric,
    displayName: "numeric",
  },
  {
    value: OrderType.CaseInsensitiveAlphanumeric,
    displayName: "alpha (ignore case)",
  },
]

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
  setDimensionOrderType: ReturnType<UseOrderBys>["setDimensionOrderType"]
  className: string
  id: number
  orderType: SelectOption | undefined
}> = ({
  dimensionFilter,
  className,
  setDimension,
  setDimensionOrderType,
  id,
  orderType,
}) => {

  const [dimension, setDimensionLocal] = React.useState<GA4Dimension>()

  React.useEffect(() => {
    setDimension(id, dimension)
  }, [dimension, setDimension, id])

  return (
    <>
      <DimensionPicker
        autoSelectIfOne
        setDimension={setDimensionLocal}
        className={className}
        dimensionFilter={dimensionFilter}
      />
      <Select
        onChange={e => setDimensionOrderType(id, e?.value as OrderType)}
        className={classes.orderType}
        value={orderType}
        options={orderTypeOptions}
        label="order type"
      />
    </>
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

  const {
    addOrderBy,
    removeOrderBy,
    setDirection,
    setMetric,
    setDimension,
    setDimensionOrderType,
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
    <WithHelpText
      notched
      label="order by"
      helpText={
        <Typography variant="caption" color="textSecondary">
          The ordering to use for the request. See {orderBysLink} on devsite.
        </Typography>
      }
    >
      <Root>
        <section>
          {orderBys !== undefined && orderBys.length > 0 && (
            <section className={classes.grouped}>
              {orderBys.map((orderBy, idx) => {
                const selectedType = optionFor(orderBy)
                const selectedOrderType = orderTypeFor(orderBy)
                return (
                  <section key={idx} className={classes.orderBy}>
                    <TooltipIconButton
                      tooltip="remove ordering clause"
                      onClick={() => removeOrderBy(idx)}
                    >
                      <Delete />
                    </TooltipIconButton>
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
                        setDimensionOrderType={setDimensionOrderType}
                        id={idx}
                        orderType={selectedOrderType}
                      />
                    ) : null}
                    {selectedType?.value !== undefined ? (
                      <TooltipIconButton
                        tooltip={orderBy.desc ? "descending" : "ascending"}
                        onClick={() => {
                          setDirection(
                            idx,
                            orderBy.desc
                              ? Direction.Ascending
                              : Direction.Descending
                          )
                        }}
                      >
                        {orderBy.desc ? <ArrowDownward /> : <ArrowUpward />}
                      </TooltipIconButton>
                    ) : null}
                  </section>
                )
              })}
            </section>
          )}
          <section className={classes.buttons}>
            {props.metric ? (
              <SAB
                add
                small
                className={classes.add}
                onClick={() => addOrderBy("metric")}
              >
                metric
              </SAB>
            ) : null}
            {props.dimension ? (
              <SAB
                add
                small
                className={classes.add}
                onClick={() => addOrderBy("dimension")}
              >
                dimension
              </SAB>
            ) : null}
          </section>
        </section>
        <section className={classes.pabContainer}></section>
      </Root>
  </WithHelpText>
  );
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

const orderTypeFor = (orderBy: OrderBy): SelectOption | undefined => {
  const type = orderBy.dimension?.orderType
  if (type === undefined) {
    return undefined
  }
  return orderTypeOptions.find(option => option.value === type)
}

export default OrderBys
