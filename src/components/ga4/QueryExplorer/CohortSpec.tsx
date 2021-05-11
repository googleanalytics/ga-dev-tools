import * as React from "react"

import Typography from "@material-ui/core/Typography"
import Delete from "@material-ui/icons/Delete"

import { Url } from "@/constants"
import ExternalLink from "@/components/ExternalLink"
import Select, { SelectOption } from "@/components/Select"
import {
  GA4Dimensions,
  GA4Dimension,
  DimensionPicker,
} from "@/components/GA4Pickers"
import WithHelpText from "@/components/WithHelpText"
import { SAB, TooltipIconButton } from "@/components/Buttons"
import InlineCode from "@/components/InlineCode"
import LinkedTextField from "@/components/LinkedTextField"
import { GADateRange } from "@/components/GADate"
import { Dispatch } from "@/types"
import makeStyles from "@material-ui/core/styles/makeStyles"

type DateRange = gapi.client.analyticsdata.DateRange
type CohortsRange = gapi.client.analyticsdata.CohortsRange

const cohortSpecLink = (
  <ExternalLink href={Url.ga4RequestComposerBasicCohortSpec}>
    cohortSpec
  </ExternalLink>
)

enum Granularity {
  Daily = "DAILY",
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
}
const daily = { value: Granularity.Daily, displayName: "daily" }
const weekly = { value: Granularity.Weekly, displayName: "weekly" }
const monthly = { value: Granularity.Monthly, displayName: "monthly" }

const granularityOptions = [daily, weekly, monthly]

const optionFor = (
  granularity: Granularity | undefined
): SelectOption | undefined => {
  switch (granularity) {
    case Granularity.Daily:
      return daily
    case Granularity.Weekly:
      return weekly
    case Granularity.Monthly:
      return monthly
  }
  return undefined
}

type UseCohortSpec = (arg: {
  cohortSpec: CohortSpecType | undefined
  setCohortSpec: Dispatch<CohortSpecType | undefined>
  dimensions: GA4Dimensions
}) => {
  addCohort: () => void
  removeCohort: (idx: number) => void
  setGranularity: (granularity: Granularity | undefined) => void
  updateDateRange: (idx: number, update: (old: DateRange) => DateRange) => void
  updateCohortsRange: (update: (old: CohortsRange) => CohortsRange) => void
  dimensionFilter: (d: GA4Dimension) => boolean
  hasRequiredDimension: boolean
  startOffset: string
  setStartOffset: React.Dispatch<string>
  endOffset: string
  setEndOffset: React.Dispatch<string>
}

const useCohortSpec: UseCohortSpec = ({
  cohortSpec,
  setCohortSpec,
  dimensions,
}) => {
  const [startOffset, setStartOffset] = React.useState(
    cohortSpec?.cohortsRange?.startOffset?.toString() || ""
  )
  const [endOffset, setEndOffset] = React.useState(
    cohortSpec?.cohortsRange?.endOffset?.toString() || ""
  )

  const hasRequiredDimension = React.useMemo(
    () =>
      dimensions?.find(dim => dim.apiName === "firstSessionDate") !== undefined,
    [dimensions]
  )
  // Currently only 'firstSessionDate' is supported as a cohort dimension.
  const dimensionFilter = React.useCallback(
    (d: GA4Dimension): boolean =>
      d.apiName === "firstSessionDate" && hasRequiredDimension,
    [hasRequiredDimension]
  )

  const updateCohortsRange: ReturnType<UseCohortSpec>["updateCohortsRange"] = React.useCallback(
    update => {
      setCohortSpec((old = {}) => ({
        ...old,
        cohortsRange: update(old.cohortsRange || {}),
      }))
    },
    [setCohortSpec]
  )

  const setGranularity: ReturnType<UseCohortSpec>["setGranularity"] = React.useCallback(
    granularity => {
      setCohortSpec((old = {}) => ({
        ...old,
        cohortsRange: {
          ...old.cohortsRange,
          granularity: granularity,
        },
      }))
    },
    [setCohortSpec]
  )
  const addCohort: ReturnType<UseCohortSpec>["addCohort"] = React.useCallback(() => {
    setCohortSpec((old = {}) => {
      const defaults = {}
      if (old.cohorts === undefined || old.cohorts.length === 0) {
        defaults["granularity"] = Granularity.Daily
        defaults["startOffset"] = 0
        defaults["endOffset"] = 5
        setStartOffset("0")
        setEndOffset("5")
      }
      return {
        ...old,
        cohortsRange: { ...old.cohortsRange, ...defaults },
        cohorts: (old.cohorts || []).concat([
          {
            dimension: hasRequiredDimension ? "firstSessionDate" : undefined,
          },
        ]),
      }
    })
  }, [setCohortSpec, hasRequiredDimension])

  const removeCohort: ReturnType<UseCohortSpec>["removeCohort"] = React.useCallback(
    id => {
      setCohortSpec((old = {}) => {
        if (old.cohorts?.length === 1) {
          return undefined
        }
        return {
          ...old,
          cohorts: (old.cohorts || []).filter((_, idx) =>
            idx !== id ? true : false
          ),
        }
      })
    },
    [setCohortSpec]
  )

  const updateDateRange: ReturnType<UseCohortSpec>["updateDateRange"] = React.useCallback(
    (id, update) => {
      setCohortSpec((old = {}) => ({
        ...old,
        cohorts: (old.cohorts || []).map((cohort, idx) =>
          idx !== id
            ? cohort
            : { ...cohort, dateRange: update(cohort.dateRange || {}) }
        ),
      }))
    },
    [setCohortSpec]
  )

  React.useEffect(() => {
    setCohortSpec((old = {}) => ({
      ...old,
      cohorts: (old.cohorts || []).map(cohort => ({
        ...cohort,
        dimension: hasRequiredDimension ? "firstSessionDate" : undefined,
      })),
    }))
  }, [setCohortSpec, hasRequiredDimension])

  React.useEffect(() => {
    const parsedStart = parseInt(startOffset, 10)
    if (!isNaN(parsedStart)) {
      updateCohortsRange(old => ({ ...old, startOffset: parsedStart }))
    } else {
      updateCohortsRange(old => ({ ...old, startOffset: undefined }))
    }
  }, [startOffset, updateCohortsRange])

  React.useEffect(() => {
    const parsedEnd = parseInt(endOffset, 10)
    if (!isNaN(parsedEnd)) {
      updateCohortsRange(old => ({ ...old, endOffset: parsedEnd }))
    } else {
      updateCohortsRange(old => ({ ...old, endOffset: undefined }))
    }
  }, [endOffset, updateCohortsRange])

  return {
    addCohort,
    removeCohort,
    setGranularity,
    updateDateRange,
    updateCohortsRange,
    dimensionFilter,
    hasRequiredDimension,
    startOffset,
    setStartOffset,
    endOffset,
    setEndOffset,
  }
}

