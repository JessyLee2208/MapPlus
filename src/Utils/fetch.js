// const host_name = 'https://hsiaohan.cf';
const host_name = 'http://localhost:5000';

function getStoreMenu(deliver) {
  fetch(`${host_name}/getStoreProducts`, {
    method: 'post',
    body: JSON.stringify(deliver),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (res) => {
    await res.json();
  });
}

function getStoreUrl(placeName, place) {
  return fetch(`${host_name}/getStoreURL/${placeName}`)
    .then(async (res) => {
      const deliverData = await res.json();

      return {
        ...place,
        opening_hours: place.opening_hours
          ? {
              weekday_text: place.weekday_text || '',
              periods: place.periods || ''
            }
          : { isOpen: null, weekday_text: null, periods: null },

        deliver: deliverData
      };
    })
    .catch((error) => console.error(error));
}

export { getStoreMenu, getStoreUrl };
