import * as React from 'react'

import Icon from '../../components/icon';

// Convert a callback taking a string into a callback taking event.target.value
const useEventValue = (setValue: (value: string) => void) => React.useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
  [setValue]
)

// Convert a callback taking a boolean into a callback taking event.target.checked
const useEventChecked = (setChecked: (checked: boolean) => void) => React.useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked),
  [setChecked]
)


const SearchBox: React.FC<{
  searchText: string,
  onlySegments: boolean,
  allowDeprecated: boolean,

  setSearchText: (text: string) => void,
  setOnlySegments: (value: boolean) => void,
  setAllowDeprecated: (value: boolean) => void,
}> = ({
  searchText, onlySegments, allowDeprecated,
  setSearchText, setOnlySegments, setAllowDeprecated,
}) => {
  const setTextEvent = useEventValue(setSearchText);
  const setOnlySegmentsEvent = useEventChecked(setOnlySegments);
  const setAllowDeprecatedEvent = useEventChecked(setAllowDeprecated);
  const clearText = React.useCallback(
    () => setSearchText(""),
    [setSearchText]
  );

  return <form>
    <div className="FormControl FormControl--inline">
      <label className="FormControl-label">Search</label>
      <div className="FormControl-body">
        <div className="FlexLine">
          <input
            className="FormField FormFieldAddOn-field"
            value={searchText}
            onChange={setTextEvent} />
          <button
            type="button"
            className="FormFieldAddOn-item"
            onClick={clearText}
            title="Clear search term"
            tabIndex={-1}>
            <Icon type="close" />
          </button>
        </div>
        <div className="FormControl-info">
          <input
            className="Checkbox"
            type="checkbox"
            onChange={setOnlySegmentsEvent}
            checked={onlySegments}
           />
          <label>Only show fields that are allowed in segments</label>
        </div>
        <div className="FormControl-info">
          <input
            className="Checkbox"
            type="checkbox"
            onChange={setAllowDeprecatedEvent}
            checked={allowDeprecated}
           />
          <label>Include deprecated fields</label>
        </div>
      </div>
    </div>
   </form>
}

export default SearchBox;
