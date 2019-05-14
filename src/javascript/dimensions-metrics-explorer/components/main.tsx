import React from 'react';

import SearchBox from './searchBox'

const Main: React.FC = () => {
	const [searchText, setSearchText] = React.useState("");
	const [allowDeprecated, setAllowDeprecated] = React.useState(false);
	const [onlySegments, setOnlySegments] = React.useState(false);

	return <div>
		<SearchBox
			searchText={searchText}
			setSearchText={setSearchText}
			allowDeprecated={allowDeprecated}
			setAllowDeprecated={setAllowDeprecated}
			onlySegments={onlySegments}
			setOnlySegments={setOnlySegments}
		/>
	</div>
};

export default Main;
