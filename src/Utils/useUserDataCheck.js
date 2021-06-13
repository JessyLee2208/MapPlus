import { useState, useEffect } from 'react';
import { userDatasCheck } from './firebase';
import { useDispatch, useSelector } from 'react-redux';

function useUserDataCheck() {
  const userStatus = useSelector((state) => state.userStatus);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = userDatasCheck(userStatus, callback);

    function callback(data) {
      setUserData(data);
      dispatch({
        type: 'setCustomList',
        data: data.collectionList
      });
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return userData;
}

export default useUserDataCheck;
