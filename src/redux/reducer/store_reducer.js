const initState = {
  selectedTab: 'information',
  modalShow: false,
  selectedDish: null,
  userStatus: null,
  menuData: null
};
export default function storeReducer(preState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case 'setSelectedTab':
      return {
        modalShow: preState.modalShow,
        selectedTab: data,
        selectedDish: preState.selectedDish,
        userStatus: preState.userStatus,
        menuData: preState.menuData
      };
    case 'setModalShow':
      return {
        selectedTab: preState.selectedTab,
        modalShow: data,
        selectedDish: preState.selectedDish,
        userStatus: preState.userStatus,
        menuData: preState.menuData
      };
    case 'setSelectedDish':
      return {
        selectedTab: preState.selectedTab,
        modalShow: preState.modalShow,
        selectedDish: data,
        userStatus: preState.userStatus,
        menuData: preState.menuData
      };
    case 'setUserState':
      return {
        selectedTab: preState.selectedTab,
        modalShow: preState.modalShow,
        selectedDish: preState.selectedDish,
        userStatus: data,
        menuData: preState.menuData
      };

    case 'setMenuData':
      return {
        selectedTab: preState.selectedTab,
        modalShow: preState.modalShow,
        selectedDish: preState.selectedDish,
        userStatus: preState.userStatus,
        menuData: data
      };
    default:
      return preState;
  }
}
