// Some useful utility hooks for React 16.8
import * as React from "react";

// Convert a callback taking a string into a callback taking event.target.value
export const useEventValue = (setValue: (value: string) => void) =>
  React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    [setValue]
  );

// Convert a callback taking a boolean into a callback taking event.target.checked
export const useEventChecked = (setChecked: (checked: boolean) => void) =>
  React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setChecked(event.target.checked),
    [setChecked]
  );

// Same as `useState`, but also store the value in `localStorage` with a
// `key` whenever it is updated, and initialize the state from `localStorage`,
// if present. If `subscribe` is true, also propogate changes from localStorage
// from other tabs into the state.
export const useLocalStorage = function(
  key: string,
  initialValue: string | (() => string),
  subscribe: boolean = true
): [string, React.Dispatch<React.SetStateAction<string>>] {
  // Set up the state; initialize from localStorage if available.
  const [currentValue, setValue] = React.useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null
      ? storedValue
      : initialValue instanceof Function
      ? initialValue()
      : initialValue;
  });

  // Create a wrapper around setValue that also stores to localStorage
  const setValueAndStore = React.useCallback(
    (value: React.SetStateAction<string>) =>
      setValue((oldValue: string) => {
        let newValue = value instanceof Function ? value(oldValue) : value;
        window.localStorage.setItem(key, newValue);
        return newValue;
      }),
    [setValue, key]
  );

  // If subscribe is true, subscribe to localStorage events and call
  // setValue when there are changes
  React.useEffect(() => {
    if (subscribe) {
      const listener = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage) {
          if (event.key === null) {
            // null key key means that there was a global storage clear event
            setValue(
              initialValue instanceof Function ? initialValue() : initialValue
            );
          } else if (event.key === key) {
            if (event.newValue === null) {
              setValue(
                initialValue instanceof Function ? initialValue() : initialValue
              );
            } else {
              setValue(event.newValue);
            }
          }
        }
      };

      window.addEventListener("storage", listener);

      return () => window.removeEventListener("storage", listener);
    }
  }, [key, setValue, initialValue, subscribe]);

  return [currentValue, setValueAndStore];
};

// Same as `useLocalStorage`, but typed. Uses `JSON.parse` and
// `JSON.stringify`` to convert values back and forth between strings
// in `localStorage`.
export function useTypedLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  subscribe: boolean = true
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getInitialString = React.useCallback(
    () =>
      initialValue instanceof Function
        ? initialValue().toString()
        : initialValue.toString(),
    [initialValue]
  );

  const [currentString, setString] = useLocalStorage(
    key,
    getInitialString,
    subscribe
  );

  const setValue = React.useCallback(
    (value: React.SetStateAction<T>) =>
      setString((oldString: string) => {
        if (value instanceof Function) {
          return JSON.stringify(value(JSON.parse(oldString)));
        } else {
          return JSON.stringify(value);
        }
      }),
    [setString]
  );

  return [JSON.parse(currentString), setValue];
}

export const useHash = () => {
  const [hash, setHash] = React.useState(
    window.location.hash.replace(/^#/, "")
  );

  React.useEffect(() => {
    const listener = (ev: HashChangeEvent) => {
      setHash(new URL(ev.newURL).hash.replace(/^#/, ""));
    };

    window.addEventListener("hashchange", listener, { passive: true });

    return () => window.removeEventListener("hashchange", listener);
  }, []);

  return hash;
};
