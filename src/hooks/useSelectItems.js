import { useReducer } from "react";

export default function() {
  // TODO: should this be a set? not sure how much slower than a list it would be and if I care about keeping items ordered
  const initialState = [];

  function reducer(state, action) {
    // console.log("useSelectItems action:", action);
    switch (action.type) {
      case "select_one":
        return [...state, action.item];

      case "select_many":
        return [...state, ...action.items];

      case "unselect_one":
        return state.filter(item => item !== action.item);

      case "unselect_many":
        return state.filter(item => !action.items.includes(item));

      case "unselect_all":
        return initialState;

      default:
        throw new Error();
    }
  }

  const [selectedItems, dispatch] = useReducer(reducer, initialState);

  const toggleSelectItem = item => {
    // console.log("toggleSelectItem()", item);
    if (selectedItems.includes(item)) {
      dispatch({ type: "unselect_one", item });
    } else {
      dispatch({ type: "select_one", item });
    }
  };

  const unselectAllItems = () => {
    // console.log("unselectAllItems()");
    dispatch({ type: "unselect_all" });
  };

  const areItemsSelected = items => {
    // console.log("areItemsSelected()", items);
    return items.every(item => selectedItems.includes(item));
  };

  const selectMany = items => {
    dispatch({ type: "select_many", items });
  };

  const unselectMany = items => {
    dispatch({ type: "unselect_many", items });
  };

  return {
    selectedItems,
    toggleSelectItem,
    unselectAllItems,
    areItemsSelected,
    selectMany,
    unselectMany
  };
}
