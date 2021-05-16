import React from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox, Autocomplete } from '@react-google-maps/api';
import { SearchInput, InformationBox, SearchBox, InformationBg, Frame, InformationBoxS } from './style';
import StoreCardL from './Components/StoreCardL';
import StoreCardS from './Components/StoreCardS';
import StoreDetail from './Components/StoreDetail';
import postStoreData from './Utils/firebase';
import GetMorereDetail from './Components/GetMoreDetail';

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

  const mapRef = React.useRef();
  const searchRef = React.useRef();

  const [bounds, setBounds] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  const [select, setSelect] = React.useState(null);
  const [content, setContent] = React.useState([]);
  const [mapContainerStyle, setMapContainerStyle] = React.useState({
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -10
  });

  const [makerSelected, setMakerSelected] = React.useState(null);

  const service = new window.google.maps.places.PlacesService(mapRef.current);

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onSearchLoad = React.useCallback((search) => {
    searchRef.current = search;
  }, []);

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';

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
        console.log(marker.lat, marker.lng);
        setSelect(marker);
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
      }
    });
  }
  console.log(select);

  return (
    <Frame>
      <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={hanldePlacesChanged} bounds={bounds}>
        <SearchBox>
          <SearchInput type="text" placeholder="搜尋 Google 地圖"></SearchInput>
        </SearchBox>
      </StandaloneSearchBox>
      {content.length > 1 && select === null ? (
        <InformationBg>
          <InformationBox onClick={handleStoreListClick}>
            {content.map((product, key) => (
              <StoreCardL key={key} product={product} id={product.name} />
            ))}
          </InformationBox>
        </InformationBg>
      ) : content.length === 1 ? (
        content.map((product, index) => <StoreDetail key={index} product={product}></StoreDetail>)
      ) : makerSelected !== null ? (
        <StoreDetail key={999} product={makerSelected}></StoreDetail>
      ) : (
        <div></div>
      )}
      {select ? (
        <InformationBoxS onClick={handleStoreListClick}>
          {content.length > 1 ? (
            content.map((product, key) => <StoreCardS key={key} product={product} id={product.name} />)
          ) : (
            <div></div>
          )}
        </InformationBoxS>
      ) : (
        <div></div>
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
