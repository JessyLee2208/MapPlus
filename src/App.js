import React, { useEffect, useState, useCallback, useRef } from 'react';

import {
  GoogleMap,
  useLoadScript,
  Marker,
  StandaloneSearchBox
} from '@react-google-maps/api';
import {
  SearchInput,
  InformationBox,
  SearchBox,
  InformationBg,
  Frame,
  InformationBoxS,
  SingInBtn,
  Back,
  BackTitle,
  SearchBoxNoShadow,
  SearchBg
} from './style';
import StoreCardL from './Components/StoreCardL';
import StoreCardS from './Components/StoreCardS';
import StoreDetail from './Components/StoreDetail';
import DishDetail from './Components/DishDetail';
import {
  getMenuData,
  googleAccountSignIn,
  googleAccountLogOut,
  getStoreData
} from './Utils/firebase';
import getMorereDetail from './Utils/getMoreDetail';
import { useDispatch, useSelector } from 'react-redux';

import algoliasearch from 'algoliasearch';
import CommentModal from './Components/CommentModal';
import ReminderModal from './Components/ReminderModal';

const libraries = ['drawing', 'places'];
const center = {
  lat: 25.020397,
  lng: 121.533053
};

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_API_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

const searchIndex = searchClient.initIndex('googlemap_search');
const host_name = 'http://localhost:5000';

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KRY,
    libraries
  });
  // googleAccountStateChanged();

  const dispatch = useDispatch();
  const show = useSelector((state) => state.modalShow);
  const userStatus = useSelector((state) => state.userStatus);
  const menuData = useSelector((state) => state.menuData);
  const selectedDish = useSelector((state) => state.selectedDish);

  const mapRef = useRef();
  const searchRef = useRef();

  const [bounds, setBounds] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [select, setSelect] = useState(null);
  const [content, setContent] = useState([]);
  const [mapStore, setMapStore] = useState([]);

  const [algoliaStore, setAlgoliaStore] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [mapContainerStyle, setMapContainerStyle] = useState({
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -10
  });

  const [makerSelected, setMakerSelected] = useState(null);

  useEffect(() => {
    if (mapStore.length > 0 && algoliaStore && mapStore) {
      console.log(mapStore, algoliaStore);
      algoliaStore.forEach((store) => {
        if (store) {
          const condition = mapStore.find(
            (storename) => storename.name === store.name
          );
          if (!condition) {
            mapStore.unshift(store);
            setMarkers((current) => [
              ...current,
              {
                lat: store.geometry.lat,
                lng: store.geometry.lng,
                storename: store.name
              }
            ]);
          }
        }
      });
      setContent(mapStore);
    }
  }, [mapStore, algoliaStore]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onSearchLoad = useCallback((search) => {
    searchRef.current = search;
  }, []);

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';

  const service = new window.google.maps.places.PlacesService(mapRef.current);

  const onBoundsChanged = () => {
    setBounds(mapRef.current.getBounds());
  };
  const hanldePlacesChanged = () => {
    setMarkers([]);
    setSelect(null);
    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    const places = searchRef.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    const placePromises = [];

    places.forEach(async (place) => {
      let placeName = place.name.replaceAll('/', ' ');
      setMarkers((current) => [
        ...current,
        {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          storename: place.name
        }
      ]);
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      const placePromise = fetch(`${host_name}/getStoreURL/${placeName}`).then(
        async (res) => {
          const a = await res.json();

          return { ...place, deliver: a };
        }
      );
      placePromises.push(placePromise);
    });

    setMapContainerStyle({
      width: 'calc(100vw - 435px)',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: '435px',
      zIndex: -10
    });

    mapRef.current.fitBounds(bounds);

    const callback = (data) => {
      dispatch({
        type: 'setMenuData',
        data: data
      });
    };

    Promise.all(placePromises).then((res) => {
      setMapStore(res);
      if (res.length === 1) {
        if (res[0].deliver.uberEatUrl) {
          getMenuData(res[0].name, callback);
        } else {
          dispatch({
            type: 'setMenuData',
            data: null
          });
        }
      }
    });
  };

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    markers.forEach((marker) => {
      if (e.target.id === marker.storename) {
        setSelect(marker);
      }
    });
    content.forEach((product) => {
      if (e.target.id === product.name) {
        fetch(`${host_name}/getStoreProducts`, {
          method: 'post',
          body: JSON.stringify(product.deliver),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(async (res) => {
          await res.json();
        });

        getMorereDetail(product, service, setMakerSelected);

        if (product.deliver.uberEatUrl || product.deliver.foodPandaUrl) {
          function setData(data) {
            dispatch({
              type: 'setMenuData',
              data: data
            });
          }
          getMenuData(product.name, setData);
        } else {
          dispatch({
            type: 'setMenuData',
            data: null
          });
        }

        if (e.target.id === 'link') {
        }

        //
      }
    });
  }

  function handleBack() {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });

    dispatch({
      type: 'setCollectData',
      data: []
    });
  }

  function handleSearchText(e) {
    setSearchText(e.target.value);
  }

  const handleSearch = async (queryText) => {
    try {
      await searchIndex.search(queryText).then(({ hits }) => {
        dispatch({
          type: 'setSearchMenu',
          data: hits
        });

        let algoliaSearchData = [];
        hits.forEach((hit) => {
          const data = getStoreData(hit.storeCollectionID);
          algoliaSearchData.push(data);
        });
        Promise.all(algoliaSearchData).then((res) => {
          setAlgoliaStore(res);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Frame>
      {show && userStatus ? (
        <CommentModal show={show}></CommentModal>
      ) : (
        <div></div>
      )}
      {show && !userStatus ? (
        <ReminderModal show={show}></ReminderModal>
      ) : (
        <div></div>
      )}

      {!selectedDish ? (
        <StandaloneSearchBox
          onLoad={onSearchLoad}
          onPlacesChanged={hanldePlacesChanged}
          bounds={bounds}
        >
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="搜尋 Google 地圖"
              onChange={handleSearchText}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchText);
                }
              }}
              // value={searchText}
            ></SearchInput>
          </SearchBox>
        </StandaloneSearchBox>
      ) : (
        <>
          <StandaloneSearchBox
            onLoad={onSearchLoad}
            onPlacesChanged={hanldePlacesChanged}
            bounds={bounds}
          >
            <SearchBoxNoShadow>
              <SearchInput
                type="text"
                placeholder="搜尋 Google 地圖"
              ></SearchInput>
            </SearchBoxNoShadow>
          </StandaloneSearchBox>
          <Back>
            <BackTitle onClick={handleBack}>返回上一頁</BackTitle>
          </Back>
          <SearchBg></SearchBg>
        </>
      )}

      {content.length > 1 && select === null && selectedDish === null ? (
        <InformationBg>
          <InformationBox onClick={handleStoreListClick}>
            {content.map((product, key) => (
              <StoreCardL
                key={product.place_id}
                product={product}
                id={product.name}
              />
            ))}
          </InformationBox>
        </InformationBg>
      ) : content && content.length === 1 && selectedDish === null ? (
        content.map((product, index) => (
          <StoreDetail
            key={index}
            product={product}
            menu={menuData}
          ></StoreDetail>
        ))
      ) : makerSelected !== null &&
        menuData !== null &&
        selectedDish === null ? (
        <StoreDetail product={makerSelected} menu={menuData}></StoreDetail>
      ) : makerSelected !== null && selectedDish === null ? (
        <StoreDetail product={makerSelected}></StoreDetail>
      ) : selectedDish ? (
        <DishDetail></DishDetail>
      ) : (
        <></>
      )}

      {select ? (
        <InformationBoxS onClick={handleStoreListClick}>
          {content.length > 1 ? (
            content.map((product, key) => (
              <StoreCardS key={key} product={product} id={product.name} />
            ))
          ) : (
            <div></div>
          )}
        </InformationBoxS>
      ) : (
        <div></div>
      )}
      {!userStatus ? (
        <SingInBtn
          onClick={(e) => {
            googleAccountSignIn(e, dispatch);
          }}
        >
          登入
        </SingInBtn>
      ) : (
        <SingInBtn
          onClick={(e) => {
            googleAccountLogOut(e, dispatch);
          }}
        >
          登出
        </SingInBtn>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        style={{ padding: 0 }}
      >
        {markers.map((marker, key) => (
          <Marker
            key={key}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelect(marker);
              dispatch({
                type: 'setSelectedTab',
                data: 'information'
              });
              content.forEach((product) => {
                if (marker.storename === product.name) {
                  getMorereDetail(product, service, setMakerSelected);
                  dispatch({
                    type: 'setSelectedDish',
                    data: null
                  });
                }
              });
            }}
          />
        ))}
      </GoogleMap>
    </Frame>
  );
}

export default App;
