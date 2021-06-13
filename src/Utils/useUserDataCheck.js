import { useState, useEffect } from 'react';
import { userDatasCheck } from './firebase';
import { useDispatch, useSelector } from 'react-redux';

function useUserDataCheck() {
  const userStatus = useSelector((state) => state.userStatus);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({ collection: [], collectionList: [], reviews: [] });

  useEffect(() => {
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
  }, []);

  return userData;
}

export default useUserDataCheck;
