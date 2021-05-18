import React from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { SearchInput, InformationBox, SearchBox, InformationBg, Frame, InformationBoxS } from './style';
import StoreCardL from './Components/StoreCardL';
import StoreCardS from './Components/StoreCardS';
import StoreDetail from './Components/StoreDetail';
import { postStoreData, GetMenuData } from './Utils/firebase';
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

  const menuList = [];

  const mapRef = React.useRef();
  const searchRef = React.useRef();

  const [bounds, setBounds] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  const [select, setSelect] = React.useState(null);
  const [content, setContent] = React.useState([]);
  const [menuData, setMenuData] = React.useState([]);
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

    const places = searchRef.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    const placePromises = [];

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
      console.log(res);
      setContent(res);
    });
  };

  function handleStoreListClick(e) {
    markers.forEach((marker) => {
      if (e.target.id === marker.storename) {
        setSelect(marker);
        dispatch({
          type: 'setSelectedTab',
          data: 'information'
        });
      }
    });
    content.forEach((product) => {
      if (e.target.id === product.name) {
        console.log(product.deliver);
        const host_name = 'http://localhost:5000';
        const placePromise = fetch(`${host_name}/getStoreProducts`, {
          method: 'post',
          body: JSON.stringify(product.deliver),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(async (res) => {
          console.log(await res.json());
        });
        GetMorereDetail(product, service, setMakerSelected);
        dispatch({
          type: 'setSelectedTab',
          data: 'information'
        });
        if (product.deliver.uberEatUrl) {
          GetMenuData(product.name, menuList).then((res) => {
            console.log(res);
            setMenuData(res);
          });
        } else {
          setMenuData(null);
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
      {show ? <ModalControl show={show}></ModalControl> : <div></div>}
      <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={hanldePlacesChanged} bounds={bounds}>
        <SearchBox>
          <SearchInput type="text" placeholder="搜尋 Google 地圖"></SearchInput>
        </SearchBox>
      </StandaloneSearchBox>
      {content.length > 1 && select === null ? (
        <InformationBg>
          <InformationBox onClick={handleStoreListClick}>
            {content.map((product, key) => (
              <StoreCardL key={product.place_id} product={product} id={product.name} />
            ))}
          </InformationBox>
        </InformationBg>
      ) : content.length === 1 ? (
        content.map((product, index) => <StoreDetail key={product.place_id} product={product}></StoreDetail>)
      ) : makerSelected !== null && menuData !== null ? (
        <StoreDetail key={makerSelected.place_id} product={makerSelected} menu={menuData}></StoreDetail>
      ) : makerSelected !== null ? (
        <StoreDetail key={makerSelected.place_id} product={makerSelected}></StoreDetail>
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
      {/* <ModalControl
        show={show}
        onClose={() => {
          dispatch({
            type: 'setModalShow',
            data: false
          });
          // this.setState({ show: false });
        }}
      ></ModalControl> */}
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
