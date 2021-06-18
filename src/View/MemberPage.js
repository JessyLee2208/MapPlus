import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Description, H3Title, ItemTitle } from '../Components/UIComponents/Typography';
import { ButtonGhostRound } from '../Components/UIComponents/Button';
import { InfiniteLoading } from '../Components/UIComponents/LottieAnimat';

import useMediaQuery from '../Utils/useMediaQuery';
import { googleAccountLogOut, removeCollectList, removeDishToCollectList } from '../Utils/firebase';
import useUserDataCheck from '../Utils/useUserDataCheck';
import { logOutNotify, noListNotify } from '../Utils/toasts';

import Confim from '../Components/Confim';
import { deviceSize, collectionBasicLists } from '../properties/properties';

const Member = styled.div`
  position: fixed;
  top: 58px;
  right: 10px;

  background: #ffffff;
  width: 300px;
  height: auto;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  box-shadow: 0 2px 7px rgb(0 0 0 / 11%), 0 0px 12px rgb(0 0 0 / 5%);
  border-radius: 8px;
  z-index: 3;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    border-radius: 0px;
    max-height: 100vh;
  }
`;

const AuthorImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;

  margin-top: 18px;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    margin-top: 50px;
  }
`;

const Separator = styled.div`
  width: 100%;
  min-height: 1px;
  background: #efefef;
  margin: 10px 0;
`;

const ItemBox = styled.div`
  width: 100%;
  padding: 4px 0;

  cursor: pointer;
  &:hover {
    background: #f7f7f7;
  }
`;

const CollectLists = styled.div`
  width: 100%;
  display: flex;
  margin: 0;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  @media screen and (max-width: ${deviceSize.mobile}px) {
    padding-left: 80px;
  }
`;

const CollectListBox = styled.div`
  display: flex;
  margin: 0;
  padding-left: 42px;
  // padding-right: 12px;
  margin: 4px 0;
  align-items: center;
  @media screen and (max-width: ${deviceSize.mobile}px) {
    padding-left: 80px;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 14px;
`;

const CloseButton = styled.a`
  margin-right: 22px;
  cursor: pointer;
  font-size: 20px;
  color: #afafaf;
  transition: all 100ms ease-in-out;
  &:hover {
    color: #185ee6;
  }
`;

const EditList = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background: #f7f7f7;
  }
`;

function MemberPage(props) {
  const isMobile = useMediaQuery(`( max-width: ${deviceSize.mobile}px )`);
  const userStatus = useSelector((state) => state.userStatus);
  const customList = useSelector((state) => state.customList);

  const userData = useUserDataCheck();
  const dispatch = useDispatch();

  const [wantList, setWantList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [customListCounts, setCustomListCount] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState('');
  const [comfimShow, setComfimShow] = useState(false);

  let basicLists = collectionBasicLists;
  basicLists.want.check = wantList;
  basicLists.like.check = likeList;
  basicLists.star.check = starList;
  let basicListsToArray = Object.values(basicLists);

  useEffect(() => {
    let want = [];
    let like = [];
    let star = [];
    let custom = [];
    let ListCount = [];

    if (userData && userData.collection && userData.collection.length !== 0) {
      userData.collection.forEach((collect) => {
        if (collect.collectName === collectionBasicLists.want.collectName) {
          want.push(collect);
        } else if (collect.collectName === collectionBasicLists.like.collectName) {
          like.push(collect);
        } else if (collect.collectName === collectionBasicLists.star.collectName) {
          star.push(collect);
        } else {
          custom.push(collect);
        }
      });

      if (customList) {
        customList.forEach((list, index) => {
          index = custom.filter((data) => data.collectName === list);
          ListCount.push(index.length);
        });
      }

      setCustomListCount(ListCount);

      setWantList(want);
      setLikeList(like);
      setStarList(star);
    }
  }, [customList, userData]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 300);
  //   return () => clearTimeout(timer);
  // }, []);

  function handleCollectionList(e) {
    dispatch({
      type: 'setCollectionTitle',
      data: e.target.id
    });
    dispatch({
      type: 'setCollectionList',
      data: []
    });
    props.show(false);
  }

  function close() {
    props.show(false);
  }

  function handleDeleteList(e) {
    removeCollectList(userStatus.email, deleteTarget.id).then(async () => {
      if (deleteTarget.name > 0) {
        const deleteData = userData.collection.filter((data) => data.collectName === deleteTarget.id);

        deleteData.forEach((selectedDish) => {
          removeDishToCollectList(userStatus.email, selectedDish, deleteTarget.id);
        });
      }
    });
    setComfimShow(false);
  }

  function showConfim(e) {
    setDeleteTarget(e.target);
    setComfimShow(true);
  }

  function callModal() {
    props.check(true);
  }

  const logOutOnClickHandler = (e) => {
    googleAccountLogOut(e, dispatch);

    logOutNotify();
    dispatch({
      type: 'setlogOutData'
    });
  };

  return (
    <Member>
      <Confim
        title={'刪除清單'}
        description={'確定要刪除這份清單嗎？'}
        onClick={handleDeleteList}
        show={comfimShow}
        control={setComfimShow}
      />

      {isMobile && (
        <Icon src="/close_big.png" style={{ position: 'fixed', right: '0px', top: '10px' }} onClick={close} />
      )}
      <AuthorImg src={userStatus.photoURL} alt="" />
      <H3Title>{userStatus.displayName}</H3Title>
      <Description padding={'0 0 8px 0'}>{userStatus.email}</Description>
      <Separator style={{ width: '90%' }} />
      {!userData ? (
        <InfiniteLoading marginTop={20} />
      ) : (
        <CollectLists>
          {basicListsToArray.map((list, index) => (
            <ItemBox onClick={list.check.length > 0 ? handleCollectionList : noListNotify} key={index}>
              <CollectListBox id={list.collectName}>
                <Icon src={list.defaultIcon} id={list.collectName} />
                <ItemTitle id={list.collectName} padding={'0 10px 0 0}'}>
                  {list.collectName}
                </ItemTitle>
                <Description id={list.collectName}>({list.check.length > 0 ? list.check.length : 0}) </Description>
              </CollectListBox>
            </ItemBox>
          ))}
          {customList?.map((list, index) => (
            <EditList key={index}>
              <ItemBox onClick={customListCounts[index] > 0 ? handleCollectionList : noListNotify}>
                <CollectListBox id={list}>
                  <Icon src={'/custom.png'} id={list} />
                  <ItemTitle
                    id={list}
                    padding={'0 10px 0 0}'}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '112px'
                    }}
                  >
                    {list}
                  </ItemTitle>

                  <Description id={list}>({customListCounts.length > 0 ? customListCounts[index] : 0})</Description>
                </CollectListBox>
              </ItemBox>
              <CloseButton onClick={showConfim} id={list} name={customListCounts[index]}>
                ×
              </CloseButton>
            </EditList>
          ))}

          <ItemBox onClick={callModal}>
            <CollectListBox id="add">
              <Icon src="/add.png" id="add" alt="add" />
              <ItemTitle id="add" padding={'0 10px 0 0}'}>
                新增清單
              </ItemTitle>
            </CollectListBox>
          </ItemBox>
        </CollectLists>
      )}

      <Separator />
      <ButtonGhostRound onClick={logOutOnClickHandler} margin={'6px 0 16px 0'}>
        登出
      </ButtonGhostRound>
    </Member>
  );
}

export default MemberPage;
