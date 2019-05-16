import * as React from 'react'

interface CommonAttributes {
	group: string,
	uiName: string,
	description: string,
	allowedInSegments?: boolean,
}

interface DimensionAttributes {
	type: 'DIMENSION',
	dataType: 'STRING'
}

interface MetricAttributes {
	type: 'METRIC',
	dataType: 'INTEGER' | 'PERCENT' | 'TIME' | 'CURRENCY' | 'FLOAT',
	calculation?: string,
}

interface DeprecatedAttributes {
	replacedBy: string,
	status: 'DEPRECATED',
}

interface PublicAttributes {
	status: 'PUBLIC'
}

type Attributes = CommonAttributes & (DimensionAttributes | MetricAttributes) & (DeprecatedAttributes | PublicAttributes);

// A single Dimension or Metric
interface Column {
	id: string,
	kind: string,
	attributes: Attributes,
}

const ColumnGroupList: React.FC<{}> = () => {
	// Fetch all of the columns from the metadata API

	const a = (x: Attributes) => {
		localStorage.setItem
	}
}
