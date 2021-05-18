const initState = {
  selectedTab: 'information',
  modalShow: true,
  selectedDish: null
};
export default function storeReducer(preState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case 'setSelectedTab':
      return {
        modalShow: preState.modalShow,
        selectedTab: data,
        selectedDish: preState.selectedDish
      };
    case 'setModalShow':
      return {
        selectedTab: preState.selectedTab,
        modalShow: data,
        selectedDish: preState.selectedDish
      };
    case 'setSelectedDish':
      return {
        selectedTab: preState.selectedTab,
        modalShow: preState.modalShow,
        selectedDish: data
      };

    default:
      return preState;
  }
}
