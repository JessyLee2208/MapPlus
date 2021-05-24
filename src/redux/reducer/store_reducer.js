const initState = {
  selectedTab: 'information',
  modalShow: false,
  selectedDish: null,
  userStatus: null,
  menuData: null,
  collect: false,
  collectData: [],
  searchMenu: null,
  userReviewSet: null
};
export default function storeReducer(preState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case 'setSelectedTab':
      return {
        ...preState,
        selectedTab: data
      };
    case 'setModalShow':
      return {
        ...preState,
        modalShow: data
      };
    case 'setSelectedDish':
      return {
        ...preState,
        selectedDish: data
      };
    case 'setUserState':
      return {
        ...preState,
        userStatus: data
      };

    case 'setMenuData':
      return {
        ...preState,
        menuData: data
      };
    case 'upDateMenuData': {
      const index = preState.menuData.findIndex(
        (data) => data.name === preState.selectedDish.name
      );
      const newMenuData = [...preState.menuData];
      const NewObj = { ...newMenuData[index], rating: data };
      newMenuData[index] = NewObj;
      return {
        ...preState,
        menuData: newMenuData
      };
    }

    case 'upDateSelectMenuData': {
      const NewObj = { ...preState.selectedDish, rating: data };

      return {
        ...preState,
        selectedDish: NewObj
      };
    }

    case 'setCollect': {
      return {
        ...preState,
        collect: true
      };
    }

    case 'setCollectData': {
      return {
        ...preState,
        collectData: data
      };
    }

    case 'setSearchMenu': {
      return {
        ...preState,
        searchMenu: data
      };
    }

    case 'setUserReviewSet': {
      return {
        ...preState,
        userReviewSet: data
      };
    }

    default:
      return preState;
  }
}
