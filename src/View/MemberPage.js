import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { deviceSize } from '../responsive/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { Description, H3Title, ItemTitle } from '../Components/UIComponents/Typography';
import { googleAccountLogOut, removeCollectList, removeDishToCollectList } from '../Utils/firebase';
import { ButtonGhostRound } from '../Components/UIComponents/Button';
import useMediaQuery from '../Utils/useMediaQuery';
import toast from 'react-hot-toast';
import { InfiniteLoading } from '../Components/UIComponents/LottieAnimat';
import Confim from '../Components/Confim';
import useUserDataCheck from '../Utils/useUserDataCheck';

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
  const collectData = useSelector((state) => state.collectData);

  const dispatch = useDispatch();

  const [wantList, setWantList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [customListCounts, setCustomListCount] = useState([]);
  // const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState('');

  const [comfimShow, setComfimShow] = useState(false);

  const checkAnimationLoader =
    wantList.length > 0 || likeList.length > 0 || starList.length > 0 || customListCounts.length > 0;

  const basicLists = [
    { collectName: '想去的地點', defaultIcon: '/falg.png', click: wantList },
    { collectName: '喜愛的地點', defaultIcon: '/heart.png', click: likeList },
    { collectName: '已加星號的地點', defaultIcon: '/active_star.png', click: starList }
  ];

  const userData = useUserDataCheck();

  useEffect(() => {
    let want = [];
    let like = [];
    let star = [];
    let custom = [];
    let ListCount = [];

    if (userData) {
      if (userData.collection && userData.collection.length !== 0) {
        userData.collection.forEach((collect) => {
          if (collect.collectName === '想去的地點') {
            want.push(collect);
          } else if (collect.collectName === '喜愛的地點') {
            like.push(collect);
          } else if (collect.collectName === '已加星號的地點') {
            star.push(collect);
          } else if (
            collect.collectName !== '已加星號的地點' &&
            collect.collectName !== '已加星號的地點' &&
            collect.collectName !== '想去的地點'
          ) {
            custom.push(collect);
          }
        });
      }

      customList.forEach((list, index) => {
        index = custom.filter((data) => data.collectName === list);

        ListCount.push(index.length);
      });

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

  const notify = () =>
    toast('成功登出', {
      style: {
        borderRadius: '4px',
        background: '#333',
        color: '#fff'
      }
    });

  const listNotify = () =>
    toast('目前此清單沒有任何品項', {
      style: {
        borderRadius: '4px',
        background: '#333',
        color: '#fff'
      }
    });

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

  return (
    <Member>
      <Confim
        title={'刪除清單'}
        description={'確定要刪除這份清單嗎？'}
        onClick={handleDeleteList}
        show={comfimShow}
        control={setComfimShow}
      ></Confim>

      {isMobile && (
        <Icon src="/close_big.png" style={{ position: 'fixed', right: '0px', top: '10px' }} onClick={close}></Icon>
      )}
      <AuthorImg src={userStatus.photoURL} alt=""></AuthorImg>
      <H3Title>{userStatus.displayName}</H3Title>
      <Description padding={'0 0 8px 0'}>{userStatus.email}</Description>
      <Separator style={{ width: '90%' }}></Separator>
      {!userData ? (
        <InfiniteLoading marginTop={20}></InfiniteLoading>
      ) : (
        <CollectLists>
          {basicLists.map((list) => (
            <ItemBox onClick={list.click.length > 0 ? handleCollectionList : listNotify}>
              <CollectListBox id={list.collectName}>
                <Icon src={list.defaultIcon} id={list.collectName}></Icon>
                <ItemTitle id={list.collectName} padding={'0 10px 0 0}'}>
                  {list.collectName}
                </ItemTitle>
                <Description id={list.collectName}>({list.click.length > 0 ? list.click.length : 0}) </Description>
              </CollectListBox>
            </ItemBox>
          ))}
          {customList.length > 0 &&
            customList.map((list, index) => (
              <EditList>
                <ItemBox onClick={customListCounts[index] > 0 ? handleCollectionList : listNotify}>
                  <CollectListBox id={list}>
                    <Icon src={'/custom.png'} id={list}></Icon>
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
            <CollectListBox id="已加星號的地點">
              <Icon src="/add.png" id="add" alt="add"></Icon>
              <ItemTitle id="add" padding={'0 10px 0 0}'}>
                新增清單
              </ItemTitle>
            </CollectListBox>
          </ItemBox>
        </CollectLists>
      )}
      {/* // checkAnimationLoader || userData === undefined ?(<></>):(<></>} */}
      <Separator></Separator>
      <ButtonGhostRound
        onClick={(e) => {
          googleAccountLogOut(e, dispatch);

          notify();

          dispatch({
            type: 'setCollectionTitle',
            data: false
          });
          dispatch({
            type: 'setloginToast',
            data: false
          });
          dispatch({
            type: 'setUserState',
            data: null
          });
          dispatch({
            type: 'setCustomList',
            data: []
          });
        }}
        margin={'6px 0 16px 0'}
      >
        登出
      </ButtonGhostRound>
    </Member>
  );
}

export default MemberPage;
