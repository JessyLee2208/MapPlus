import { postStoreData } from './firebase';
import { getStoreUrl } from './fetch';

function formatStoreData(all) {
  const upLoadDataToFirebaseData = {
    address_components: all.address_components || '',
    business_status: all.business_status || '',
    deliver: all.deliver,
    formatted_address: all.formatted_address || '',
    formatted_phone_number: all.formatted_phone_number || '',
    geometry:
      all.geometry.lat && all.geometry.lng
        ? {
            lat: all.geometry.lat,
            lng: all.geometry.lng
          }
        : {
            lat: all.geometry.location.lat(),
            lng: all.geometry.location.lng()
          },
    icon: all.icon || '',
    name: all.name || '',
    rating: all.rating || 0,
    opening_hours: all.opening_hours
      ? {
          weekday_text: all.opening_hours.weekday_text,
          periods: all.opening_hours.periods
        }
      : {},

    place_id: all.place_id || '',
    plus_code: all.plus_code || '',
    price_level: all.price_level || '',

    photo: all.photos ? [all.photos[0].getUrl()] : all.photo,
    reviews: all.reviews || [],
    types: all.types || [],
    user_ratings_total: all.user_ratings_total || '',
    website: all.website || ''
  };
  return upLoadDataToFirebaseData;
}

function getMorereDetail(product, service) {
  const request = {
    placeId: product.place_id,
    fields: [
      'name',
      'formatted_address',
      'place_id',
      'geometry',
      'opening_hours',
      'reviews',
      'formatted_phone_number',
      'website'
    ]
  };

  return new Promise((res, rej) => {
    let moreDetail = {};

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.opening_hours) {
        moreDetail = {
          name: place.name,
          place_id: place.place_id,
          formatted_address: place.formatted_address,
          reviews: place.reviews,
          formatted_phone_number: place.formatted_phone_number,
          website: place.website,
          opening_hours: {
            isOpen: place.opening_hours.isOpen ? place.opening_hours.isOpen() : '',
            weekday_text:
              place.opening_hours.weekday_text && place.opening_hours.weekday_text !== undefined
                ? place.opening_hours.weekday_text
                : '',
            periods: place.opening_hours.periods || ''
          }
        };
      } else if (status === window.google.maps.places.PlacesServiceStatus.OK && place.opening_hours === undefined) {
        moreDetail = {
          name: place.name,
          place_id: place.place_id,
          formatted_address: place.formatted_address,
          reviews: place.reviews,
          formatted_phone_number: place.formatted_phone_number,
          website: place.website,
          opening_hours: {
            isOpen: null,
            weekday_text: null,
            periods: null
          }
        };
      }

      const all = { ...product, ...moreDetail };
      res(all);
      const upLoadDataToFirebaseData = formatStoreData(all);
      postStoreData(upLoadDataToFirebaseData);
    });
  });
}

function getStoreDetail(place_id, service) {
  const request = {
    placeId: place_id,
    fields: [
      'name',
      'formatted_address',
      'place_id',
      'geometry',
      'opening_hours',
      'reviews',
      'formatted_phone_number',
      'website',
      'plus_code',
      'photos',
      'user_ratings_total',
      'types',
      'price_level',
      'business_status',
      'address_components',
      'rating'
    ]
  };
  return new Promise((res, rej) => {
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const opening_hours = {
          isOpen: place.opening_hours && place.opening_hours.isOpen(),
          periods: place.opening_hours && place.opening_hours.periods,
          weekday_text: place.opening_hours && place.opening_hours.weekday_text
        };
        const newData = { ...place, opening_hours: place.opening_hours ? opening_hours : '' };
        getStoreUrl(place.name, newData).then((data) => {
          res(data);

          const upLoadDataToFirebaseData = formatStoreData(data);
          postStoreData(upLoadDataToFirebaseData);
        });
      }
    });
  });
}

export default getMorereDetail;
export { getStoreDetail };
