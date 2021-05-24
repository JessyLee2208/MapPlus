import firebase from 'firebase';
import { useSelector } from 'react-redux';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'map-780c3.firebaseapp.com',
  databaseURL:
    'https://map-780c3-default-rtdb.asia-southeast1.firebasedatabase.app',
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

function getMenuData(selectedStoreName, callback) {
  db.collection('menu')
    .where('storeName', '==', selectedStoreName)
    .onSnapshot((querySnapshot) => {
      const promises = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.dishCollectionID = doc.id;
        promises.push(data);
      });
      callback(promises);
    });
}

function getStoreData(collectionID) {
  return db
    .collection('store')
    .doc(collectionID)
    .get()
    .then((data) => {
      return data.data();
    });
}

const upLoadPhotoToFirebase = (e) => {
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

function getMenuReviews(DishData, callback) {
  db.collection('review')
    .where('dishCollectionID', '==', DishData.dishCollectionID)

    .onSnapshot((querySnapshot) => {
      const promises = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        promises.push(data);
      });
      callback(promises);
    });
}

const upLoadReview = async (ReviewData, DishData) => {
  const reviewsCount = await db
    .collection('review')
    .where('dishCollectionID', '==', DishData.dishCollectionID)
    .get()
    .then((review) => {
      return review.size;
    });

  const averageRating =
    (Number(DishData.rating) + Number(ReviewData.rating)) / (reviewsCount + 1);

  let userReviewData = {
    dishCollectionID: DishData.dishCollectionID,
    dishName: DishData.name,
    storeCollectionID: DishData.storeCollectionID,
    storeName: DishData.storeName
  };

  db.collection('review')
    .doc()
    .set({ ...ReviewData, ...userReviewData }, { merge: true })
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

function addDishToCollectList(usermail, selectedDish, collectList) {
  const newSelectDish = { ...selectedDish, collectName: collectList };
  return db
    .collection('user')
    .doc(usermail)
    .set(
      {
        collection: firebase.firestore.FieldValue.arrayUnion(newSelectDish)
      },
      { merge: true }
    );
}

function removeDishToCollectList(usermail, selectedDish, collectList) {
  const newSelectDish = { ...selectedDish, collectName: collectList };
  return db
    .collection('user')
    .doc(usermail)
    .update(
      {
        collection: firebase.firestore.FieldValue.arrayRemove(newSelectDish)
      },
      { merge: true }
    );
}

//1. caollback
// return => async awiat 接直

function userReviewCheck(userStatus) {
  return db
    .collection('user')
    .doc(userStatus.email)
    .get()
    .then((data) => {
      return data.data();
    });
}

function userReviewEdit(reviewData, newData) {
  return db
    .collection('review')
    .where('email', '==', reviewData.email)
    .where('dishCollectionID', '==', reviewData.dishCollectionID)
    .limit(1)
    .get()
    .then((data) => {
      let dataDocument = data.docs[0];
      dataDocument.ref.update({
        comment: newData.comment,
        imageUrl: newData.imageUrl,
        rating: newData.rating
      });
    });
}

function googleAccountSignIn(e, dispatch) {
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

function googleAccountStateChanged() {
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      return true;
    } else {
      return false;
    }
  });
}

function googleAccountLogOut(e, dispatch) {
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
  getMenuData,
  upLoadPhotoToFirebase,
  upLoadReview,
  googleAccountSignIn,
  googleAccountStateChanged,
  googleAccountLogOut,
  userReviewCheck,
  getMenuReviews,
  addDishToCollectList,
  removeDishToCollectList,
  getStoreData,
  userReviewEdit
  // GetDishCollection
};
