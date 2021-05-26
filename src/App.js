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
import StoreDetail from './View/StoreDetail';
import DishDetail from './View/DishDetail';
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

import CollectionList from './View/CollectionList';

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

  const mapMarkers = useSelector((state) => state.mapMarkers);
  const selectedStore = useSelector((state) => state.selectedStore);
  const selectedDish = useSelector((state) => state.selectedDish);
  const collectionMarks = useSelector((state) => state.collectionMarks);
  const collectionCheck = useSelector((state) => state.collectionTitle);
  const collectionList = useSelector((state) => state.collectionList);

  const mapRef = useRef();
  const searchRef = useRef();

  const [bounds, setBounds] = useState(null);
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

  useEffect(() => {
    if (mapStore.length > 1 && algoliaStore && mapStore) {
      console.log(mapStore, algoliaStore);

      algoliaStore.forEach((store) => {
        if (store) {
          const condition = mapStore.find(
            (storename) => storename.name === store.name
          );

          if (!condition) {
            mapStore.unshift(store);
            // dispatch({
            //   type: 'setSelectedDish',
            //   data: null
            // });
            dispatch({
              type: 'updateMapMarkers',
              data: store
            });
          }
        }
      });

      setContent(mapStore);
    }
  }, [mapStore, algoliaStore]);

  useEffect(() => {
    let newPlaceArray = [];
    if (collectionMarks.length > 0) {
      collectionMarks.forEach((placeMarkers) => {
        const request = {
          placeId: placeMarkers.place_id,
          fields: ['geometry']
        };

        const c = new Promise((res, rej) => {
          service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const geometry = place.geometry;
              res({ ...placeMarkers, geometry: geometry });
            }
          });
        });
        newPlaceArray.push(c);
      });
      Promise.all(newPlaceArray).then((res) => {
        res.forEach((view) => {
          if (view.geometry.viewport) {
            bounds.union(view.geometry.viewport);
          } else {
            bounds.extend(view.geometry.location);
          }
        });
        mapRef.current.fitBounds(bounds);
      });
    }
  }, [collectionMarks]);

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
    dispatch({
      type: 'setCollectionMarks',
      data: []
    });

    dispatch({
      type: 'initMapMarkers',
      data: []
    });
    dispatch({
      type: 'setSelectedStore',
      data: null
    });

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
      dispatch({
        type: 'setMapMarkers',
        data: place
      });

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
        setContent(res);
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

    console.log(mapMarkers);

    mapMarkers.forEach((marker) => {
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

        getMorereDetail(product, service).then((res) => {
          dispatch({
            type: 'setSelectedStore',
            data: res
          });
        });

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

  const handleMarkerClick = (marker) => {
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });

    collectionList.forEach((product) => {
      if (marker.storename === product.name) {
        const newMarker = {
          lat: product.geometry.lat,
          lng: product.geometry.lng,
          storename: product.name
        };

        dispatch({
          type: 'setSelectedStore',
          data: product
        });
        dispatch({
          type: 'initMapMarkers',
          data: [newMarker]
        });

        dispatch({
          type: 'setCollectionMarks',
          data: []
        });

        dispatch({
          type: 'setCollectionTitle',
          data: false
        });
        dispatch({
          type: 'setSelectedDish',
          data: null
        });
      }
    });
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

      {content.length > 1 &&
      select === null &&
      selectedDish === null &&
      !collectionCheck ? (
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
      ) : content &&
        content.length === 1 &&
        selectedStore === null &&
        selectedDish === null &&
        !collectionCheck ? (
        content.map((product, index) => (
          <StoreDetail
            key={index}
            product={product}
            menu={menuData}
          ></StoreDetail>
        ))
      ) : selectedStore !== null &&
        menuData !== null &&
        selectedDish === null &&
        !collectionCheck ? (
        <StoreDetail product={selectedStore} menu={menuData}></StoreDetail>
      ) : selectedStore !== null &&
        selectedDish === null &&
        !collectionCheck ? (
        <StoreDetail product={selectedStore}></StoreDetail>
      ) : selectedDish && !collectionCheck ? (
        <DishDetail></DishDetail>
      ) : collectionCheck ? (
        <CollectionList></CollectionList>
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
        {collectionMarks.length === 0 ? (
          mapMarkers.map((marker, key) => (
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
                    getMorereDetail(product, service).then((res) => {
                      dispatch({
                        type: 'setSelectedStore',
                        data: res
                      });
                    });
                    dispatch({
                      type: 'setSelectedDish',
                      data: null
                    });
                  }
                });
              }}
            />
          ))
        ) : collectionCheck ? (
          collectionMarks.map((marker, key) =>
            collectionCheck === '想去的地點' ? (
              <Marker
                key={key}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: '/falg_marker.png',
                  scaledSize: new window.google.maps.Size(20, 30)
                }}
                onClick={() => {
                  handleMarkerClick(marker);
                }}
              />
            ) : collectionCheck === '喜愛的地點' ? (
              <Marker
                key={key}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: '/heart_marker.png',
                  scaledSize: new window.google.maps.Size(20, 30)
                }}
                onClick={() => {
                  handleMarkerClick(marker);
                }}
              />
            ) : collectionCheck === '已加星號的地點' ? (
              <Marker
                key={key}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: '/star_marker.png',
                  scaledSize: new window.google.maps.Size(20, 30)
                }}
                onClick={() => {
                  handleMarkerClick(marker);
                }}
              />
            ) : (
              <></>
            )
          )
        ) : (
          <></>
        )}
      </GoogleMap>
    </Frame>
  );
}

export default App;
