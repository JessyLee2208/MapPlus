import React from 'react';
import { GoogleMap, useLoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { SearchInput, InformationBox, SearchBox, InformationBg } from './style';
import StoreCard from './Components/StoreCard';
import StoreDetail from './Components/StoreDetail';
import postStoreData from './Utils/firebase';

const libraries = ['drawing', 'places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
};
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
  let productList;
  let constList = null;

  const onMapLoad = React.useCallback((map) => {
    console.log(5);
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
    console.log(4);
    const host_name = 'http://localhost:5000';

    setMarkers([]);

    const places = searchRef.current.getPlaces();
    console.log(places);
    const bounds = new window.google.maps.LatLngBounds();
    places.forEach((place) => {
      let placeName = place.name.replaceAll('/', ' ');
      setMarkers((current) => [
        ...current,
        { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), storename: placeName }
      ]);
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
        console.log(bounds.union(place.geometry.viewport));
      } else {
        bounds.extend(place.geometry.location);
        // console.log(bounds.extend(place.geometry.location));
      }

      // console.log(place.opening_hours.open_now);
      // console.log(place.opening_hours.periods);
      // if (places.length > 1) {
      //   setContent(places.map((place, key) => <StoreCard key={key} product={place} />));
      //   // setZoom(8);
      // } else if (places.length === 1) {
      //   console.log(places.length);
      // }

      // fetch(`${host_name}/getStoreURL/${placeName}`).then(async (res) => {
      //   const a = await res.json();
      //   console.log(a);
      //   var storeData = {
      //     formatted_address: place.formatted_address,
      //     address_components: place.address_components,
      //     geometry: {
      //       lat: place.geometry.location.lat(),
      //       lng: place.geometry.location.lng()
      //     },
      //     formatted_phone_number: place.formatted_phone_number,
      //     rating: place.rating,
      //     name: place.name,
      //     user_ratings_total: place.user_ratings_total,
      //     website: place.website,
      //     business_status: place.business_status,
      //     photo: place.photos[0].getUrl(),
      //     periods: place.opening_hours.periods
      //   };

      //   postStoreData(storeData);
      // });
    });
    setContent(places);
    console.log(places.length);

    mapRef.current.fitBounds(bounds);
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

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        style={{ padding: 0 }}
      >
        <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={hanldePlacesChanged} bounds={bounds}>
          <SearchBox>
            <SearchInput type="text" placeholder="搜尋 Google 地圖"></SearchInput>
          </SearchBox>
        </StandaloneSearchBox>
        {productList}
        <StoreDetail proudct={content[0]}></StoreDetail>
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
    </div>
  );
}

export default App;
