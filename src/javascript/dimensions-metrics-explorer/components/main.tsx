// Copyright 2019 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
