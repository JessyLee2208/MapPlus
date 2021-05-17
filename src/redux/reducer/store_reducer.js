const initState = {
  selectedTab: 'information'
};
export default function storeReducer(preState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case 'setSelectedTab':
      return {
        selectedTab: data
      };
    case 'setVariant':
      return {};

    default:
      return preState;
  }
}
