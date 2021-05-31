import React from 'react';

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
  return fetch(`${host_name}/getStoreURL/${placeName}`).then(async (res) => {
    const a = await res.json();

    return { ...place, deliver: a };
  });
}

export { getStoreMenu, getStoreUrl };
