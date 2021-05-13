const initState = {};
export default function storeReducer(preState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case 'saveData':
      return {};
    case 'setVariant':
      return {};

    default:
      return preState;
  }
}
