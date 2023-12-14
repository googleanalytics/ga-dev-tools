import * as React from "react"

import { styled } from '@mui/material/styles';

import { v4 as uuid } from "uuid"
import TextField from "@mui/material/TextField"
import Delete from "@mui/icons-material/Delete"

import { Dispatch } from "@/types"
import ExternalLink from "@/components/ExternalLink"
import WithHelpText from "@/components/WithHelpText"
import InlineCode from "@/components/InlineCode"
import { SAB, TooltipIconButton } from "@/components/Buttons"

const PREFIX = 'DateRanges';

const classes = {
  heading: `${PREFIX}-heading`,
  pabContainer: `${PREFIX}-pabContainer`,
  dateRanges: `${PREFIX}-dateRanges`,
  dateRange: `${PREFIX}-dateRange`,
  name: `${PREFIX}-name`,
  from: `${PREFIX}-from`
};

const StyledWithHelpText = styled(WithHelpText)((
  {
    theme
  }
) => ({
  [`& .${classes.heading}`]: {
    margin: theme.spacing(1, 0),
    marginTop: theme.spacing(0),
  },

  [`& .${classes.pabContainer}`]: {
    display: "flex",
    "& > *:first-child": {
      flexGrow: 1,
    },
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.dateRanges}`]: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },

  [`& .${classes.dateRange}`]: {
    // marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "flex",
  },
  [`& .${classes.name}`]: {
    width: "45ch",
  },

  [`& .${classes.from}`]: {
    marginRight: theme.spacing(1),
  }
}));

export interface DateRange {
  name?: string
  id: string
  from: string
  to: string
}

type UseDateRanges = (arg: {
  setDateRanges: Dispatch<DateRange[] | undefined>
}) => {
  addDateRange: () => void
  removeDateRange: (id: string) => void
  updateFrom: (id: string, newFrom: string) => void
  updateTo: (id: string, newTo: string) => void
  updateName: (id: string, newName: string) => void
  setToOneDateRange: () => void
}

const useDateRanges: UseDateRanges = ({ setDateRanges }) => {
  const addDateRange = React.useCallback(() => {
    setDateRanges((old = []) => {
      return old.concat([
        {
          from: "30daysAgo",
          to: "yesterday",
          id: uuid(),
        },
      ])
    })
  }, [setDateRanges])

  const removeDateRange = React.useCallback(
    (id: string) => {
      setDateRanges((old = []) => {
        if (old.length === 1) {
          return undefined
        }
        return old.filter(dateRange => dateRange.id !== id)
      })
    },
    [setDateRanges]
  )

  const setToOneDateRange = React.useCallback(() => {
    setDateRanges((old = []) =>
      old.length > 0
        ? [old[0]]
        : [
            {
              from: "30daysAgo",
              to: "yesterday",
              id: uuid(),
            },
          ]
    )
  }, [setDateRanges])

  const updateFrom = React.useCallback(
    (id: string, newValue: string) => {
      setDateRanges((old = []) =>
        old.map(dateRange =>
          dateRange.id !== id ? dateRange : { ...dateRange, from: newValue }
        )
      )
    },
    [setDateRanges]
  )

  const updateTo = React.useCallback(
    (id: string, newValue: string) => {
      setDateRanges((old = []) =>
        old.map(dateRange =>
          dateRange.id !== id ? dateRange : { ...dateRange, to: newValue }
        )
      )
    },
    [setDateRanges]
  )

  const updateName = React.useCallback(
    (id: string, newValue: string) => {
      setDateRanges((old = []) =>
        old.map(dateRange =>
          dateRange.id !== id ? dateRange : { ...dateRange, name: newValue }
        )
      )
    },
    [setDateRanges]
  )

  return {
    addDateRange,
    removeDateRange,
    updateFrom,
    updateTo,
    updateName,
    setToOneDateRange,
  }
}

const dateRange = (
  <ExternalLink href="https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/DateRange">
    DateRange
  </ExternalLink>
)

const DateRanges: React.FC<{
  dateRanges: DateRange[] | undefined
  setDateRanges: Dispatch<DateRange[] | undefined>
  className?: string
  showAdvanced: boolean
}> = ({ dateRanges, setDateRanges, className, showAdvanced }) => {

  const {
    addDateRange,
    removeDateRange,
    updateFrom,
    updateTo,
    setToOneDateRange,
  } = useDateRanges({ setDateRanges })

  React.useEffect(() => {
    if (showAdvanced !== true) {
      if (dateRanges === undefined || dateRanges.length !== 1) {
        setToOneDateRange()
      }
    }
  }, [dateRanges, showAdvanced, setToOneDateRange])

  return (
    <StyledWithHelpText
      label={showAdvanced ? "date ranges" : undefined}
      notched={showAdvanced}
      className={className}
      helpText={
        <>
          The date {showAdvanced ? "ranges" : "range"} to use for the request.
          Format should be either <InlineCode>YYYY-MM-DD</InlineCode>,{" "}
          <InlineCode>yesterday</InlineCode>, <InlineCode>today</InlineCode>, or{" "}
          <InlineCode>NdaysAgo</InlineCode> where N is a positive integer. See{" "}
          {dateRange} on devsite.
        </>
      }
    >
      <section className={classes.dateRanges}>
        {dateRanges?.map(dateRange => (
          <section key={dateRange.id} className={classes.dateRange}>
            {showAdvanced && (
              <TooltipIconButton
                tooltip="remove daterange"
                onClick={() => removeDateRange(dateRange.id)}
              >
                <Delete />
              </TooltipIconButton>
            )}
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
          </section>
        ))}
        {showAdvanced && (
          <div>
            <SAB add small onClick={addDateRange}>
              date range
            </SAB>
          </div>
        )}
      </section>
    </StyledWithHelpText>
  );
}

export default DateRanges
