import * as React from 'react';

import SearchBox from './searchBox'

// Same as `useState`, but also store the value in `localStorage` with a
// `key` whenever it is updated, and propogate changes to `localStorage` back
// to the state. Only supports string values.
function useLocalStorage(key: string, defaultValue: string): [string, (newValue: string) => void] {
	const storedValue = window.localStorage.getItem(key);
	const initialValue = storedValue === null ? defaultValue : storedValue;

	const [currentValue, setValue] = React.useState(initialValue);

	const setValueAndStore = (value: string) => {
		setValue(value);
		window.localStorage.setItem(key, value);
	}

	React.useEffect(() => {
		const listener = (event: StorageEvent) => {
			if(event.storageArea === window.localStorage) {
				if(event.key === null) {
					// null key means there was a clear event
					setValue(defaultValue)
				} else if(event.key === key) {
					setValue(event.newValue);
				}
			}
		}

		window.addEventListener("storage", listener);

		return () => window.removeEventListener("storage", listener);
	}, [setValue, defaultValue]);

	return [currentValue, setValueAndStore]
}

// Same as `useLocalStorage`, but typed. Uses `toString` to convert values to
// strings, and requires a `fromString` function to convert them back to T.
function useTypedLocalStorage<T>(
	key: string,
	defaultValue: T,
	fromString: (value: string) => T,
): [T, (newValue: T) => void] {
	const [value, setValue] = useLocalStorage(key, defaultValue.toString());
	const setTypedValue = React.useCallback((value: T) => setValue(value.toString()), [setValue]);
	return [fromString(value), setTypedValue]
}

const Main: React.FC = () => {
	const [searchText, setSearchText] = useLocalStorage("searchText", "");
	const [allowDeprecated, setAllowDeprecated] = useTypedLocalStorage("allowDeprecated", false, value => value === 'true');
	const [onlySegments, setOnlySegments] = useTypedLocalStorage("onlySegments", false, value => value === 'true');

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
