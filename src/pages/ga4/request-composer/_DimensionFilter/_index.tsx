import * as React from "react"
import { GA4Dimensions } from "../../../../components/GA4Pickers"
import { useState } from "react"
import Expression from "./_Expression"
import { Typography } from "@material-ui/core"

interface DimensionFilterProps {
  dimensions: GA4Dimensions
}

export type FilterExpression = gapi.client.analyticsdata.FilterExpression
export type FilterExpressionList = gapi.client.analyticsdata.FilterExpressionList
export type BaseFilter = NonNullable<FilterExpression["filter"]>

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
          orGroup: {
            expressions: [
              {
                filter: {
                  inListFilter: { values: ["abc", "def"], caseSensitive: true },
                  fieldName: "",
                },
              },
              {
                notExpression: {
                  filter: {
                    numericFilter: {
                      operation: ">=",
                      value: { int64Value: "13" },
                    },
                    fieldName: "",
                  },
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

const DimensionFilter: React.FC<DimensionFilterProps> = ({ dimensions }) => {
  const { expression } = useDimensionFilter(dimensions)

  return (
    <section>
      <Typography variant="subtitle2" style={{ marginTop: "unset" }}>
        dimension filters
      </Typography>
      <Expression expression={expression} nesting={-1} />
    </section>
  )
}

export default DimensionFilter
