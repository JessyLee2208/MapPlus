const initState = {
  selectedTab: 'information',
  modalShow: false,
  storeData: [],
  mapMarkers: [],
  selectedStore: null,
  selectedDish: null,
  userStatus: null,
  collectionMarks: [],
  collectionTitle: false,
  collectionList: [],
  menuData: null,
  collect: false,
  collectData: [],
  searchMenu: null,
  userReviewSet: null,
  informationWindow: true,
  storeHover: null,

  loginToast: false,
  markerHover: null,
  customList: []
};
export default function storeReducer(preState = initState, action) {
  const { type, data } = action;

  switch (type) {
    case 'setSelectedStore':
      return {
        ...preState,
        selectedStore: data
      };

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
      const index = preState.menuData.findIndex((data) => data.name === preState.selectedDish.name);
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

    case 'updateCollectData': {
      return {
        ...preState,
        collectData: [...preState.collectData, data]
      };
    }

    case 'setSearchMenu': {
      return {
        ...preState,
        searchMenu: data
      };
    }

    case 'upDateSearchMenu': {
      const index = preState.searchMenu.findIndex((data) => data.name === preState.selectedDish.name);
      const newMenuData = [...preState.searchMenu];
      const NewObj = { ...newMenuData[index], rating: data };

      newMenuData[index] = NewObj;
      return {
        ...preState,
        searchMenu: newMenuData
      };
    }

    case 'setUserReviewSet': {
      return {
        ...preState,
        userReviewSet: data
      };
    }

    case 'setCollectionMarks': {
      return {
        ...preState,
        collectionMarks: data
      };
    }

    case 'setCollectionTitle': {
      return {
        ...preState,
        collectionTitle: data
      };
    }

    case 'setCollectionList': {
      return {
        ...preState,
        collectionList: data
      };
    }

    case 'setStoreData': {
      return {
        ...preState,
        storeData: data
      };
    }

    case 'setMapMarkers': {
      return {
        ...preState,
        mapMarkers: [
          ...preState.mapMarkers,
          {
            lat: data.geometry.location.lat(),
            lng: data.geometry.location.lng(),
            place_id: data.place_id,
            storename: data.name
          }
        ]
      };
    }

    case 'updateMapMarkers': {
      return {
        ...preState,
        mapMarkers: [
          ...preState.mapMarkers,
          {
            lat: data.geometry.lat,
            lng: data.geometry.lng,
            place_id: data.place_id,
            storename: data.name
          }
        ]
      };
    }

    case 'selectMapIcon': {
      return {
        ...preState,
        storeData: [data],
        selectedDish: null,
        selectedStore: null,

        mapMarkers: [
          {
            lat: data.geometry.location.lat(),
            lng: data.geometry.location.lng(),
            place_id: data.place_id,
            storename: data.name
          }
        ]
      };
    }

    case 'initMapMarkers': {
      return {
        ...preState,
        mapMarkers: data
      };
    }

    case 'setInformationWindow': {
      return {
        ...preState,
        informationWindow: data
      };
    }

    case 'setStoreHover': {
      return {
        ...preState,
        storeHover: data
      };
    }

    case 'setloginToast': {
      return {
        ...preState,
        loginToast: data
      };
    }

    case 'setMarkerHover': {
      return {
        ...preState,
        markerHover: data
      };
    }

    case 'setCustomList': {
      return {
        ...preState,
        customList: data
      };
    }

    case 'updateCustomList': {
      return {
        ...preState,
        customList: [...preState.customList]
      };
    }

    case 'searchInputUpdate': {
      return {
        ...preState,
        storeData: [],
        collectionMarks: [],
        selectedStore: null,
        selectedDish: null,
        mapMarkers: [],
        storeHover: null,
        selectedTab: 'information'
      };
    }

    case 'searchInputInit': {
      return {
        ...preState,
        storeData: [],
        mapMarkers: [],
        selectedStore: null,
        selectedDish: null,
        menuData: null,
        searchMenu: null
      };
    }

    case 'webDataInit': {
      return {
        ...preState,
        storeData: [],
        mapMarkers: [],
        selectedStore: null,
        selectedDish: null,
        menuData: null,
        searchMenu: null,
        collectionTitle: false,
        collectionMarks: [],
        selectedTab: 'information'
      };
    }

    case 'setlogOutData': {
      return {
        ...preState,
        collectionTitle: false,
        loginToast: false,
        userStatus: null,
        customList: []
      };
    }

    case 'setCollectionData': {
      return {
        ...preState,
        collectionTitle: false,
        mapMarkers: [data.mapMarker],
        collectionMarks: [],
        storeData: [data.collection]
      };
    }

    default:
      return preState;
  }
}
