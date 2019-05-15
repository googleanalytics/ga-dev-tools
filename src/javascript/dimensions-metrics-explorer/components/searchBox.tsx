import * as React from 'react'

import Icon from '../../components/icon';

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
  const setText = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [setSearchText]
  );

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
            onChange={setText} />
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
          <label>
            <input
              className="Checkbox"
              type="checkbox"
              onChange={set}
              checked={!!settings.useDefinition} />
            Show segment definitions instead of IDs.
          </label>
        </div>
      </div>
    </div>
   </form>
}
