import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

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
      console.log('successfully upload');
    });
};

function getMenuData(selectedStoreName, callback) {
  return db
    .collection('menu')
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

function getDishData(dishName) {
  return db
    .collection('menu')
    .where('name', '==', dishName)
    .limit(1)
    .get()
    .then((data) => {
      const dishCollectionID = data.docs[0].id;
      let dataDocument = data.docs[0].data();

      const dishData = { ...dataDocument, dishCollectionID: dishCollectionID };
      return dishData;
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

const upLoadPhotoToFirebase = (e, newPhotoArray) => {
  let files = e.target.files;

  let filesArr = Object.values(files);
  let promises = [];
  filesArr.forEach((file) => {
    let storageRef = firebase.storage().ref('img/' + file.name);
    let task = storageRef.put(file);

    const photoRes = new Promise((res, rej) => {
      task.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        (error) => {
          console.log('error');
        },
        () => {
          res(task.snapshot.ref.getDownloadURL());
        }
      );
    });
    promises.push(photoRes);
  });
  return promises;
};

function getAllDishReviews(DishData, callback) {
  return db
    .collection('review')
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

  const averageRating = (Number(DishData.rating) + Number(ReviewData.rating)) / (reviewsCount + 1);

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
      rating: reviewsCount !== 0 ? averageRating : Number(ReviewData.rating),
      user_ratings_total: reviewsCount + 1
    })
    .then(() => {
      return reviewsCount !== 0 ? averageRating : Number(ReviewData.rating);
    });
};

///////////////////////////////////////////////

function addCollectList(usermail, collectName) {
  // const newSelectDish = { ...selectedDish, collectName: collectList };
  return db
    .collection('user')
    .doc(usermail)
    .set(
      {
        collectionList: firebase.firestore.FieldValue.arrayUnion(collectName)
      },
      { merge: true }
    );
}

function removeCollectList(usermail, collectName) {
  // const newSelectDish = { ...selectedDish, collectName: collectList };
  return db
    .collection('user')
    .doc(usermail)
    .update(
      {
        collectionList: firebase.firestore.FieldValue.arrayRemove(collectName)
      },
      { merge: true }
    );
}
////////////////////////////////////////////////

function addDishToCollectList(usermail, selectedDish, collectList) {
  const { rating, user_ratings_total, ...newSelectDish } = selectedDish;
  const updateSelectDish = { ...newSelectDish, collectName: collectList };
  console.log(updateSelectDish);
  return db
    .collection('user')
    .doc(usermail)
    .set(
      {
        collection: firebase.firestore.FieldValue.arrayUnion(updateSelectDish)
      },
      { merge: true }
    )
    .then(() => {
      console.log('ok');
    });
}

function removeDishToCollectList(usermail, selectedDish, collectList) {
  const { rating, user_ratings_total, ...newSelectDish } = selectedDish;
  const updateSelectDish = { ...newSelectDish, collectName: collectList };
  console.log(newSelectDish);
  return db
    .collection('user')
    .doc(usermail)
    .update(
      {
        collection: firebase.firestore.FieldValue.arrayRemove(updateSelectDish)
      },
      { merge: true }
    )
    .then(() => {
      console.log('remove ok');
    });
}

// function getAllDishReviews(DishData, callback) {
//   return db
//     .collection('review')
//     .where('dishCollectionID', '==', DishData.dishCollectionID)

//     .onSnapshot((querySnapshot) => {
//       const promises = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         promises.push(data);
//       });
//       callback(promises);
//     });
// }

// function userDatasCheck(userStatus) {
//   return db
//     .collection('user')
//     .doc(userStatus.email)
//     .get()
//     .then((data) => {
//       return data.data();
//     });
// }

function userDatasCheck(userStatus, callback) {
  return db
    .collection('user')
    .doc(userStatus.email)
    .onSnapshot((doc) => {
      const data = doc.data();
      // console.log(data);
      // const promises = [];
      // querySnapshot.forEach((doc) => {
      //   const data = doc.data();
      //   promises.push(data);
      // });
      callback(data);
    });
}

async function userReviewEdit(reviewData, newData, oldRating) {
  db.collection('review')
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

  const reviewsCount = await db
    .collection('review')
    .where('dishCollectionID', '==', reviewData.dishCollectionID)
    .get()
    .then((review) => {
      let dataDocument = review.docs[0].data();
      return review.size;
    });

  const DishReviews = await db
    .collection('menu')
    .doc(reviewData.dishCollectionID)
    .get()
    .then((review) => {
      let dataDocument = review.data();

      return dataDocument.rating;
    });

  const averageRating = (DishReviews * reviewsCount + Number(newData.rating) - oldRating) / reviewsCount;

  return db
    .collection('menu')
    .doc(reviewData.dishCollectionID)
    .update({
      rating: reviewsCount !== 0 ? averageRating : Number(reviewData.rating),
      user_ratings_total: reviewsCount
    })
    .then(() => {
      return reviewsCount !== 0 ? averageRating : Number(reviewData.rating);
    });
}

function userReviewGet(storeName, newData) {
  return db
    .collection('review')
    .where('email', '==', newData.email)
    .where('storeName', '==', storeName)
    .get()
    .then((data) => {
      let newArray = [];
      data.forEach((d) => {
        newArray.push(d.data());
      });
      return newArray;
    });
}

function googleAccountSignIn(e, dispatch, setMemberPageShow) {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // let user = {
      //   displayName: result.user.displayName,
      //   email: result.user.email,
      //   photoURL: result.user.photoURL,
      //   uid: result.user.uid
      // };
      setMemberPageShow(false);

      // dispatch({
      //   type: 'setUserState',
      //   data: user
      // });
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

function googleAccountStateChanged(callback) {
  return firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      let user = {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid
      };
      callback(user);
      return true;
    } else {
      return null;
    }
  });
}

function googleAccountLogOut(e, dispatch) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // dispatch({
      //   type: 'setUserState',
      //   data: null
      // });
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
  userDatasCheck,
  getAllDishReviews,
  addDishToCollectList,
  removeDishToCollectList,
  getStoreData,
  userReviewEdit,
  userReviewGet,
  getDishData,
  addCollectList,
  removeCollectList
};
