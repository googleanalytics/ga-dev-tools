import * as React from 'react';

import SearchBox from './searchBox'

// Same as `useState`, but also store the value in `localStorage` with a
// `key` whenever it is updated, and propogate changes to `localStorage` back
// to the state. Only supports string values.
function useLocalStorage(
	key: string,
	initialValue: string | (() => string),
): [string, React.Dispatch<React.SetStateAction<string>>] {
	const [currentValue, setValue] = React.useState(() => {
		const storedValue = window.localStorage.getItem(key);
		return (
			storedValue !== null ? storedValue :
			initialValue instanceof Function ? initialValue() :
			initialValue
		);
	})

	const setValueAndStore = React.useCallback(
		(value: React.SetStateAction<string>) => setValue((oldValue: string) => {
			let newValue = value instanceof Function ? value(oldValue) : value;
			window.localStorage.setItem(key, newValue);
			return newValue;
		}),
		[setValue, key]
	)

	React.useEffect(() => {
		const listener = (event: StorageEvent) => {
			if(event.storageArea === window.localStorage) {
				if(event.key === null) {
					// null key means there was a clear event
					setValue(initialValue instanceof Function ? initialValue() : initialValue)
				} else if(event.key === key) {
					setValue(event.newValue);
				}
			}
		}

		window.addEventListener("storage", listener);

		return () => window.removeEventListener("storage", listener);
	}, [key, setValue, initialValue]);

	return [currentValue, setValueAndStore]
}

// Same as `useLocalStorage`, but typed. Uses `toString` to convert values to
// strings, and requires a `fromString` function to convert them back to T.
function useTypedLocalStorage<T>(
	key: string,
	initialValue: T | (() => T),
	fromString: (value: string) => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const getInitialString = React.useCallback(
		() => initialValue instanceof Function ? initialValue().toString() : initialValue.toString(),
		[initialValue]
	);

	const [currentString, setString] = useLocalStorage(key, getInitialString);

	const setValue = React.useCallback((value: React.SetStateAction<T>) => setString((oldString: string) => {
		if(value instanceof Function) {
			return value(fromString(oldString)).toString();
		} else {
			return value.toString();
		}
	}), [setString, fromString]);

	return [fromString(currentString), setValue]
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
