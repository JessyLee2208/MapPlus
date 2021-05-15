import React from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { SearchInput, InformationBox, SearchBox, InformationBg, Frame, InformationBoxS } from './style';
import StoreCardL from './Components/StoreCardL';
import StoreCardS from './Components/StoreCardS';
import StoreDetail from './Components/StoreDetail';
import postStoreData from './Utils/firebase';

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
  const [storCardsS, setStorCardsS] = React.useState(false);

  let makerSelected = null;

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

    places.forEach((place) => {
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
        //
        // var storeData = {
        //   address_components: place.address_components,
        //   business_status: place.business_status,
        //   deliver: a,
        //   formatted_address: place.formatted_address,
        //   formatted_phone_number: place.formatted_phone_number,
        //   geometry: {
        //     lat: place.geometry.location.lat(),
        //     lng: place.geometry.location.lng()
        //   },
        //   name: place.name,
        //   rating: place.rating,
        //   photo: place.photos[0].getUrl(),
        //   periods: place.opening_hours.periods,
        //   user_ratings_total: place.user_ratings_total,
        //   website: place.website,
        //   weekday_text: place.weekday_text
        // };

        // postStoreData(storeData);

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
      console.log(res);
    });
  };

  if (select) {
    makerSelected = content.find((cont) => cont.name === select.storename);
    console.log(select);
  }

  function handleStoreListClick(e) {
    console.log(123);
    markers.forEach((marker) => {
      if (e.target.id === marker.storename) {
        console.log(marker.lat, marker.lng);
        setSelect(marker);
        setStorCardsS(true);
      }
    });
  }

  function handleStoreListClickS(e) {
    console.log(123);
    markers.forEach((marker) => {
      if (e.target.id === marker.storename) {
        console.log(marker.lat, marker.lng);
        setSelect(marker);
        setStorCardsS(true);
      }
    });
  }

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
              <StoreCardL
                key={key}
                product={product}
                // position={{ lat: product.geometry.location.lat(), lng: product.geometry.location.lng() }}
                id={product.name}
              />
            ))}
          </InformationBox>
        </InformationBg>
      ) : content.length === 1 ? (
        content.map((product, index) => <StoreDetail key={index} product={product}></StoreDetail>)
      ) : select ? (
        <StoreDetail key={999} product={makerSelected}></StoreDetail>
      ) : (
        <div></div>
      )}
      {storCardsS ? (
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
              setSelect(marker);
            }}
          />
        ))}
      </GoogleMap>
    </Frame>
  );
}

export default App;
