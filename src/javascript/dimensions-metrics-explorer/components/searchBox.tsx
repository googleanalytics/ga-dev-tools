import * as React from 'react'

import Icon from '../../components/icon';

const SearchText: React.FC<{
  searchText: string,
  setSearchText: (text: string) => void,
}> = ({
  searchText, setSearchText
}) => {
  const setText = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [setSearchText]
  );

  const clearText = React.useCallback(
    () => setSearchText(""),
    [setSearchText]
  );

  return <div className="FormControl FormControl--inline">
    <label className="FormControl-label">Search</label>
    <div className="FormControl-body">
      <div className="FlexLine">
        <input
          className={"FormField FormFieldAddOn-field"}
          value={searchText}
          onChange={setText} />
        <button
          type="button"
          className="FormFieldAddOn-item"
          onClick={clearText}
          title={"Clear search term"}
          tabIndex={-1}>
          <Icon type="close" />
        </button>
      </div>
    </div>
  </div>
}

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
  return <form>
    <SearchText searchText={searchText} setSearchText={setSearchText}/>
  </form>
}

export default SearchBox;