const useStyles = makeStyles(theme => ({
  cohortRange: {
    display: "flex",
    marginTop: theme.spacing(1),
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
      flexGrow: 1,
    },
    marginBottom: theme.spacing(1),
  },
  cohort: {
    display: "flex",
    "&> :not(:first-child)": {
      marginLeft: theme.spacing(1),
      flexGrow: 1,
    },
    marginBottom: theme.spacing(1),
  },
  warnings: {
    // display: "flex",
    // alignContent: "center",
    marginTop: theme.spacing(1),
    "&> *:last-child": {
      marginBottom: theme.spacing(2),
    },
  },
}))

type CohortSpecType = gapi.client.analyticsdata.CohortSpec

interface CohortSpecProps {
  cohortSpec: CohortSpecType | undefined
  setCohortSpec: Dispatch<CohortSpecType | undefined>
  dimensions: GA4Dimensions
  addFirstSessionDate: () => void
  dateRanges: DateRange[] | undefined
  removeDateRanges: () => void
}
const CohortSpec: React.FC<CohortSpecProps> = ({
  cohortSpec,
  setCohortSpec,
  dimensions,
  addFirstSessionDate,
  dateRanges,
  removeDateRanges,
}) => {
  const classes = useStyles()
  const {
    addCohort,
    removeCohort,
    updateDateRange,
    setGranularity,
    hasRequiredDimension,
    dimensionFilter,
    startOffset,
    setStartOffset,
    endOffset,
    setEndOffset,
  } = useCohortSpec({
    cohortSpec,
    setCohortSpec,
    dimensions,
  })

  const warnings = React.useMemo(() => {
    const missingRequiredDimension = !hasRequiredDimension
    const hasDateRanges = dateRanges !== undefined && dateRanges.length > 0
    return { missingRequiredDimension, hasDateRanges }
  }, [hasRequiredDimension, dateRanges])

  const fixWarnings = React.useCallback(() => {
    if (warnings.hasDateRanges) {
      removeDateRanges()
    }
    if (warnings.missingRequiredDimension) {
      addFirstSessionDate()
    }
  }, [warnings, addFirstSessionDate, removeDateRanges])

  return (
    <WithHelpText
      notched
      label="cohort"
      helpText={
        <>The cohort group for this request. See {cohortSpecLink} on devsite.</>
      }
    >
      {Object.values(warnings).find(a => a) &&
        (cohortSpec?.cohorts?.length || 0) > 0 && (
          <section className={classes.warnings}>
            {warnings.missingRequiredDimension && (
              <Typography>
                Cohorts must include <InlineCode>firstSessionDate</InlineCode>
              </Typography>
            )}
            {warnings.hasDateRanges && (
              <Typography>
                Cohort requests cannot include dateRanges.
              </Typography>
            )}
            <SAB small onClick={fixWarnings}>
              fix
            </SAB>
          </section>
        )}
      {(cohortSpec?.cohorts?.length || 0) > 0 && (
        <div className={classes.cohortRange}>
          <Select
            label="granularity"
            options={granularityOptions}
            onChange={e =>
              setGranularity(
                e === undefined ? undefined : (e.value as Granularity)
              )
            }
            value={optionFor(
              cohortSpec?.cohortsRange?.granularity as Granularity
            )}
          />
          <LinkedTextField
            label="start offset"
            helperText=""
            linkTitle="See startOffset on devsite."
            href={Url.cohortsRangeStartOffset}
            value={startOffset}
            onChange={setStartOffset}
          />
          <LinkedTextField
            label="end offset"
            helperText=""
            linkTitle="see endOffset on devsite."
            href={Url.cohortsRangeEndOffset}
            value={endOffset}
            onChange={setEndOffset}
          />
        </div>
      )}
      {cohortSpec?.cohorts?.map((cohort, idx) => (
        <div key={idx} className={classes.cohort}>
          <TooltipIconButton
            tooltip="Remove cohort"
            onClick={() => removeCohort(idx)}
          >
            <Delete />
          </TooltipIconButton>
          <DimensionPicker autoSelectIfOne dimensionFilter={dimensionFilter} />
          <GADateRange
            value={cohort.dateRange || {}}
            setValue={update => updateDateRange(idx, update)}
          />
        </div>
      ))}
      <SAB add small onClick={addCohort}>
        cohort
      </SAB>
    </WithHelpText>
  )
}

export default CohortSpec
