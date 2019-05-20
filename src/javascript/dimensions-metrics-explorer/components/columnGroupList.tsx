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

const ColumnSubgroup: React.FC<{
	columns: Column[],
	name: 'Dimensions' | 'Metrics',
}> = ({
	columns, name
}) => (
	<div className="dme-group-list-subgroup">
		<span className="dme-group-list-subgroup-header">{name}</span>
		<ul>{
			columns.map(column => <li key={column.id}>{column.id}</li>)
		}</ul>
	</div>
)

const ColumnGroup: React.FC<{
	open: boolean,
	toggleOpen: (group: string) => void,
	name: string,
	columns: Column[]
}> = ({
	open, toggleOpen, name, columns
}) => {
	const onClick = React.useCallback(() => toggleOpen(name), [toggleOpen, name])

	return <div className="dme-group">
		<div className="dme-group-header" onClick={onClick}>
			<span className="dme-group-collapse">
				<Icon type={open ? 'remove-circle' : 'add-circle'} />
			</span>
			<span>{name}</span>
		</div>
		<div className="dme-group-list" hidden={!open}>
			<ColumnSubgroup
				name="Dimensions"
				columns={columns.filter(column => column.attributes.type === 'DIMENSION')}
			/>
			<ColumnSubgroup
				name="Metrics"
				columns={columns.filter(column => column.attributes.type === 'METRIC')}
			/>
		</div>
	</div>
}

const ColumnGroupList: React.FC<{
	allowDeprecated: boolean,
	searchText: string,
	onlySegments: boolean,
}> = ({
	allowDeprecated,
	searchText,
	onlySegments,
}) => {
	const [columns, setColumns] = React.useState<null | Column[]>(null);
	const [open, setOpen] = React.useState<{[ group: string ]: boolean}>({});

	const toggleGroupOpen = React.useCallback(
		(group: string) => setOpen(oldOpen => ({...oldOpen, [group]: !oldOpen[group]})),
		[]
	);

	const closeAll = React.useCallback(() => setOpen({}), [setOpen]);

	const searchTerms = React.useMemo<string[]>(
		() => searchText.toLowerCase().split(/\s+/).filter(t => t),
		[searchText]
	)

	// Fetch all of the columns from the metadata API
	React.useEffect(() => {
		const controller = new AbortController();

		const asyncFetch = async () => {
			var fetchedColumns: any

			// This loop is just to retry cache misses
			do {
				const response = await fetch(
					"https://content.googleapis.com/analytics/v3/metadata/ga/columns",
					{
						headers: new Headers({
							'Authorization': `Bearer ${window.GAPI_ACCESS_TOKEN}`,
							'If-None-Match': window.localStorage.getItem("columnsEtag") || "",
						}),
						signal: controller.signal,
					});

				if(response.status === 304) {
					if(response.headers.get("etag") === window.localStorage.getItem("columnsEtag")) {
						fetchedColumns = JSON.parse(window.localStorage.getItem("cachedColumnsBlob") || "");
					} else {
						// We got a 304 response, but our local etag changed. Retry.
						continue
					}
				} else if (response.ok) {
					fetchedColumns = await response.json()

					window.localStorage.setItem("columnsEtag", response.headers.get("etag") || "")
					window.localStorage.setItem("cachedColumnsBlob", JSON.stringify(fetchedColumns))
				} else {
					throw new Error("Failed to get metadata columns!")
				}
			} while(false);

			setColumns(fetchedColumns.items)
		}

		asyncFetch();
		return () => controller.abort()
	}, [])

	if(columns === null) {
		return <div>Loading...</div>;
	} else {
		// TODO: make these filters processing lazy

		// Groups, in order. We use a separate list to ensure consistent ordering
		// between renders
		console.log(columns)
		let filteredColumns: Column[] = columns;

		if(!allowDeprecated) {
			filteredColumns = filteredColumns.filter(column => column.attributes.status != 'DEPRECATED')
		}

		if(onlySegments) {
			filteredColumns = filteredColumns.filter(column => column.attributes.allowedInSegments)
		}

		if(searchText) {
			// TODO: refactor this search logic to somewhere more sensible
			filteredColumns = filteredColumns.filter(
				column => searchTerms.every(
					term => column.id.indexOf(term) != -1 && column.attributes.uiName.indexOf(term) != -1)
			)
		}

		// JS Sets guarantee insertion order is preserved
		const groupedColumns = groupBy(filteredColumns, column => column.attributes.group)

		return <div>{
			map(groupedColumns, (columns, groupName) =>
				<div key={groupName}>
					<ColumnGroup
						open={open[groupName] || false}
						columns={columns}
						name={groupName}
						toggleOpen={toggleGroupOpen}
					/>
				</div>
			)
		}</div>
	}
}

export default ColumnGroupList
