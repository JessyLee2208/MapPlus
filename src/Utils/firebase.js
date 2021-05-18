import firebase from 'firebase';
import { useDispatch } from 'react-redux';

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
  // const dispatch = useDispatch();
  return new Promise((res, rej) => {
    db.collection('menu')
      .where('storeName', '==', selectedStoreName)
      .onSnapshot((querySnapshot) => {
        const promises = [];
        querySnapshot.forEach((doc) => {
          promises.push(doc.data());
        });
        console.log(promises);
        res(promises);
      });
  });
};

// function GetMenuData(selectedStoreName) {
//   const dispatch = useDispatch();
//   function MenuData() {
//     new Promise((res, rej) => {
//       db.collection('menu')
//         .where('storeName', '==', selectedStoreName)
//         .onSnapshot((querySnapshot) => {
//           const promises = [];
//           querySnapshot.forEach((doc) => {
//             promises.push(doc.data());
//           });
//           // console.log(promises);
//           res(promises);
//         });
//     }).then((res) => {
//       dispatch({
//         type: 'setMenuData',
//         data: res
//       });
//       console.log(res);
//     });
//   }
//   MenuData();
//   return <div></div>;
// }

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
  // let reviewCount = 0;
  let revirwRef = db.collection('menu').doc(await disdCollectionId);
  // if (Number(DishData.rating !== 0)) {
  const reviewCount = new Promise((res, rej) => {
    revirwRef
      .collection('reviews')
      .get()
      .then((review) => {
        console.log(review.size);
        res(review.size);
      });
  });
  // }
  // console.log(await reviewCount);
  const reviewCountRes = await reviewCount;
  const averageRating = (Number(DishData.rating) + Number(ReviewData.rating)) / reviewCountRes;

  let userReviewData = {
    dishCollectionID: await disdCollectionId,
    dishName: DishData.name,
    storeCollectionID: DishData.storeCollectionID,
    storeName: DishData.storeName
  };

  console.log(userReviewData);
  return revirwRef
    .collection('reviews')
    .doc(ReviewData.email)
    .set(ReviewData)
    .then(() => {
      revirwRef.update({
        rating: reviewCountRes !== 0 ? averageRating : Number(ReviewData.rating)
      });
      db.collection('user')
        .doc(ReviewData.email)
        .set(
          {
            reviews: firebase.firestore.FieldValue.arrayUnion(userReviewData)
          },
          { merge: true }
        );
      console.log('Dish document successfully written!');
    });
};

function userReviewCheck(userStatus) {
  // console.log(userStatus);
  return new Promise((res, rej) => {
    db.collection('user')
      .doc(userStatus.email)
      .get()
      .then((data) => {
        // let data = res.docs[0];
        // console.log(data.data());
        // res.forEach((d) => {
        //   console.log(d);
        // });
        res(data.data());
      });
  });
}

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

export {
  postStoreData,
  GetMenuData,
  UpLoadPhotoToFirebase,
  UpLoadReview,
  GoogleAccountSignIn,
  GoogleAccountStateChanged,
  GoogleAccountLogOut,
  userReviewCheck
};
