import * as React from 'react';

import SearchBox from './searchBox'
import ColumnGroupList from './columnGroupList'
import {
	useLocalStorage,
	useTypedLocalStorage
} from '../../hooks'

const Main: React.FC = () => {
	const [searchText, setSearchText] = useLocalStorage("searchText", "");
	const [allowDeprecated, setAllowDeprecated] = useTypedLocalStorage("allowDeprecated", false);
	const [onlySegments, setOnlySegments] = useTypedLocalStorage("onlySegments", false);

	return <div>
		<SearchBox
			searchText={searchText}
			setSearchText={setSearchText}
			allowDeprecated={allowDeprecated}
			setAllowDeprecated={setAllowDeprecated}
			onlySegments={onlySegments}
			setOnlySegments={setOnlySegments}
		/>
		<ColumnGroupList
			searchText={searchText}
			allowDeprecated={allowDeprecated}
			onlySegments={onlySegments}
		/>
	</div>
};

export default Main;
