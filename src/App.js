import React from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { SearchInput, InformationBox, SearchBox, InformationBg, Frame } from './style';
import StoreCard from './Components/StoreCard';
import StoreDetail from './Components/StoreDetail';
import postStoreData from './Utils/firebase';

const libraries = ['drawing', 'places'];
// const mapContainerStyle = {
//   width: '100vw',
//   height: '100vh'
// };
const center = {
  lat: 25.020397,
  lng: 121.533053
};

const zoom = 16;

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KRY,
    libraries
  });

  const mapRef = React.useRef();
  const searchRef = React.useRef();

  const [bounds, setBounds] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);

  const [slescted, setSelect] = React.useState(null);
  const [content, setContent] = React.useState([]);
  const [mapContainerStyle, setMapContainerStyle] = React.useState({
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -10
  });
  let productList;

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onSearchLoad = React.useCallback((search) => {
    searchRef.current = search;
  }, []);

  // React.useEffect(() => {
  //   console.log(content.length);
  //   if (content.length > 1) {
  //     constList = ;
  //   }
  //   console.log(constList);
  // }, [content]);

  if (loadError) return 'ErrorLoading';
  if (!isLoaded) return 'Loading Maps';

  const onBoundsChanged = () => {
    setBounds(mapRef.current.getBounds());
  };
  const hanldePlacesChanged = () => {
    const host_name = 'http://localhost:5000';

    setMarkers([]);

    const places = searchRef.current.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    const placePromises = [];
    places.forEach((place) => {
      let placeName = place.name.replaceAll('/', ' ');
      setMarkers((current) => [
        ...current,
        { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), storename: placeName }
      ]);
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
        // console.log(bounds.extend(place.geometry.location));
      }
      // if (places.length > 1) {
      //   setContent(places.map((place, key) => <StoreCard key={key} product={place} />));
      //   // setZoom(8);
      // } else if (places.length === 1) {
      //   console.log(places.length);
      // }

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

    // setContent(places);

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

  if (content.length > 1) {
    productList = (
      <InformationBg>
        <InformationBox>
          {content.map((product, key) => (
            <StoreCard key={key} product={product} />
          ))}
        </InformationBox>
      </InformationBg>
    );
  }

  if (content.length === 1) {
    content.map((product) => (productList = <StoreDetail key={999} product={product}></StoreDetail>));
  }

  // if (content.length > 0) {
  //   setMapContainerStyle({ width: '80vw', height: '90vh' });
  // }

  return (
    <Frame>
      <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={hanldePlacesChanged} bounds={bounds}>
        <SearchBox>
          <SearchInput type="text" placeholder="搜尋 Google 地圖"></SearchInput>
        </SearchBox>
      </StandaloneSearchBox>
      {productList}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        style={{ padding: 0 }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.lat + marker.lng}
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
