import React from "react";
import IconButton from "../../../components/icon-button";
import ParameterList from "../ParameterList";
import {
  ItemArrayParam,
  Item,
  defaultStringParam,
  Parameter,
  MPEvent
} from "../../types";

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
  const parameters = React.useMemo<Parameter[]>(() => item.parameters, [item]);
  const updateParameters = React.useCallback(
    update => {
      updateItem(old => ({ ...old, parameters: update(old.parameters) }));
    },
    [updateItem]
  );
  const addParameter = React.useCallback(() => {
    updateItem(old => {
      const nu = old.parameters.concat([defaultStringParam("")]);
      if (MPEvent.hasDuplicateNames(nu)) {
        return old;
      }
      return {
        ...old,
        parameters: nu
      };
    });
  }, [updateItem]);
  return (
    <div className="HitBuilderParam">
      <ParameterList
        isNested
        indentation={6}
        parameters={parameters}
        updateParameters={updateParameters}
        addParameter={addParameter}
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
  items: ItemArrayParam;
  updateParameter: (nu: ItemArrayParam) => void;
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
      const nu = old.concat([{ parameters: [] }]);
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
    (idx: number) => (oldName: string, nuName: string) => {
      setLocalValues(old =>
        old.map((item, i) => {
          if (idx !== i) {
            return item;
          }
          const nuParameters = item.parameters.map(p =>
            p.name === oldName ? { ...p, name: nuName } : p
          );
          if (MPEvent.hasDuplicateNames(nuParameters)) {
            return item;
          }
          return {
            ...item,
            parameters: nuParameters
          };
        })
      );
    },
    [setLocalValues]
  );

  return (
    <div className="HitBuilderParam--items">
      {localValues.map((item, idx) => (
        <div key={`item-${idx}`} className="HitBuilderParam--item">
          <div className="HitBuilderParam--itemIndex">
            <span style={{}}>Item {idx + 1}</span>
          </div>
          <EditItem
            removeItem={removeItem(idx)}
            updateParameterName={updateParameterName(idx)}
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
