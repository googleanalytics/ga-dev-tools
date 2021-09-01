import { useMemo } from "react"
import moment from "moment"

import { CohortSize, V4SamplingLevel } from "@/components/UAPickers"
import { ReportsRequest, ReportRequest } from "../RequestComposer"
import { Column, Segment } from "@/types/ua"

type Cohort = gapi.client.analyticsreporting.Cohort

const dimensionFor = (cohortSize: CohortSize) => {
  let dimensionName: string
  switch (cohortSize) {
    case CohortSize.Day:
      dimensionName = "ga:cohortNthDay"
      break
    case CohortSize.Week:
      dimensionName = "ga:cohortNthWeek"
      break
    case CohortSize.Month:
      dimensionName = "ga:cohortNthMonth"
      break
  }
  return { name: dimensionName }
}

const cohortsFor = (cohortSize: CohortSize) => {
  // Yes this type definition is a bit gnarly. But it helps us to not mess up which is v handy.
  const cohorts: Cohort[] = []
  let now = moment()
  switch (cohortSize) {
    case CohortSize.Day: {
      // For day, return 7 cohorts, one for each of the last 7 days (starting
      // at yesterday).
      for (let i = 0; i < 7; i++) {
        now = now.subtract(1, "days")
        const cohort: Cohort = {
          type: "FIRST_VISIT_DATE",
          name: now.format("YYYY-MM-DD"),
          dateRange: {
            startDate: now.format("YYYY-MM-DD"),
            endDate: now.format("YYYY-MM-DD"),
          },
        }
        cohorts.push(cohort)
      }
      break
    }
    case CohortSize.Week: {
      // Create cohorts for the past 6 weeks.
      for (let i = 0; i < 6; i++) {
        const startDate = now
          .subtract(1, "week")
          .startOf("week")
          .format("YYYY-MM-DD")
        const endDate = now.endOf("week").format("YYYY-MM-DD")
        const cohort = {
          type: "FIRST_VISIT_DATE",
          name: startDate + " to " + endDate,
          dateRange: {
            startDate: startDate,
            endDate: endDate,
          },
        }
        cohorts.push(cohort)
      }
      break
    }
    case CohortSize.Month: {
      // Create cohorts for the past 3 months.
      for (let i = 0; i < 3; i++) {
        const startDate = now
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD")
        const endDate = now.endOf("month").format("YYYY-MM-DD")
        const cohort = {
          type: "FIRST_VISIT_DATE",
          name: startDate + " to " + endDate,
          dateRange: {
            startDate: startDate,
            endDate: endDate,
          },
        }
        cohorts.push(cohort)
      }
      break
    }
  }
  return cohorts
}

const useCohortRequest = ({
  viewId,
  selectedMetric,
  selectedSegment,
  cohortSize,
  samplingLevel,
}: {
  viewId: string
  selectedMetric: Column | undefined
  selectedSegment: Segment | undefined
  cohortSize: CohortSize | undefined
  samplingLevel: V4SamplingLevel | undefined
}) => {
  const request = useMemo<ReportsRequest | undefined>(() => {
    if (
      viewId === undefined ||
      viewId === "" ||
      selectedMetric === undefined ||
      cohortSize === undefined
    ) {
      return undefined
    }
    const reportRequest: ReportRequest = {
      viewId,
      metrics: [{ expression: selectedMetric.id }],
      dimensions: [
        {
          name: "ga:cohort",
        },
        dimensionFor(cohortSize),
      ],
      cohortGroup: {
        cohorts: cohortsFor(cohortSize),
      },
    }
    if (selectedSegment !== undefined) {
      reportRequest["segments"] = [
        {
          segmentId: selectedSegment.segmentId,
        },
      ]
      reportRequest.dimensions = reportRequest.dimensions!.concat([
        { name: "ga:segment" },
      ])
    }
    if (samplingLevel !== undefined) {
      reportRequest["samplingLevel"] = samplingLevel
    }

    return {
      reportRequests: [reportRequest],
    }
  }, [viewId, selectedMetric, cohortSize, selectedSegment, samplingLevel])
  return request
}

export default useCohortRequest
