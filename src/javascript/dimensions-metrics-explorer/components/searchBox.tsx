import * as React from 'react'

import Icon from '../../components/icon';
import {
  useEventValue,
  useEventChecked
} from '../../hooks'

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
        <label className="FormControl-info">
          <input
            className="Checkbox"
            type="checkbox"
            onChange={setOnlySegmentsEvent}
            checked={onlySegments}
           />
          Only show fields that are allowed in segments
        </label>
        <label className="FormControl-info">
          <input
            className="Checkbox"
            type="checkbox"
            onChange={setAllowDeprecatedEvent}
            checked={allowDeprecated}
           />
          Include deprecated fields
        </label>
      </div>
    </div>
   </form>
}

export default SearchBox;
