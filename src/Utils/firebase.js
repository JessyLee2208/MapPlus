import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';

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
let provider = new firebase.auth.GoogleAuthProvider();

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

const UpLoadReview = async (ReviewData, DishData) => {
  const disdCollectionId = new Promise((res, rej) => {
    db.collection('menu')
      .where('name', '==', DishData.name)
      .get()
      .then((dish) => {
        dish.forEach((doc) => {
          console.log(doc.id);
          res(doc.id);
        });
      });
  });

  console.log(await disdCollectionId);
  return db
    .collection('menu')
    .doc(await disdCollectionId)
    .collection('reviews')
    .doc(ReviewData.name)
    .set(ReviewData)
    .then(() => {
      console.log('Dish document successfully written!');
    });
};

function GoogleAccountSignIn(e, dispatch) {
  // const dispatch = useDispatch();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // let credential = result.credential;
      // let token = credential.accessToken;
      let user = result.user;

      dispatch({
        type: 'setUserState',
        data: user
      });
    })
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
      console.log(errorCode, errorMessage, email, credential);
    });
}

function GoogleAccountStateChanged() {
  const dispatch = useDispatch();
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      dispatch({
        type: 'setUserState',
        data: firebaseUser
      });
    } else {
      dispatch({
        type: 'setUserState',
        data: null
      });
    }
  });
}

function GoogleAccountLogOut() {
  firebase
    .auth()
    .signOut()
    .then()
    .catch((error) => {
      console.log(error);
    });
}
// const GoogleAccountSignOut = () => {};

export {
  postStoreData,
  GetMenuData,
  UpLoadPhotoToFirebase,
  UpLoadReview,
  GoogleAccountSignIn,
  GoogleAccountStateChanged,
  GoogleAccountLogOut
};
