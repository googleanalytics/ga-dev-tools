import React from "react";
import IconButton from "../../../components/icon-button";
import ParameterList from "../ParameterList";
import { ItemArray, Item, defaultOptionalString, Parameter } from "../../types";

interface EditItemProps {
  item: Item;
  updateItem: (update: (old: Item) => Item) => void;
  updateParameterName: (oldName: string, nuName: string) => void;
  isFirst: boolean;
  removeItem: () => void;
}

const EditItem: React.FC<EditItemProps> = ({
  item,
  updateItem,
  removeItem
}) => {
  const parameters = React.useMemo<Parameter[]>(
    () => Object.values(item.parameters),
    [item]
  );
  const customParameters = React.useMemo<Parameter[]>(
    () => Object.values(item.customParameters),
    [item]
  );
  const updateParameters = React.useCallback(
    update => {
      updateItem(old => ({ ...old, parameters: update(old.parameters) }));
    },
    [updateItem]
  );
  const updateCustomParameters = React.useCallback(
    update => {
      updateItem(old => ({
        ...old,
        customParameters: update(old.customParameters)
      }));
    },
    [updateItem]
  );
  const addCustomParameter = React.useCallback(() => {
    updateItem(old => ({
      ...old,
      customParameters: {
        ...old.customParameters,
        "": defaultOptionalString("")
      }
    }));
  }, [updateItem]);
  return (
    <div className="HitBuilderParam">
      <ParameterList
        indentation={6}
        oneList
        parameters={parameters}
        customParameters={customParameters}
        updateParameters={updateParameters}
        updateCustomParameters={updateCustomParameters}
        addCustomParameter={addCustomParameter}
      >
        <IconButton
          onClick={removeItem}
          type="remove-circle"
          iconStyle={{ color: "hsl(0,70%,55%)" }}
        >
          Remove Item
        </IconButton>
      </ParameterList>
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

  React.useEffect(() => {
    if (localValues !== items.value) {
      updateParameter({ ...items, value: localValues });
    }
  }, [localValues]);

  const addItem = React.useCallback(() => {
    setLocalValues(old => {
      /* const first = old.length > 0 && old[0]; */
      /* const customParameters = first ? first.customParameters : {}; */
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

  const removeItem = React.useCallback(
    (idx: number) => () => {
      setLocalValues(old =>
        old.slice(0, idx).concat(old.slice(idx + 1, old.length))
      );
    },
    [setLocalValues]
  );

  const updateItem = React.useCallback(
    (idx: number) => (cb: (old: Item) => Item) =>
      setLocalValues(old =>
        old.map((item, i) => (idx === i ? cb(item) : item))
      ),
    []
  );

  const updateParameterName = React.useCallback(
    (oldName: string, nuName: string) => {
      setLocalValues(old =>
        old.map(item => {
          const nuItem = { ...item };
          const oldParameterValue = nuItem.customParameters[oldName];
          delete nuItem.customParameters[oldName];
          nuItem.customParameters[nuName] = oldParameterValue;
          return nuItem;
        })
      );
    },
    [setLocalValues]
  );

  return (
    <div className="HitBuilderParam--items">
      {localValues.map((item, idx) => (
        <div key={`item-${idx}`} className="HitBuilderParam--item">
          <div>
            <span style={{}}>Item {idx + 1}</span>
          </div>
          <EditItem
            removeItem={removeItem(idx)}
            updateParameterName={updateParameterName}
            item={item}
            isFirst={idx === 0}
            updateItem={updateItem(idx)}
          />
        </div>
      ))}
      <IconButton
        type="add-circle"
        iconStyle={{ color: "hsl(150,60%,40%)" }}
        onClick={addItem}
      >
        Add Item
      </IconButton>
    </div>
  );
};
export default EditArrayParameter;
