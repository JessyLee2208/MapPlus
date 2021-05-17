import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'map-780c3.firebaseapp.com',
  databaseURL: 'https://map-780c3-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'map-780c3',
  storageBucket: 'map-780c3.appspot.com',
  messagingSenderId: '325004892900',
  appId: '1:325004892900:web:35d2415ed401a3543feaf1',
  measurementId: 'G-TJPYL7R7M5'
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const postStoreData = (storeData) => {
  return db
    .collection('store')
    .doc(storeData.place_id)
    .set(storeData)
    .then(() => {
      console.log('Document successfully written!');
    });
};

const GetMenuData = (selectedStoreName) => {
  return new Promise((res, rej) => {
    const promises = [];
    db.collection('menu')
      .where('storeName', '==', selectedStoreName)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          promises.push(doc.data());
        });
        res(promises);
      });
  });
};

export { postStoreData, GetMenuData };
