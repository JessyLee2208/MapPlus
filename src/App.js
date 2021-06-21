import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { GoogleMap, useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { Toaster } from 'react-hot-toast';
import algoliasearch from 'algoliasearch';
import { useDispatch, useSelector } from 'react-redux';

import StoreDetail from './View/StoreDetail';
import DishDetail from './View/DishDetail';
import SearchList from './View/SearchList';
import SearchListS from './View/SearchListS';
import MemberPage from './View/MemberPage';
import CollectionList from './View/CollectionList';
import NotFound from './View/NotFount';

import CommentModal from './Components/CommentModal';
import ReminderModal from './Components/ReminderModal';
import MapInfoWindow from './Components/InfoWindow';
import Markers from './Components/Marker';
import AddCollectionModal from './Components/AddCollectionModal';
import LoginState from './Components/LogInState';
import CurrentLoction from './Components/CurrentLoction';
import { ButtonPrimaryRoundIcon } from './Components/UIComponents/Button';
import { Loading } from './Components/UIComponents/LottieAnimat';

import { getMenuData, getStoreData } from './Utils/firebase';
import { getStoreDetail } from './Utils/getMoreDetail';
import useMediaQuery from './useHook/useMediaQuery';
import { getStoreMenu, getStoreUrl } from './Utils/fetch';
import { fitBoundsHandler } from './Utils/utils';
import { deviceSize } from './properties/properties';

const Frame = styled.div`
  position: absolute;
  top:0,
  left:0
`;

const SearchBox = styled.div`
  background: #ffffff;

  border-radius: 8px;
  width: 376px;
  height: 48px;
  padding: 0 12px;
  position: fixed;
  display: flex;

  fontsize: 14px;
  textoverflow: ellipses;

  left: 8px;
  top: 12px;
  margin-left: 8px;

  transition-duration: 0.3s;
  outline: none;

  z-index: 5;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: calc(100vw - 140px);
    margin: 0px 8px;
  }
`;
const SearchBoxShow = styled(SearchBox)`
  transition-property: background, box-shadow;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 0px rgb(0 0 0 / 2%);
  z-index: 4;
`;

const SearchInput = styled.input`
  brackground: none;
  position: relative;
  height: 100%;
  width: 95%;
  padding: 0;
  border: none;
  outline: none;
  font-size: initial;
`;

const Delete = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  font-size: 24px;
  margin-bottom: 3px;

  cursor: pointer;

  &:hover {
    color: #185ee6;
  }
`;

const libraries = ['drawing', 'places'];
const center = {
  lat: 25.020397,
  lng: 121.533053
};

const initZoom = 16;

const searchOption = {
  fields: [
    'name',
    'formatted_address',
    'place_id',
    'geometry',
    'opening_hours',
    'utc_offset_minutes',
    'reviews',
    'formatted_phone_number',
    'website'
  ]
};

const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_API_ID, process.env.REACT_APP_ALGOLIA_SEARCH_KEY);

const searchIndex = searchClient.initIndex('googlemap_search');

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KRY,
    libraries
  });

  const dispatch = useDispatch();
  const show = useSelector((state) => state.modalShow);
  const userStatus = useSelector((state) => state.userStatus);
  const menuData = useSelector((state) => state.menuData);

  const storeData = useSelector((state) => state.storeData);
  const mapMarkers = useSelector((state) => state.mapMarkers);
  const selectedStore = useSelector((state) => state.selectedStore);
  const selectedDish = useSelector((state) => state.selectedDish);
  const collectionMarks = useSelector((state) => state.collectionMarks);
  const collectionCheck = useSelector((state) => state.collectionTitle);
  const informationWindow = useSelector((state) => state.informationWindow);

  const markerHover = useSelector((state) => state.markerHover);
  const searchMenu = useSelector((state) => state.searchMenu);

  const mapRef = useRef();
  const searchRef = useRef();
  const textInput = useRef();
  const serviceRef = useRef();
  const boundsRef = useRef();

  const [bounds, setBounds] = useState(null);
  const [mapStore, setMapStore] = useState([]);
  const [markerLoad, setMarkerLoad] = useState([]);
  const [zoom, setZoom] = useState(initZoom);

  const [algoliaStore, setAlgoliaStore] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [placrCheck, setPlacrCheck] = useState(false);
  const [listCheck, setListCheck] = useState(false);
  const [memberPageShow, setMemberPageShow] = useState(false);

  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);

  const mapStyle = {
    defaultStyle: {
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: informationWindow ? -10 : 3
    },
    mapContainerStyleWithSearch: {
      width: 'calc(100vw - 435px)',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: '435px',
      zIndex: -10
    },
    mapContainerStyleWithStore: {
      width: 'calc(100vw - 435px)',
      height: 'calc(100vh - 230px)',
      position: 'absolute',
      top: 0,
      left: '435px',
      zIndex: -10
    }
  };

  const storeListExist =
    storeData && storeData.length > 1 && selectedStore === null && selectedDish === null && !collectionCheck;
  const storeDetailOnlyOneExist =
    storeData && storeData.length === 1 && selectedStore === null && selectedDish === null && !collectionCheck;
  const storeDetailAndMenuExist =
    selectedStore !== null && menuData !== null && selectedDish === null && !collectionCheck;
  const storeDetailExist = selectedStore !== null && selectedDish === null && !collectionCheck;
  const dishDetailExist = selectedDish && !collectionCheck;
  const smalleStoreExist = selectedStore && !collectionCheck && storeData.length > 1;
  const pageExist = storeListExist || storeDetailExist || collectionCheck || dishDetailExist;
  const loadingCfeck =
    !storeListExist &&
    !storeDetailExist &&
    !dishDetailExist &&
    !collectionCheck &&
    !storeDetailOnlyOneExist &&
    searchMenu &&
    !isMobile;

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const bounds = new window.google.maps.LatLngBounds();
    serviceRef.current = service;
    boundsRef.current = bounds;
  }, []);

  const onSearchLoad = useCallback((search) => {
    searchRef.current = search;
  }, []);
  const markeronLoad = useCallback((marker, storename) => {
    setMarkerLoad((m) => [...m, { mrker: marker, storename: storename }]);
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
  }, []);

  useEffect(() => {
    if (mapStore?.length > 1 && algoliaStore) {
      algoliaStore.forEach((store) => {
        const findStoreFromDishData = mapStore.find((storename) => storename.name === store.name);
        if (!findStoreFromDishData) {
          mapStore.unshift(store);
          dispatch({
            type: 'updateMapMarkers',
            data: store
          });
        }
      });
      dispatch({
        type: 'setStoreData',
        data: mapStore
      });
    }
  }, [mapStore, algoliaStore, dispatch]);

  useEffect(() => {
    if (collectionMarks.length > 0) {
      collectionMarks.forEach((view) => {
        fitBoundsHandler(view, boundsRef.current);
      });
      mapRef.current.fitBounds(boundsRef.current);
    }
  }, [collectionMarks]);

  useEffect(() => {
    if (selectedStore) {
      if (selectedStore.geometry.lat) {
        panTo({
          lat: selectedStore.geometry.lat,
          lng: selectedStore.geometry.lng
        });
      }
      if (selectedStore.geometry.location) {
        panTo({
          lat: selectedStore.geometry.location.lat(),
          lng: selectedStore.geometry.location.lng()
        });
      }
    }
  }, [selectedStore, panTo]);

  useEffect(() => {
    let pathname = window.location.pathname;
    if (pathname !== '/') {
      window.location.pathname = '';
    }
  }, []);

  const defaultMapOptions = {
    mapTypeControl: false
  };

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';

  const onBoundsChanged = () => {
    setBounds(mapRef.current.getBounds());
  };
  const hanldePlacesChanged = () => {
    dispatch({
      type: 'searchInputUpdate'
    });

    const places = searchRef.current.getPlaces();
    if (places.length === 0) {
      setPlacrCheck(true);
    } else {
      setPlacrCheck(false);
    }

    const placePromises = [];

    places.forEach(async (place) => {
      const placeName = place.name.replaceAll('/', ' ').replaceAll('#', '%23').replaceAll('%', '%25');

      dispatch({
        type: 'setMapMarkers',
        data: place
      });
      fitBoundsHandler(place, boundsRef.current);

      const placePromise = getStoreUrl(placeName, place);
      placePromises.push(placePromise);
    });

    if (places.length > 0) mapRef.current.fitBounds(boundsRef.current);

    Promise.all(placePromises).then((res) => {
      setMapStore(res);
      if (res.length === 1) {
        dispatch({
          type: 'setStoreData',
          data: res
        });
        // console.log(res[0]);
        // console.log(res[0].photos[0].getUrl());
        checkMenuExistAndDealData(res[0]);
      }
    });
  };

  const handleSearch = async (queryText) => {
    try {
      await searchIndex.search(queryText).then(({ hits }) => {
        dispatch({
          type: 'setSearchMenu',
          data: hits
        });

        const algoliaSearchData = hits.map((hit) => getStoreData(hit.storeCollectionID));

        Promise.all(algoliaSearchData).then((res) => {
          const checkData = res.splice(
            res.findIndex((item) => item === undefined),
            1
          );
          setAlgoliaStore(checkData);
        });
      });
    } catch (error) {
      console.log(error);
      setAlgoliaStore([]);
    }
  };

  function checkMenuExistAndDealData(storeData) {
    if (storeData.deliver.uberEatUrl || storeData.deliver.foodPandaUrl) {
      const getMenuDataCallback = (data) => {
        dispatch({
          type: 'setMenuData',
          data: data
        });
      };
      getMenuData(storeData.name, getMenuDataCallback);
    } else {
      dispatch({
        type: 'setMenuData',
        data: null
      });
    }
  }

  function onInformationChangeHandler() {
    if (informationWindow) {
      dispatch({
        type: 'setInformationWindow',
        data: false
      });
    } else {
      dispatch({
        type: 'setInformationWindow',
        data: true
      });
    }
  }

  function initMapSearchState() {
    textInput.current.value = '';

    dispatch({
      type: 'searchInputInit'
    });

    setSearchText('');
    setMapStore([]);
    setPlacrCheck(false);
  }

  const handleMapIconClick = (e) => {
    e.stop();

    dispatch({
      type: 'setMarkerHover',
      data: null
    });
    setMemberPageShow(false);
    getStoreDetail(e.placeId, serviceRef.current).then((res) => {
      dispatch({
        type: 'selectMapIcon',
        data: res
      });
      getStoreMenu(res.deliver);
      checkMenuExistAndDealData(res);

      textInput.current.value = res.name;
      setSearchText(res.name);
    });
  };

  const handelSearchInput = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchText);
      setSearchText(e.target.value);
    }
  };

  function checkMapSize() {
    if (isMobile) {
      return mapStyle.defaultStyle;
    }
    if (smalleStoreExist) {
      return mapStyle.mapContainerStyleWithStore;
    }
    if (storeListExist || storeDetailOnlyOneExist || searchMenu || collectionCheck) {
      return mapStyle.mapContainerStyleWithSearch;
    }
    return mapStyle.defaultStyle;
  }

  return (
    <Frame>
      {loadingCfeck && (
        <div style={{ width: '435px', height: '100vh' }}>
          {!placrCheck ? <Loading /> : <NotFound searchText={searchText} />}
        </div>
      )}

      <Toaster />
      {userStatus && memberPageShow && <MemberPage show={setMemberPageShow} check={setListCheck} />}
      {isMobile && !informationWindow ? (
        <ButtonPrimaryRoundIcon
          style={{ position: 'fixed', right: '40%', bottom: '24px', boxShadow: '0px 0px 7px rgb(0 0 0 / 25%)' }}
          onClick={onInformationChangeHandler}
          zIndex={4}
          src="/map.png"
        >
          關閉map
        </ButtonPrimaryRoundIcon>
      ) : (
        isMobile &&
        informationWindow &&
        pageExist && (
          <ButtonPrimaryRoundIcon
            style={{ position: 'fixed', right: '40%', bottom: '24px', boxShadow: '0px 0px 7px rgb(0 0 0 / 25%)' }}
            onClick={onInformationChangeHandler}
            zIndex={6}
            src="/map.png"
          >
            開啟map
          </ButtonPrimaryRoundIcon>
        )
      )}

      {userStatus && listCheck && <AddCollectionModal show={listCheck} check={setListCheck} />}
      {show && userStatus && !listCheck && <CommentModal show={show} />}
      {show && !userStatus && !listCheck && <ReminderModal show={show} />}
      <StandaloneSearchBox
        onLoad={onSearchLoad}
        onPlacesChanged={hanldePlacesChanged}
        bounds={bounds}
        options={searchOption}
      >
        <SearchBox
          onClick={() => {
            setMemberPageShow(false);
          }}
        >
          <SearchInput type="text" placeholder="搜尋 Google 地圖" onKeyDown={handelSearchInput} ref={textInput} />
          {searchText !== '' && <Delete onClick={initMapSearchState}>×</Delete>}
        </SearchBox>
      </StandaloneSearchBox>
      <SearchBoxShow />
      {storeListExist ? (
        <SearchList markerLoad={markerLoad} service={serviceRef.current} panTo={panTo} />
      ) : storeDetailOnlyOneExist ? (
        storeData.map((product, index) => (
          <StoreDetail
            key={index}
            product={product}
            menu={menuData}
            service={serviceRef.current}
            input={{ searchText, setSearchText: setSearchText, current: textInput.current }}
          />
        ))
      ) : storeDetailAndMenuExist ? (
        <StoreDetail product={selectedStore} menu={menuData} input={{ current: textInput.current }} />
      ) : storeDetailExist ? (
        <StoreDetail product={selectedStore} input={{ current: textInput.current }} />
      ) : dishDetailExist ? (
        <DishDetail dishdata={selectedDish} service={serviceRef.current} check={setListCheck} />
      ) : (
        collectionCheck && (
          <CollectionList service={serviceRef.current} panTo={panTo} seachInput={textInput} setMapStore={setMapStore} />
        )
      )}
      {smalleStoreExist && !isMobile && <SearchListS service={serviceRef.current} />}

      <LoginState setMemberPageShow={setMemberPageShow} memberPageShow={memberPageShow}></LoginState>

      <GoogleMap
        mapContainerStyle={checkMapSize()}
        zoom={zoom}
        center={center}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        options={defaultMapOptions}
        style={{ padding: 0 }}
        onClick={handleMapIconClick}
      >
        {collectionMarks.length === 0
          ? mapMarkers.map((marker, key) => (
              <Markers
                service={serviceRef.current}
                marker={marker}
                content={storeData}
                key={key}
                onLoad={markeronLoad}
              />
            ))
          : collectionCheck &&
            collectionMarks.map((marker, key) => (
              <Markers tag={collectionCheck} marker={marker} key={key} onLoad={markeronLoad} />
            ))}

        <CurrentLoction
          panTo={panTo}
          zoom={{ zoom: zoom, initZoom: initZoom, setZoom: setZoom }}
          style={{
            display: informationWindow && pageExist && isMobile ? 'none' : 'flex'
          }}
        ></CurrentLoction>

        {selectedStore && isMobile && <MapInfoWindow product={selectedStore} service={serviceRef.current} />}
        {markerHover && !isMobile && <MapInfoWindow product={markerHover} service={serviceRef.current} />}
      </GoogleMap>
    </Frame>
  );
}

export default App;
