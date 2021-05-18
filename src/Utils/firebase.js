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
    db.collection('menu')
      .where('storeName', '==', selectedStoreName)
      .onSnapshot((querySnapshot) => {
        const promises = [];
        querySnapshot.forEach((doc) => {
          promises.push(doc.data());
        });
        res(promises);
      });
  });
};

const UpLoadPhotoToFirebase = (e) => {
  let file = e.target.files[0];

  let storageRef = firebase.storage().ref('img/' + file.name);

  let task = storageRef.put(file);
  return new Promise((res, rej) => {
    task.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {},
      (error) => {
        console.log('error');
      },
      () => {
        let URL = task.snapshot.ref.getDownloadURL();
        res(URL);
      }
    );
  });
};

const UpLoadReview = (ReviewData) => {
  console.log(ReviewData);
  // return db
  //   .collection('store')
  //   .doc(storeData.place_id)
  //   .set(storeData)
  //   .then(() => {
  //     console.log('Document successfully written!');
  //   });
};

export { postStoreData, GetMenuData, UpLoadPhotoToFirebase, UpLoadReview };
