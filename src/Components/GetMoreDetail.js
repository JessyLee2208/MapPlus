import { postStoreData } from '../Utils/firebase';

function GetMorereDetail(product, service, setMakerSelected) {
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

  service.getDetails(request, (place, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      const moreDetail = {
        name: place.name,
        place_id: place.place_id,
        formatted_address: place.formatted_address,
        reviews: place.reviews,
        formatted_phone_number: place.formatted_phone_number,
        website: place.website,
        opening_hours: place.opening_hours
      };
      const all = { ...product, ...moreDetail };
      setMakerSelected(all);

      let upLoadDataToFirebaseData = {
        address_components: all.address_components ? all.address_components : '',
        business_status: all.business_status ? all.business_status : '',
        deliver: all.deliver,
        formatted_address: all.formatted_address ? all.formatted_address : '',
        formatted_phone_number: all.formatted_phone_number ? all.formatted_phone_number : '',
        geometry: {
          lat: all.geometry.location.lat(),
          lng: all.geometry.location.lng()
        },
        icon: all.icon ? all.icon : '',
        name: all.name ? all.name : '',
        rating: all.rating ? all.rating : 0,
        opening_hours: all.opening_hours
          ? {
              weekday_text: all.opening_hours.weekday_text,
              periods: all.opening_hours.periods
            }
          : {},

        place_id: all.place_id ? all.place_id : '',
        price_level: all.price_level ? all.price_level : '',
        photo: all.photos ? all.photos[0].getUrl() : '',
        reviews: all.reviews ? all.reviews : [],
        types: all.types ? all.types : [],
        user_ratings_total: all.user_ratings_total ? all.user_ratings_total : '',
        website: all.website ? all.website : ''
      };
      postStoreData(upLoadDataToFirebaseData);
    }
  });
}

export default GetMorereDetail;
