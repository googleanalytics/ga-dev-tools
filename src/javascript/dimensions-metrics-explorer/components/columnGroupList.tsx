import * as React from 'react'
import { groupBy, memoize, map } from 'lodash'

import {
	useLocalStorage,
	useTypedLocalStorage,
} from '../../hooks'

import Icon from '../../components/icon'

declare global {
	interface Window {
		readonly GAPI_ACCESS_TOKEN: string;
	}
}

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

interface TemplateAttributes {
	minTemplateIndex: number,
	maxTemplateIndex: number,
}

interface PremiumTemplateAttributes extends TemplateAttributes {
	premiumMinTemplateIndex: number,
	premiumMaxTemplateIndex: number,
}

type Attributes = (
	CommonAttributes &
	(DimensionAttributes | MetricAttributes) &
	(DeprecatedAttributes | PublicAttributes) &
	({} | TemplateAttributes | PremiumTemplateAttributes)
)

// A single Dimension or Metric
interface Column {
	id: string,
	kind: string,
	attributes: Attributes,
}

type Groups = {[key: string]: Column[]};

const ColumnGroup: React.FC<{
	open: boolean,
	toggleOpen: () => void,
	name: string,
	columns: Column[]
}> = ({
	open, toggleOpen, name
}) => (
	<div className="dme-group">
		<div className="dme-group-header">
			<span onClick={toggleOpen}><Icon type='add-circle' /></span>
			<span>{name}</span>
		</div>
		<div className="dme-group-list" hidden={!open}>
			COLUMNS
		</div>
	</div>
);

const ColumnGroupList: React.FC<{}> = () => {
	const [groupedColumns, setGroups] = React.useState<null | Groups>(null);
	const [open, setOpen] = React.useState<{[ group: string ]: boolean}>({});
	// Fetch all of the columns from the metadata API
	// TODO: convert this to a standard `fetch` so it can be cancelled.
	React.useEffect(() => {
		const controller = new AbortController();

		const asyncFetch = async () => {
			const response = await fetch(
				"https://content.googleapis.com/analytics/v3/metadata/ga/columns",
				{
					headers: new Headers({
						Authorization: `Bearer ${window.GAPI_ACCESS_TOKEN}`,
						'If-None-Match': window.localStorage.getItem("columnsEtag") || "",
					}),
					signal: controller.signal,
				});

			var columns: any

			if (response.status === 304) {
				columns = JSON.parse(window.localStorage.getItem("cachedColumnsBlob") || "");
			} else if (response.ok) {
				columns = await response.json()

				window.localStorage.setItem("columnsEtag", response.headers.get("etag") || "")
				window.localStorage.setItem("cachedColumnsBlob", JSON.stringify(columns))
			} else {
				throw new Error("Failed to get metadata columns!")
			}

			setGroups(groupBy(
				columns.items as Column[],
				column => column.attributes.group
			));
		}

		asyncFetch();
		return () => controller.abort()
	}, [])

	return groupedColumns === null ? <div>Loading...</div> :
		<div id="dme-list-container">{
			map(groupedColumns, (columns, groupName) => <ColumnGroup
				name={groupName}
				key={groupName}
				open={open[groupName] || false}
				toggleOpen={() => setOpen(oldState => ({...oldState, groupName: !oldState[groupName]}))}
				columns={columns}
			/>)
		}</div>
}

export default ColumnGroupList
