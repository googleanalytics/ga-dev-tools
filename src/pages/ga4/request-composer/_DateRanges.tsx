import * as React from "react"
import { useState } from "react"
import { TextField, makeStyles, Typography } from "@material-ui/core"
import { TooltipIconButton, SAB } from "../../../components/Buttons"
import { Delete, Add } from "@material-ui/icons"
import { Dispatch } from "../../../types"
import InlineCode from "../../../components/InlineCode"

export interface DateRange {
  id: string
  from: string
  to: string
}

let id = 0
const nextId = () => {
  id++
  return id
}
const useDateRanges = (): {
  dateRanges: DateRange[]
  addDateRange: () => void
  removeDateRange: (id: string) => void
  updateFrom: (id: string, newFrom: string) => void
  updateTo: (id: string, newTo: string) => void
} => {
  const [dateRanges, setDateRanges] = useState<DateRange[]>([
    {
      from: "7daysAgo",
      to: "today",
      id: `dateRange${nextId()}`,
    },
  ])

  const addDateRange = React.useCallback(() => {
    setDateRanges(old => {
      return old.concat([
        {
          from: "",
          to: "",
          id: `dateRange${nextId()}`,
        },
      ])
    })
  }, [])

  const removeDateRange = React.useCallback((id: string) => {
    setDateRanges(old => old.filter(dateRange => dateRange.id !== id))
  }, [])

  const updateFrom = React.useCallback((id: string, newValue: string) => {
    setDateRanges(old =>
      old.map(dateRange =>
        dateRange.id !== id ? dateRange : { ...dateRange, from: newValue }
      )
    )
  }, [])

  const updateTo = React.useCallback((id: string, newValue: string) => {
    setDateRanges(old =>
      old.map(dateRange =>
        dateRange.id !== id ? dateRange : { ...dateRange, to: newValue }
      )
    )
  }, [])

  return { dateRanges, addDateRange, removeDateRange, updateFrom, updateTo }
}

const useStyles = makeStyles(theme => ({
  heading: { marginTop: theme.spacing(1) },
  dateRanges: {
    display: "flex",
    flexDirection: "column",
  },
  dateRange: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "flex",
  },
  from: {
    marginRight: theme.spacing(1),
  },
  add: {
    alignSelf: "flex-end",
  },
}))

const dateRange = (
  <a href="https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange">
    DateRange
  </a>
)

const DateRanges: React.FC<{ onChange: Dispatch<DateRange[]> }> = ({
  onChange,
}) => {
  const classes = useStyles()
  const {
    dateRanges,
    addDateRange,
    removeDateRange,
    updateFrom,
    updateTo,
  } = useDateRanges()

  React.useEffect(() => {
    onChange(dateRanges)
  }, [dateRanges, onChange])

  return (
    <section className={classes.dateRanges}>
      <Typography variant="h5" className={classes.heading}>
        Date Ranges
      </Typography>
      <Typography>
        The date ranges to use for the request. Format should be either{" "}
        <InlineCode>YYYY-MM-DD</InlineCode>, <InlineCode>yesterday</InlineCode>,{" "}
        <InlineCode>today</InlineCode>, or <InlineCode>NdaysAgo</InlineCode>{" "}
        where N is a positive integer. See {dateRange} on devsite.
      </Typography>
      {dateRanges.map(dateRange => (
        <section key={dateRange.id} className={classes.dateRange}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="start date"
            className={classes.from}
            value={dateRange.from}
            onChange={e => {
              updateFrom(dateRange.id, e.target.value)
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="end date"
            value={dateRange.to}
            onChange={e => {
              updateTo(dateRange.id, e.target.value)
            }}
          />
          <TooltipIconButton
            tooltip="remove daterange"
            onClick={() => removeDateRange(dateRange.id)}
            disabled={dateRanges.length === 1}
          >
            <Delete />
          </TooltipIconButton>
        </section>
      ))}
      <SAB
        className={classes.add}
        size="medium"
        onClick={addDateRange}
        startIcon={<Add />}
      >
        Add
      </SAB>
    </section>
  )
}

export default DateRanges
