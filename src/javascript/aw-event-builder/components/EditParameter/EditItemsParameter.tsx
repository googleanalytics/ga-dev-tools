import React from "react";
import IconButton from "../../../components/icon-button";
import ParameterList from "../ParameterList";
import { ItemArray, Item, defaultOptionalString, Parameter } from "../../types";

interface EditItemProps {
  item: Item;
  isFirst: boolean;
}

const EditItem: React.FC<EditItemProps> = ({ item, isFirst }) => {
  const parameters = React.useMemo<Parameter[]>(
    () => Object.values(item.parameters),
    [item]
  );
  const customParameters = React.useMemo<Parameter[]>(
    () => Object.values(item.customParameters),
    [item]
  );
  const updateParameters = React.useCallback(() => {}, []);
  const updateCustomParameters = React.useCallback(() => {}, []);
  const addCustomParameter = React.useCallback(() => {}, []);
  return (
    <div className="HitBuilderParam">
      <ParameterList
        showAdd={isFirst ? isFirst : undefined}
        parameters={parameters}
        customParameters={customParameters}
        updateParameters={updateParameters}
        updateCustomParameters={updateCustomParameters}
        addCustomParameter={addCustomParameter}
      />
    </div>
  );
};

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
      const nu = old.concat([
        {
          parameters: { name: defaultOptionalString("name") },
          customParameters: {}
        }
      ]);
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
      {localValues.map((item, idx) => (
        <div key={`item-${idx}`} className="HitBuilderParam--item">
          <EditItem item={item} isFirst={idx === 0} />
        </div>
      ))}
    </div>
  );
};
export default EditArrayParameter;
