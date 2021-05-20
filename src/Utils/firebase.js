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
  // const promises = [];
  return new Promise((res, rej) => {
    db.collection('menu')
      .where('storeName', '==', selectedStoreName)
      .onSnapshot((querySnapshot) => {
        const promises = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.dishCollectionID = doc.id;
          promises.push(data);
        });
        // console.log(promises);
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

function GetMenuReviews(DishData) {
  return new Promise((res, rej) => {
    db.collection('review')
      .where('dishCollectionID', '==', DishData.dishCollectionID)
      // .doc(DishData.disdCollectionId)
      .onSnapshot((querySnapshot) => {
        // console.log(querySnapshot.size);
        const promises = [];
        querySnapshot.forEach((doc) => {
          // console.log(doc);
          const data = doc.data();
          promises.push(data);
        });
        // console.log(promises);
        res(promises);
        // if (querySnapshot) {
        //   return querySnapshot.doc;
        // } else {
        //   console.log('No such document!');
        //   return null;
        //   // console.log(review);
        //   // res(review.size);
        // }
      });
  });
}

const UpLoadReview = async (ReviewData, DishData) => {
  const reviewsCount = await db
    .collection('review')
    .where('dishCollectionID', '==', DishData.dishCollectionID)
    .get()
    .then((review) => {
      // console.log(review.size);
      return review.size;
    });

  console.log(reviewsCount);

  const averageRating = (Number(DishData.rating) + Number(ReviewData.rating)) / (reviewsCount + 1);
  console.log(averageRating);

  let userReviewData = {
    dishCollectionID: DishData.dishCollectionID,
    dishName: DishData.name,
    storeCollectionID: DishData.storeCollectionID,
    storeName: DishData.storeName
  };

  //這是編輯評論的寫法
  // db.collection('review')
  //   .doc()
  //   .set({ ...ReviewData, ...userReviewData }, { merge: true })
  //   .then(() => {
  //     console.log('Dish document successfully written!');
  //   });
  db.collection('review')
    .doc()
    .set({ ...ReviewData, ...userReviewData })
    .then(() => {
      console.log('Dish document successfully written!');
    });

  db.collection('user')
    .doc(ReviewData.email)
    .set(
      {
        reviews: firebase.firestore.FieldValue.arrayUnion(userReviewData)
      },
      { merge: true }
    );

  return db
    .collection('menu')
    .doc(DishData.dishCollectionID)
    .update({
      rating: reviewsCount !== 0 ? averageRating : Number(ReviewData.rating)
    })
    .then(() => {
      return reviewsCount !== 0 ? averageRating : Number(ReviewData.rating);
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
      return true;
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
  // const dispatch = useDispatch();
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      return true;
      //   dispatch({
      //     type: 'setUserState',
      //     data: firebaseUser
      // });
    } else {
      return false;
      //   dispatch({
      //     type: 'setUserState',
      //     data: null
      //   });
    }
  });
}

function GoogleAccountLogOut(e, dispatch) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('logout OK!!');
      dispatch({
        type: 'setUserState',
        data: null
      });
      return false;
    })
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
  userReviewCheck,
  GetMenuReviews
  // GetDishCollection
};
