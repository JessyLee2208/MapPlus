import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { userDatasCheck, getStoreData, getMenuData } from '../Utils/firebase';
import StoreCardL from '../Components/StoreCardL';
import { deviceSize } from '../responsive/responsive';

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

let unsubscribe;

function CollectionList(props) {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);

  const collectionCheck = useSelector((state) => state.collectionTitle);
  const collectionList = useSelector((state) => state.collectionList);

  const [storeArray, setStoreArray] = useState(null);

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
              let storeData = getStoreData(collect.storeCollectionID);
              store.push(storeData);
            }
          });
          Promise.all(store).then((res) => {
            const set = new Set();
            const result = res.filter((item) => (!set.has(item.name) ? set.add(item.name) : false));
            setStoreArray(result);
            console.log(result);
            dispatch({
              type: 'setCollectionList',
              data: result
            });
            let collectionMarks = [];
            result.forEach((a) => {
              let marks = {
                lat: a.geometry.lat,
                lng: a.geometry.lng,
                storename: a.name,
                place_id: a.place_id
              };
              collectionMarks.push(marks);
              dispatch({
                type: 'setCollectionMarks',
                data: collectionMarks
              });
            });
          });

          dispatch({
            type: 'setSearchMenu',
            data: collection
          });
        }
      }
      reviewData();
    }
  }, [userStatus]);

  function handleStoreListClick(e) {
    dispatch({
      type: 'setSelectedDish',
      data: null
    });
    dispatch({
      type: 'setSelectedTab',
      data: 'information'
    });
    dispatch({
      type: 'setSelectedStore',
      data: null
    });

    collectionList.forEach((product) => {
      console.log(product);
      if (e.target.id === product.name) {
        const newMarker = {
          lat: product.geometry.lat,
          lng: product.geometry.lng,
          storename: product.name
        };
        dispatch({
          type: 'setSelectedStore',
          data: product
        });
        dispatch({
          type: 'setCollectionTitle',
          data: false
        });

        dispatch({
          type: 'initMapMarkers',
          data: [newMarker]
        });

        dispatch({
          type: 'setCollectionMarks',
          data: []
        });

        if (product.deliver.uberEatUrl || product.deliver.foodPandaUrl) {
          function setData(data) {
            dispatch({
              type: 'setMenuData',
              data: data
            });
          }
          unsubscribe = getMenuData(product.name, setData);
        } else {
          dispatch({
            type: 'setMenuData',
            data: null
          });
        }
        dispatch({
          type: 'setCollectionTitle',
          data: false
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
  }

  // useEffect(() => {
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <Collection>
      {userStatus && storeArray ? (
        <>
          <BackBtn onClick={handleBack}>
            <Icon src="/back.png"></Icon>
            <Info>{collectionCheck}</Info>
          </BackBtn>
          <Collection>
            <InformationBox onClick={handleStoreListClick}>
              {storeArray.map((product, key) => (
                <StoreCardL key={product.place_id} product={product} id={product.name} service={props.service} />
              ))}
            </InformationBox>
          </Collection>
        </>
      ) : (
        <></>
      )}
    </Collection>
  );
}
export default CollectionList;
