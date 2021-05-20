import React from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { SearchInput, InformationBox, SearchBox, InformationBg, Frame, InformationBoxS, SingInBtn } from './style';
import StoreCardL from './Components/StoreCardL';
import StoreCardS from './Components/StoreCardS';
import StoreDetail from './Components/StoreDetail';
import DishDetail from './Components/DishDetail';
import {
  postStoreData,
  GetMenuData,
  GoogleAccountSignIn,
  GoogleAccountStateChanged,
  GoogleAccountLogOut
  // userReviewCheck
} from './Utils/firebase';
import GetMorereDetail from './Components/GetMoreDetail';
import { useDispatch, useSelector } from 'react-redux';
// import { Modal } from 'react-bootstrap';
import ModalControl from './Components/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const libraries = ['drawing', 'places'];
const center = {
  lat: 25.020397,
  lng: 121.533053
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KRY,
    libraries
  });

  const dispatch = useDispatch();
  const show = useSelector((state) => state.modalShow);
  const userStatus = useSelector((state) => state.userStatus);
  const menuData = useSelector((state) => state.menuData);
  const selectedDish = useSelector((state) => state.selectedDish);
  GoogleAccountStateChanged();
  // if (userStatus) {
  //   userReviewCheck(userStatus).then((res) => {
  //     // console.log(res);
  //   });
  // }

  const menuList = [];

  const mapRef = React.useRef();
  const searchRef = React.useRef();

  const [bounds, setBounds] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  const [select, setSelect] = React.useState(null);
  const [content, setContent] = React.useState([]);
  // const [menuData, setMenuData] = React.useState([]);
  const [mapContainerStyle, setMapContainerStyle] = React.useState({
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -10
  });

  const [makerSelected, setMakerSelected] = React.useState(null);

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onSearchLoad = React.useCallback((search) => {
    searchRef.current = search;
  }, []);

  // modal
  // const [show, setShow] = React.useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  //

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';
  const service = new window.google.maps.places.PlacesService(mapRef.current);

  const onBoundsChanged = () => {
    setBounds(mapRef.current.getBounds());
  };
  const hanldePlacesChanged = () => {
    const host_name = 'http://localhost:5000';

    setMarkers([]);
    setSelect(null);
    dispatch({
      type: 'setSelectedDish',
      data: null
    });

    const places = searchRef.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    const placePromises = [];
    const a = GoogleAccountStateChanged();

    places.forEach(async (place) => {
      let placeName = place.name.replaceAll('/', ' ');
      setMarkers((current) => [
        ...current,
        { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), storename: place.name }
      ]);
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      const placePromise = fetch(`${host_name}/getStoreURL/${placeName}`).then(async (res) => {
        const a = await res.json();

        return { ...place, deliver: a };
      });
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

    Promise.all(placePromises).then((res) => {
      setContent(res);
      if (res.length === 1) {
        if (res[0].deliver.uberEatUrl) {
          GetMenuData(res[0].name, menuList, dispatch).then((res) => {
            dispatch({
              type: 'setMenuData',
              data: res
            });
          });
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
        const host_name = 'http://localhost:5000';
        const placePromise = fetch(`${host_name}/getStoreProducts`, {
          method: 'post',
          body: JSON.stringify(product.deliver),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(async (res) => {
          await res.json();
        });

        GetMorereDetail(product, service, setMakerSelected);

        if (product.deliver.uberEatUrl) {
          GetMenuData(product.name, menuList, dispatch).then((res) => {
            console.log(res);
            // setMenuData(res);
            dispatch({
              type: 'setMenuData',
              data: res
            });
          });
          // GetMenuData(product.name);
        } else {
          // setMenuData(null);
          dispatch({
            type: 'setMenuData',
            data: null
          });
        }

        console.log(e.target);
        if (e.target.id === 'link') {
        }

        //
      }
    });
  }

  return (
    <Frame>
      {show ? <ModalControl show={show} key="ModalControl"></ModalControl> : <div></div>}
      <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={hanldePlacesChanged} bounds={bounds}>
        <SearchBox>
          <SearchInput type="text" placeholder="搜尋 Google 地圖"></SearchInput>
        </SearchBox>
      </StandaloneSearchBox>
      {/* <DishDetail></DishDetail> */}
      {content.length > 1 && select === null && selectedDish === null ? (
        <InformationBg>
          <InformationBox onClick={handleStoreListClick}>
            {content.map((product, key) => (
              <StoreCardL key={product.place_id} product={product} id={product.name} />
            ))}
          </InformationBox>
        </InformationBg>
      ) : content.length === 1 && selectedDish === null ? (
        content.map((product, index) => (
          <StoreDetail key={product.place_id + 'detail'} product={product} menu={menuData}></StoreDetail>
        ))
      ) : makerSelected !== null && menuData !== null && selectedDish === null ? (
        <StoreDetail key={makerSelected.place_id + 'detail'} product={makerSelected} menu={menuData}></StoreDetail>
      ) : makerSelected !== null && selectedDish === null ? (
        <StoreDetail key={makerSelected.place_id + 'detail'} product={makerSelected}></StoreDetail>
      ) : selectedDish ? (
        <DishDetail></DishDetail>
      ) : (
        <div></div>
      )}
      {select ? (
        <InformationBoxS onClick={handleStoreListClick}>
          {content.length > 1 ? (
            content.map((product, key) => <StoreCardS key={key + 's'} product={product} id={product.name} />)
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
            const signin = GoogleAccountSignIn(e, dispatch);
          }}
        >
          登入
        </SingInBtn>
      ) : (
        <SingInBtn
          onClick={(e) => {
            const logOut = GoogleAccountLogOut(e, dispatch);
            console.log(logOut);
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
              console.log(marker);
              console.log(123);
              setSelect(marker);
              dispatch({
                type: 'setSelectedTab',
                data: 'information'
              });
              content.forEach((product) => {
                if (marker.storename === product.name) {
                  console.log(product.name);
                  GetMorereDetail(product, service, setMakerSelected);
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
