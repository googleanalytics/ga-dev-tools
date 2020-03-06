import React from "react";
import IconButton from "../../../components/icon-button";
import { ItemArray, Item } from "../../types";

interface EditItemArrayParameterProps {
  items: ItemArray;
  updateParameter: (nu: ItemArray) => void;
}

const EditArrayParameter: React.FC<EditItemArrayParameterProps> = ({
  items,
  updateParameter
}) => {
  const [localValues, setLocalValues] = React.useState<Array<Item>>(
    items.value
  );
  const addItem = React.useCallback(() => {
    setLocalValues(old => {
      const nu = old.concat([{ name: "" }]);
      updateParameter({ ...items, value: nu });
      return nu;
    });
  }, [updateParameter]);

  const updateLocalValue = React.useCallback(
    (idx: number) => (nu: Item) =>
      setLocalValues(old => old.map((item, i) => (idx === i ? nu : item))),
    []
  );

  const updateWithLocalParameter = React.useCallback(() => {
    if (localValues !== items.value) {
      updateParameter({ ...items, value: localValues });
    }
  }, [localValues]);

  return (
    <div className="HitBuilderParam--items">
      <IconButton
        type="add-circle"
        iconStyle={{ color: "hsl(150,60%,40%)" }}
        onClick={addItem}
      >
        Add Item
      </IconButton>
      {localValues.map((localValue, idx) => (
        <div className="HitBuilderParam--item">
          <label>Item {idx + 1}</label>
          {Object.entries(localValue).map(([key, value], idx2) => (
            <div key={`${idx}-${idx2}-${key}`} className="HitBuilderParam">
              <label className="HitBuilderParam-label">{key}</label>
              <input
                className="FormField"
                value={value}
                onChange={e => {
                  updateLocalValue(idx)({
                    ...localValue,
                    [key]: e.target.value
                  });
                }}
                onBlur={updateWithLocalParameter}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default EditArrayParameter;
