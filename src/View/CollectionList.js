import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { userDatasCheck, getStoreData } from '../Utils/firebase';
import StoreCardL from '../Components/StoreCardL';
import { deviceSize } from '../responsive/responsive';
import { Loading } from '../Components/UIComponents/LottieAnimat';
import { ItemTitle } from '../Components/UIComponents/Typography';
import { ButtonGhostRound } from '../Components/UIComponents/Button';

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

let unsubscribe;

function CollectionList(props) {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);

  const collectionCheck = useSelector((state) => state.collectionTitle);
  const collectionList = useSelector((state) => state.collectionList);
  const collectionMarks = useSelector((state) => state.collectionMarks);

  const storeData = useSelector((state) => state.storeData);

  const [storeArray, setStoreArray] = useState(null);
  const [searchMenu, setSearchMenu] = useState(null);

  useEffect(() => {
    if (userStatus) {
      async function reviewData() {
        let UserData = await userDatasCheck(userStatus);
        if (UserData && UserData.collection && UserData.collection.length > 0) {
          let collection = [];
          let store = [];

          UserData.collection.forEach(async (collect) => {
            if (collect.collectName === collectionCheck) {
              collection.push(collect);

              // let Data = getStoreData(collect.storeCollectionID);
              // store.push(Data);
            }
          });
          const set = new Set();
          let a = collection.filter((item) => (!set.has(item.storeName) ? set.add(item.storeName) : false));
          const NewRes = [...a];

          let removed = [];
          const count = NewRes.length / 10;
          const countNam = parseInt(count);

          for (let i = 0; i < countNam; i++) {
            let newArray = NewRes.slice(0, 10);

            newArray.forEach(async (collect) => {
              let Data = getStoreData(collect.storeCollectionID);
              store.push(Data);
            });
            removed = NewRes.splice(countNam * 10);
          }

          if (NewRes.length < 10) {
            removed = NewRes;
          }

          removed.forEach(async (collect) => {
            let Data = getStoreData(collect.storeCollectionID);
            store.push(Data);
          });

          Promise.all(store).then((res) => {
            setStoreArray(res);

            dispatch({
              type: 'setCollectionList',
              data: res
            });
            let collectionMarks = [];
            res.forEach((a) => {
              let marks = {
                lat: a.geometry.lat,
                lng: a.geometry.lng,
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

          dispatch({
            type: 'setSearchMenu',
            data: collection
          });
          setSearchMenu(collection);
        }
      }
      reviewData();
    }
  }, [userStatus, collectionCheck]);

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedStore',
      data: null
    });

    collectionList.forEach((product) => {
      if (e.target.id === product.name) {
        let mach = collectionMarks.find((store) => store.storename === product.name);

        dispatch({
          type: 'setCollectionTitle',
          data: false
        });

        dispatch({
          type: 'initMapMarkers',
          data: [mach]
        });

        dispatch({
          type: 'setCollectionMarks',
          data: []
        });
        dispatch({
          type: 'setStoreData',
          data: [product]
        });

        dispatch({
          type: 'setCollectionTitle',
          data: false
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
    dispatch({
      type: 'setCollectionTitle',
      data: false
    });
    dispatch({
      type: 'setCollectionMarks',
      data: []
    });

    if (storeData.length === 0 || !storeData) {
      dispatch({
        type: 'setSearchMenu',
        data: null
      });
    }
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

  // useEffect(() => {
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);
  // console.log(props.check);
  // console.log(collectionCheck);
  return (
    collectionCheck && (
      <Collection>
        {userStatus && storeArray ? (
          <>
            <BackBtn onClick={handleBack}>
              <Icon src="/back.png"></Icon>
              <Info>{collectionCheck}</Info>
            </BackBtn>
            <Collection>
              <InformationBox onClick={handleStoreListClick}>
                {storeArray.length > 0 ? (
                  storeArray.map((product, key) => (
                    <StoreCardL key={product.place_id} product={product} id={product.name} service={props.service} />
                  ))
                ) : (
                  <Div>
                    <ItemTitle textAlign={'center'} padding={'60px 0 20px 0'}>
                      目前沒有收藏任何評論喔
                    </ItemTitle>
                    <ButtonGhostRound onClick={handleExplore}>探索菜單</ButtonGhostRound>
                  </Div>
                )}
              </InformationBox>
            </Collection>
          </>
        ) : (
          <Loading></Loading>
        )}
      </Collection>
    )
  );
}
export default CollectionList;
