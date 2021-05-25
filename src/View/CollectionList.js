import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllDishReviews,
  userDatasCheck,
  getStoreData
} from '../Utils/firebase';
import StoreCardL from '../Components/StoreCardL';

const Collection = styled.div`
  position: relative;
  background: #ffffff;
  width: 435px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
  z-index: 10;
`;
const InformationBox = styled.div`
  width: 435px;
`;

const BackBtn = styled.div`
  position: flex;
  display: flex;
  top: 0;
  width: 435px;
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

const Data = {
  collectName: '想去的地點',
  dishCollectionID: '5HvockQsac640laKhn4A',
  imageUrl:
    'https://d1ralsognjng37.cloudfront.net/a01565f2-6fe1-48bf-ac1c-bcc3f0df97f3.jpeg',
  name: '墨西哥BBQ煙燻豬肉捲餅',
  plus_code: {
    global_code: '7QQ32G88+95',
    compound_code: '2G88+95 永和區 新北市'
  },
  price: 120,
  rating: 0,
  storeCollectionID: 'ChIJS8TJdhypQjQRS8vJNQ1cFRM',
  storeName: 'miniB 手作漢堡',
  user_ratings_total: 0
};

function CollectionList() {
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.userStatus);
  const collectionCheck = useSelector((state) => state.collectionList);

  const [collectionArray, setCollectionArray] = useState(null);
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
            const result = res.filter((item) =>
              !set.has(item.name) ? set.add(item.name) : false
            );
            setStoreArray(result);
            console.log(result);
            // dispatch({
            //   type: 'updateMapMarkers',
            //   data: result
            // });
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

          setCollectionArray(collection);
          dispatch({
            type: 'setSearchMenu',
            data: collection
          });
        }
      }
      reviewData();
    }
  }, [userStatus]);

  function handleBack() {
    dispatch({
      type: 'setCollectionList',
      data: false
    });
    dispatch({
      type: 'setCollectionMarks',
      data: []
    });
  }

  return (
    <Collection>
      {userStatus && storeArray ? (
        <>
          <BackBtn onClick={handleBack}>
            <Icon src="/back.png"></Icon>
            <Info>{collectionCheck}</Info>
          </BackBtn>
          <Collection>
            <InformationBox>
              {storeArray.map((product, key) => (
                <StoreCardL
                  key={product.place_id}
                  product={product}
                  id={product.name}
                />
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
