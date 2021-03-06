import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userDatasCheck } from '../Utils/firebase';

function useUserDataCheck() {
  const userStatus = useSelector((state) => state.userStatus);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({ collection: [], collectionList: [], reviews: [] });

  useEffect(() => {
    if (userStatus) {
      const unsubscribe = userDatasCheck(userStatus, callback);

      function callback(data) {
        setUserData(data || { collection: [], collectionList: [], reviews: [] });
        dispatch({
          type: 'setCustomList',
          data: data ? data.collectionList : []
        });
      }

      return () => {
        unsubscribe();
      };
    }
  }, [userStatus, dispatch]);

  return userData;
}

export default useUserDataCheck;
