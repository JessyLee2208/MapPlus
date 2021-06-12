import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { addCollectList, addDishToCollectList, removeDishToCollectList, userDatasCheck } from '../Utils/firebase';
import { useDispatch, useSelector } from 'react-redux';

let CollectBox = styled.div`
  width: 220px;
  height: auto;

  position: absolute;
  background: #fff;
  top: 294px;
  right: 20px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
  border-radius: 8px;
  max-height: 360px;
  overflow: overlay;
`;

const InfoBold = styled.p`
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #black;
  margin: 0px 0 0 12px;
`;

const CollectListBox = styled.div`
  display: flex;
  margin: 0;
  padding: 8px 16px 10px 12px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
`;

const CollectListBoxSelect = styled.div`
  display: flex;
  margin: 0;
  padding: 8px 16px 8px 12px;
  align-items: center;
  cursor: pointer;

  background: #d9edff;
`;

const Icon = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 4px;
`;

const CollectTitle = styled.p`
  width: 100%;
  font-family: Roboto, 'Noto Sans TC', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #black;
  margin: 0px 0 0 10px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function Collection(props) {
  const dispatch = useDispatch();
  const selectedDish = useSelector((state) => state.selectedDish);
  const userStatus = useSelector((state) => state.userStatus);
  const collectData = useSelector((state) => state.collectData);
  const customList = useSelector((state) => state.customList);

  const [customCheck, setCustomCheck] = useState([]);
  const [want, setWant] = useState(false);
  const [like, setLike] = useState(false);
  const [stare, setStare] = useState(false);

  // let want = false;
  // let like = false;
  // let stare = false;
  // let result = [];

  useEffect(() => {
    const listArray = [];
    if (collectData !== []) {
      collectData.forEach((check) => {
        if (check.collectName === '想去的地點') {
          setWant(true);
        } else if (check.collectName === '喜愛的地點') {
          setLike(true);
        } else if (check.collectName === '已加星號的地點') {
          setStare(true);
        } else if (check.collectName !== '') {
          customList.map((list) => check.collectName === list && listArray.push(list));
        }
      });
      let result = Array.from(new Set(listArray));

      setCustomCheck(result);
    }
  }, []);

  if (selectedDish.imageUrl === '') {
    CollectBox = styled.div`
      width: 220px;
      height: auto;

      position: absolute;
      background: #fff;
      top: 154px;
      right: 20px;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
      border-radius: 8px;
      max-height: 360px;
      overflow: overlay;
    `;
  }
  if (selectedDish.imageUrl !== '') {
    CollectBox = styled.div`
      width: 220px;
      height: auto;

      position: absolute;
      background: #fff;
      top: 294px;
      right: 20px;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 0px 10px rgb(0 0 0 / 10%);
      border-radius: 8px;
      max-height: 360px;
      overflow: overlay;
    `;
  }

  function handleCollectListClick(e) {
    let selectedCollect = e.target.innerHTML;

    if (e.target.nodeName === 'IMG') {
      selectedCollect = e.target.alt;
    }

    if (e.target.id === 'collect') {
      addDishToCollectList(userStatus.email, selectedDish, selectedCollect).then(async () => {
        let data = await userDatasCheck(userStatus);

        if (data.collection.length !== 0) {
          let collectionArray = [];
          data.collection.forEach((collect) => {
            if (collect.storeCollectionID === selectedDish.storeCollectionID && collect.name === selectedDish.name) {
              collectionArray.push(collect);
            }
          });
          if (collectionArray.length !== 0) {
            dispatch({
              type: 'setCollectData',
              data: collectionArray
            });
          }
        } else {
          dispatch({
            type: 'setCollectData',
            data: []
          });
        }
        props.select(false);
      });
    }
    if (e.target.id === 'removeCollection') {
      removeDishToCollectList(userStatus.email, selectedDish, selectedCollect).then(async () => {
        let data = await userDatasCheck(userStatus);

        if (data.collection.length !== 0) {
          let collectionArray = [];
          data.collection.forEach((collect) => {
            if (collect.storeCollectionID === selectedDish.storeCollectionID && collect.name === selectedDish.name) {
              collectionArray.push(collect);
            }
          });

          if (collectionArray.length !== 0) {
            dispatch({
              type: 'setCollectData',
              data: collectionArray
            });
          } else {
            dispatch({
              type: 'setCollectData',
              data: []
            });
          }
        } else if (data.collection.length === 0) {
          dispatch({
            type: 'setCollectData',
            data: []
          });
        }
        props.select(false);
      });
    }
  }

  function callModal() {
    props.check(true);
    dispatch({
      type: 'setModalShow',
      data: true
    });
  }

  console.log('customList', ':', customList, 'customCheck', ':', customCheck);

  return (
    <CollectBox onClick={handleCollectListClick}>
      <InfoBold style={{ color: 'black', padding: '10px 0 10px 0px' }}>儲存至清單中</InfoBold>
      {/* <CollectLists> */}
      {want ? (
        <CollectListBoxSelect id="removeCollection">
          <Icon src="/falg_select.png" id="removeCollection" alt="想去的地點"></Icon>
          <CollectTitle id="removeCollection">想去的地點</CollectTitle>
        </CollectListBoxSelect>
      ) : (
        <CollectListBox>
          <Icon src="/falg.png" id="collect" alt="想去的地點"></Icon>
          <CollectTitle id="collect">想去的地點</CollectTitle>
        </CollectListBox>
      )}
      {like ? (
        <CollectListBoxSelect id="removeCollection">
          <Icon src="/heart_select.png" id="removeCollection" alt="喜愛的地點"></Icon>
          <CollectTitle id="removeCollection">喜愛的地點</CollectTitle>
        </CollectListBoxSelect>
      ) : (
        <CollectListBox>
          <Icon src="/heart.png" id="collect" alt="喜愛的地點"></Icon>
          <CollectTitle id="collect">喜愛的地點</CollectTitle>
        </CollectListBox>
      )}
      {stare ? (
        <CollectListBoxSelect id="removeCollection">
          <Icon src="/star_select.png" id="removeCollection" alt="已加星號的地點"></Icon>
          <CollectTitle id="removeCollection" value="已加星號的地點">
            已加星號的地點
          </CollectTitle>
        </CollectListBoxSelect>
      ) : (
        <CollectListBox>
          <Icon src="/active_star.png" id="collect" alt="已加星號的地點"></Icon>
          <CollectTitle id="collect" value="已加星號的地點">
            已加星號的地點
          </CollectTitle>
        </CollectListBox>
      )}

      {customList.length > 0 &&
        customList.map((list, index) =>
          customCheck.find((check) => check === list) !== undefined ? (
            <CollectListBoxSelect key={index} id="removeCollection">
              <Icon src="/custom_select.png" id="removeCollection" alt={list}></Icon>
              <CollectTitle id="removeCollection" value={list}>
                {list}
              </CollectTitle>
            </CollectListBoxSelect>
          ) : (
            <CollectListBox>
              <Icon src="/custom.png" id="collect" alt={list}></Icon>
              <CollectTitle id="collect" value={list}>
                {list}
              </CollectTitle>
            </CollectListBox>
          )
        )}
      {/* </CollectLists> */}
      <CollectListBox onClick={callModal}>
        <Icon src="/add.png" id="add" alt="add"></Icon>
        <CollectTitle id="add" value="add">
          新增清單
        </CollectTitle>
      </CollectListBox>
    </CollectBox>
  );
}

export default Collection;
