import * as React from "react"
import {
  DimensionPicker,
  GA4Dimension,
  GA4Dimensions,
} from "../../../components/GA4Pickers"
import { useState, useMemo } from "react"
import { makeStyles, TextField, Typography, Paper } from "@material-ui/core"
import clsx from "classnames"
import LabeledCheckbox from "../../../components/LabeledCheckbox"
import Select, { SelectOption } from "../../../components/Select"

interface DimensionFilterProps {
  dimensions: GA4Dimensions
}

type FilterExpression = gapi.client.analyticsdata.FilterExpression
type FilterExpressionList = gapi.client.analyticsdata.FilterExpressionList
type BaseFilter = NonNullable<FilterExpression["filter"]>

const useStyles = makeStyles(theme => ({
  indented: {
    marginLeft: theme.spacing(1),
  },
  orDimension: {
    maxWidth: "40ch",
  },
  andLabel: {
    margin: theme.spacing(0),
  },
  andPaper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
  },
  and: {
    // "&::before": {
    //   minWidth: theme.spacing(4),
    //   borderTop: "1px solid black",
    //   content: '""',
    //   position: "fixed",
    // },
    // "&::after": {
    //   minWidth: theme.spacing(4),
    //   borderBottom: "1px solid black",
    //   content: '""',
    //   position: "fixed",
    // },
    // borderLeft: `1px solid black`,
    "& > :first-child": {
      paddingTop: theme.spacing(1),
    },
    "& > section": {
      margin: theme.spacing(1, 0),
      marginLeft: theme.spacing(1),
    },
  },
  filter: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

const useDimensionFilter = (
  _: GA4Dimensions
): { expression: FilterExpression } => {
  const [expression] = useState<FilterExpression>({
    andGroup: {
      expressions: [
        {
          filter: {
            betweenFilter: {
              toValue: { int64Value: "10" },
              fromValue: { int64Value: "3" },
            },
            fieldName: "",
          },
        },
        {
          filter: {
            inListFilter: { values: ["abc", "def"], caseSensitive: true },
            fieldName: "",
          },
        },
        {
          andGroup: {
            expressions: [
              {
                filter: {
                  inListFilter: { values: ["abc", "def"], caseSensitive: true },
                  fieldName: "",
                },
              },
              {
                filter: {
                  numericFilter: {
                    operation: ">=",
                    value: { int64Value: "13" },
                  },
                  fieldName: "",
                },
              },
            ],
          },
        },
        {
          filter: {
            numericFilter: { operation: ">=", value: { int64Value: "13" } },
            fieldName: "",
          },
        },
        {
          filter: {
            stringFilter: {
              caseSensitive: true,
              matchType: "abc",
              value: "abc",
            },
            fieldName: "",
          },
        },
      ],
    },
  })

  return { expression }
}

const AndGroup: React.FC<{
  andGroup: FilterExpressionList
  nesting: number
}> = ({ andGroup, nesting }) => {
  const classes = useStyles()
  return (
    <Paper className={classes.andPaper} elevation={nesting}>
      <Typography className={classes.andLabel} component="span">
        and
      </Typography>
      <section className={classes.and}>
        {andGroup.expressions?.map((expression, idx) => (
          <Expression
            key={`and${nesting}-${idx}`}
            expression={expression}
            nesting={nesting + 1}
          />
        ))}
      </section>
    </Paper>
  )
}

const Filter: React.FC<{ filter: BaseFilter; nesting: number }> = ({
  filter,
  nesting,
}) => {
  const classes = useStyles()
  const [, setDimension] = useState<GA4Dimension>()
  const [, setOption] = useState<SelectOption>()
  const [, setOption2] = useState<SelectOption>()
  const inner = useMemo(() => {
    if (filter.stringFilter !== undefined) {
      const str = filter.stringFilter
      return (
        <>
          <Select label="match type" setOption={setOption2} options={[]} />
          <TextField size="small" variant="outlined" value={str.value || ""} />
          <LabeledCheckbox
            checked={str.caseSensitive || false}
            setChecked={(_: boolean) => {}}
          >
            case sensitive
          </LabeledCheckbox>
        </>
      )
    }
    if (filter.numericFilter !== undefined) {
      const numeric = filter.numericFilter
      return (
        <>
          <Select
            label="operation"
            setOption={setOption}
            options={[">", ">=", "==", "<=", "<"].map(a => ({
              value: a,
              displayName: a,
            }))}
          />
          <TextField
            size="small"
            variant="outlined"
            value={
              numeric.value?.int64Value || numeric.value?.doubleValue || ""
            }
          />
        </>
      )
    }
    if (filter.inListFilter !== undefined) {
      const inList = filter.inListFilter
      return (
        <>
          <TextField
            label="values (comma separated)"
            size="small"
            variant="outlined"
            value={inList.values?.join(", ")}
          />
          <LabeledCheckbox
            checked={inList.caseSensitive || false}
            setChecked={(_: boolean) => {}}
          >
            case sensitive
          </LabeledCheckbox>
        </>
      )
    }
    if (filter.betweenFilter !== undefined) {
      const between = filter.betweenFilter
      return (
        <>
          <TextField
            size="small"
            variant="outlined"
            label={"From"}
            value={
              between.fromValue?.int64Value ||
              between.fromValue?.doubleValue ||
              ""
            }
          />
          <TextField
            size="small"
            variant="outlined"
            label={"To"}
            value={
              between.toValue?.int64Value || between.toValue?.doubleValue || ""
            }
          />
        </>
      )
    }
    return null
  }, [filter])

  return (
    <section
      className={clsx(classes.filter, { [classes.indented]: nesting > 0 })}
    >
      <DimensionPicker
        setDimension={setDimension}
        className={classes.orDimension}
      />
      {inner}
    </section>
  )
}

const Expression: React.FC<{
  expression: FilterExpression
  nesting: number
}> = ({ expression, nesting }) => {
  if (expression.filter) {
    return <Filter nesting={nesting + 1} filter={expression.filter} />
  }
  if (expression.andGroup) {
    return <AndGroup nesting={nesting + 1} andGroup={expression.andGroup} />
  }
  return null
}

const DimensionFilter: React.FC<DimensionFilterProps> = ({ dimensions }) => {
  const { expression } = useDimensionFilter(dimensions)

  return <Expression expression={expression} nesting={-1} />
}

export default DimensionFilter
