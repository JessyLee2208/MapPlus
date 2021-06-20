import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { getStoreData, getDishData } from '../utils/firebase';
import StoreCardL from '../Components/StoreCardL';
import { Loading } from '../Components/UIComponents/LottieAnimat';
import { ItemTitle } from '../Components/UIComponents/Typography';
import { ButtonGhostRound } from '../Components/UIComponents/Button';
import useUserDataCheck from '../useHook/useUserDataCheck';
import { getStoreDetail } from '../utils/getMoreDetail';
import { deviceSize } from '../properties/properties';

const Collection = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
  z-index: 6;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
  }
`;
const InformationBox = styled.div`
  width: auto;
`;

const BackBtn = styled.div`
  position: flex;
  display: flex;
  top: 0;
  width: auto;
  height: 80px;
  background: #4285f4;
  align-items: center;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
  padding-right: 18px;
`;
const Info = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  margin: 1px;
`;

const Div = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  flex-direction: column;
`;

// let unsubscribe;

function CollectionList(props) {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);

  const collectionCheck = useSelector((state) => state.collectionTitle);
  const collectionList = useSelector((state) => state.collectionList);
  const collectionMarks = useSelector((state) => state.collectionMarks);

  const [storeArray, setStoreArray] = useState(null);
  const [searchMenu, setSearchMenu] = useState(null);
  const [processedDishData, setProcessedDishData] = useState([]);
  const [processedStoreData, setProcessedStoreData] = useState([]);

  const userData = useUserDataCheck();

  useEffect(() => {
    if (userStatus) {
      dispatch({
        type: 'setCollectionMarks',
        data: []
      });

      if (userData && userData.collection?.length > 0) {
        let collection = [];
        userData.collection.forEach(async (collect) => {
          if (collect.collectName === collectionCheck) {
            collection.push(collect);
          }
        });
        const set = new Set();
        let collectionStoreDatas = collection.filter((item) =>
          !set.has(item.storeName) ? set.add(item.storeName) : false
        );
        setProcessedDishData(collection);
        setProcessedStoreData(collectionStoreDatas);
      }
    }
  }, [userStatus, userData, collectionCheck, dispatch]);

  useEffect(() => {
    setStoreArray(null);
    setSearchMenu([]);
    if (userStatus && processedDishData.length > 0) {
      let store = [];
      let removed = [];
      const NewStoreData = [...processedStoreData];

      function getTopTenStoreData(NewStoreData) {
        const countMethod = NewStoreData.length / 10;
        const count = String(countMethod).split('.');
        let rule = count[0] === 0 ? 1 : parseInt(count[0]);

        for (let i = 0; i < rule; i++) {
          const countStart = rule === 1 ? 0 : rule * 10;
          let newArray = NewStoreData.slice(countStart, rule * 10);
          newArray.forEach(async (collect) => {
            const data = getStoreDetail(collect.storeCollectionID, props.service);
            store.push(data);
          });
        }
        getRestData(count);
      }

      function getRestData(count) {
        const countStart = count[0] * 10;
        let newArray = NewStoreData.slice(countStart);
        const restStoreDatas = newArray.map((resData) => getStoreData(resData.storeCollectionID));
        store.push(...restStoreDatas);
      }

      if (NewStoreData.length > 10) getTopTenStoreData(NewStoreData, getRestData);
      if (NewStoreData.length < 10) {
        removed = NewStoreData;
        removed.forEach((collect) => {
          const data = getStoreDetail(collect.storeCollectionID, props.service);
          store.push(data);
        });
      }

      Promise.all(store).then(async (res) => {
        setStoreArray(res);
        dispatch({
          type: 'setCollectionList',
          data: res
        });

        let collectionMarks = [];
        res.forEach((a) => {
          let marks = {
            geometry: a.geometry.location ? a.geometry : null,
            lat: a.geometry.location ? a.geometry.location.lat() : a.geometry.lat,
            lng: a.geometry.location ? a.geometry.location.lng() : a.geometry.lng,
            storename: a.name,
            place_id: a.place_id
          };
          collectionMarks.push(marks);
        });

        dispatch({
          type: 'setCollectionMarks',
          data: collectionMarks
        });
      });

      function searchMenuHandler() {
        if (processedDishData?.length > 0) {
          const DishsDetail = processedDishData.map((data) => getDishData(data.name));

          Promise.all(DishsDetail).then((dishDetail) => {
            dispatch({
              type: 'setSearchMenu',
              data: dishDetail
            });
            setSearchMenu(dishDetail);
          });
        }
      }
      searchMenuHandler();
    }
  }, [dispatch, processedDishData, processedStoreData, userStatus, props.service]);

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedStore',
      data: null
    });

    collectionList.forEach((collection) => {
      if (e.target.id === collection.name) {
        let mapMarker = collectionMarks.find((store) => store.storename === collection.name);
        const data = { mapMarker: mapMarker, collection: collection };

        dispatch({
          type: 'setCollectionData',
          data: data
        });
      }
    });

    searchMenu.forEach((menu) => {
      if (e.target.id === menu.name) {
        let mach = collectionMarks.find((store) => store.storename === menu.storeName);
        dispatch({
          type: 'initMapMarkers',
          data: [mach]
        });
        dispatch({
          type: 'setCollectionMarks',
          data: []
        });
      }
    });
  }

  function handleBack() {
    props.seachInput.current.value = '';

    dispatch({
      type: 'webDataInit'
    });

    props.setMapStore([]);
  }

  function handleExplore() {
    dispatch({
      type: 'setCollectionTitle',
      data: false
    });
    dispatch({
      type: 'setCollectionMarks',
      data: []
    });

    dispatch({
      type: 'setSelectedDish',
      data: null
    });
  }

  return (
    collectionCheck && (
      <Collection>
        {userStatus && storeArray ? (
          <>
            <BackBtn onClick={handleBack}>
              <Icon src="/back.png" />
              <Info>{collectionCheck}</Info>
            </BackBtn>
            <Collection>
              <InformationBox onClick={handleStoreListClick}>
                {storeArray.length > 0 ? (
                  storeArray.map((product) => (
                    <StoreCardL key={product.place_id} product={product} id={product.name} service={props.service} />
                  ))
                ) : (
                  <Div>
                    <ItemTitle textAlign={'center'} padding={'60px 0 20px 0'}>
                      目前沒有收藏任何菜品喔
                    </ItemTitle>
                    <ButtonGhostRound onClick={handleExplore}>探索菜單</ButtonGhostRound>
                  </Div>
                )}
              </InformationBox>
            </Collection>
          </>
        ) : (
          <Loading />
        )}
      </Collection>
    )
  );
}
export default CollectionList;
